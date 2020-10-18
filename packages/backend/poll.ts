require("dotenv").config();
import fetch, { RequestInit } from "node-fetch";
import { apiParameters, apiUrl } from "./constants";
import { APIResult, Ticket, UngeocodedTicket } from "../../types";
import * as https from "https";
import { filter, replace, sortBy, round } from "lodash";
import { mapboxToken } from "../../constants";
import { GeoJSON, Point } from "geojson";
import {
   parseISO,
   subHours,
   subWeeks,
   isAfter,
   format as dateFormat,
   set as dateSet,
} from "date-fns";
import { createConnection, getConnection } from "typeorm";
import { TicketEntity } from "./database/entity/Ticket";
import { Connection } from "typeorm/connection/Connection";
const Twilio = require("twilio");
import * as turfHelpers from "@turf/helpers";
import { distance as turfDistance } from "@turf/turf";
import ormConfig from "./ormConfig2";
import { stripIndents } from "common-tags";

const twilioClient = Twilio(
   process.env["TWILIO_ACCOUNT_SID"],
   process.env["TWILIO_ACCOUNT_TOKEN"]
);

async function pullRawData(): Promise<APIResult> {
   const parameters: RequestInit = apiParameters;
   parameters.agent = new https.Agent({
      rejectUnauthorized: false,
   });

   const rawData = await fetch(apiUrl, apiParameters);
   if (!rawData.ok) {
      throw new Error("Essintial API response was not okay");
   }

   const rawJson = await rawData.json();
   return rawJson;
}

const transformFromAPI = (res: APIResult): UngeocodedTicket[] => {
   const ticketResult: UngeocodedTicket[] = [];

   for (let rawJSONTicket of res.hits.hits) {
      const apiProvidedDate = parseISO(rawJSONTicket._source.createDt[0]);
      const providedTime = parseISO(rawJSONTicket._source.createTm[0]);
      const actualDate = new Date(
         apiProvidedDate.getUTCFullYear(),
         apiProvidedDate.getUTCMonth(),
         apiProvidedDate.getUTCDate(),
         providedTime.getHours(),
         providedTime.getMinutes()
      );
      ticketResult.push({
         siteName: rawJSONTicket._source.srmSiteName,
         priority: rawJSONTicket._source.srmPrio[0],
         address: rawJSONTicket._source.siteAddr,
         city: rawJSONTicket._source.srmSiteCity,
         state: rawJSONTicket._source.srmSiteState,
         ticketNumber: rawJSONTicket._source.detailId,
         partNumber: rawJSONTicket._source.srmModelNo[0],
         partDescription: rawJSONTicket._source.srmModelDesc[0],
         created: actualDate,
      });
   }

   return ticketResult;
};

const geoCodeTickets = async (ungeo: UngeocodedTicket[]): Promise<Ticket[]> => {
   const geoCodedTickets: Ticket[] = [];

   for await (const t of ungeo) {
      try {
         const geoQuery = `${t.address}, ${t.city}, ${t.state}`;
         const geoQueryURLSafe = replace(geoQuery, "#", "");
         const mapboxResponse = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${geoQueryURLSafe}.json?limit=1&access_token=${mapboxToken}&country=US`
         );
         const mapboxGeoPoint: GeoJSON.FeatureCollection<Point> = await mapboxResponse.json();

         geoCodedTickets.push({
            ...t,
            longitude: mapboxGeoPoint.features[0].geometry.coordinates[0],
            latitude: mapboxGeoPoint.features[0].geometry.coordinates[1],
         });
      } catch (e) {
         console.log(e);
      }
   }

   return geoCodedTickets;
};

const filterBadTickets = (
   unfilteredTickets: UngeocodedTicket[]
): UngeocodedTicket[] => {
   //filter out tickets older than 1 week
   const weekAgo = subWeeks(new Date(), 1);
   const filteredTickets = filter(unfilteredTickets, (o) =>
      isAfter(o.created, weekAgo)
   );

   //sort by city name
   // const sortedTickets = sortBy(filteredTickets, (o) => [o.city]);

   return filteredTickets;
};

const filterExistingTickets = async (
   candidates: UngeocodedTicket[],
   connection: Connection
): Promise<UngeocodedTicket[]> => {
   const newTickets: UngeocodedTicket[] = [];
   for await (const c of candidates) {
      const result = await TicketEntity.findOne(c.ticketNumber);
      if (result === undefined) {
         newTickets.push(c);
      }
   }
   return newTickets;
};

const persistTickets = async (
   tickets: Ticket[],
   connection: Connection
): Promise<Ticket[]> => {
   let persistedTickets: Ticket[] = [];

   await connection.transaction(async (transaction) => {
      await transaction
         .createQueryBuilder()
         .update(TicketEntity)
         .set({ visible: false })
         .execute();

      for await (const newTicket of tickets) {
         try {
            //upsert
            let dbInsert = TicketEntity.create(newTicket);
            dbInsert.visible = true;
            await transaction.save(dbInsert);
            persistedTickets.push(newTicket);
         } catch (err) {
            console.log("Could not insert", newTicket.ticketNumber, err);
         }
      }
   });

   return persistedTickets;
};

const sendNotifications = async (tickets: Ticket[]) => {
   for await (const newTicket of tickets) {
      const distance = turfDistance(
         turfHelpers.point([newTicket.longitude, newTicket.latitude]),
         turfHelpers.point([
            Number(process.env["ORIGIN_LONGITUDE"]),
            Number(process.env["ORIGIN_LATITUDE"]),
         ]),
         //@ts-ignore
         { units: "miles" }
      );
      const roundedDistance = round(distance);
      console.log(`${newTicket.ticketNumber} is ${roundedDistance} miles away`);

      if (distance <= Number(process.env["NOTIFY_DISTANCE"])) {
         try {
            const messageResult = await twilioClient.messages.create({
               to: process.env["RECIPIENT_PHONE_NUMBER"],
               from: process.env["SENDER_PHONE_NUMBER"],
               body: stripIndents`${newTicket.ticketNumber}, P${
                  newTicket.priority
               }
                ${newTicket.address}, ${
                  newTicket.city
               } (${roundedDistance} miles) 
                ${newTicket.partNumber}, ${newTicket.partDescription}
                https://www.google.com/maps/search/?api=1&query=${encodeURI(
                   `Rite Aid, ${newTicket.address},${newTicket.city}, CA`
                )}`,
            });
            console.log(
               `SMS ${messageResult.sid} sent for ${newTicket.ticketNumber}`
            );
         } catch (err) {
            console.log(
               `There was an error sending a notification for ${newTicket.ticketNumber}:`,
               err
            );
         }
      }
   }
};

async function poll() {
   try {
      const dbConnection = await getConnection();
      console.log("polling ticket API");
      const rawTickets = await pullRawData();
      const transformedTickets = transformFromAPI(rawTickets);
      const filteredTickets = filterBadTickets(transformedTickets);
      console.log(`${filteredTickets.length} valid tickets found`);
      const newTickets = await filterExistingTickets(
         filteredTickets,
         dbConnection
      );
      console.log(`${newTickets.length} new tickets found`);
      const geoCodedTickets = await geoCodeTickets(newTickets);

      // console.log(filteredTickets);
      const persistedTickets = await persistTickets(
         geoCodedTickets,
         dbConnection
      );
      console.log("persisted tickets:", persistedTickets.length);
      await sendNotifications(persistedTickets);
   } catch (err) {
      console.log("An error occurred in main:", err);
      process.exit(1);
   }
}

if (require.main === module) {
   //@ts-ignore
   createConnection(ormConfig)
      .then(() => {
         console.log("poller started");
         poll();
         //set to 10 minutes for now
         setInterval(poll, 1000 * 60 * 10);
      })
      .catch((err) => {
         console.log("An error occurred in startup:", err);
         process.exit(1);
      });
}
