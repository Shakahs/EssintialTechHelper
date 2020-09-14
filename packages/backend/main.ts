import fetch, { RequestInit } from "node-fetch";
import { apiParameters, apiUrl } from "./constants";
import { APIResult, Ticket } from "../../types";
import * as https from "https";
import { filter, replace, sortBy, forOwn } from "lodash";
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
import { createConnection } from "typeorm";
import { TicketEntity } from "./database/entity/Ticket";
import { Connection } from "typeorm/connection/Connection";

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

const geoCode = async (res: APIResult): Promise<Ticket[]> => {
   const ticketResult: Ticket[] = [];

   for await (const rawJSONTicket of res.hits.hits) {
      try {
         const geoQuery = `${rawJSONTicket._source.siteAddr}, ${rawJSONTicket._source.srmSiteCity}, ${rawJSONTicket._source.srmSiteState}`;
         const geoQueryURLSafe = replace(geoQuery, "#", "");
         const mapboxResponse = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${geoQueryURLSafe}.json?limit=1&access_token=${mapboxToken}`
         );
         const mapboxGeoPoint: GeoJSON.FeatureCollection<Point> = await mapboxResponse.json();

         // console.log(
         //    apiTicket._source.detailId,
         //    `${apiTicket._source.createDt[0].substr(
         //       0,
         //       10
         //    )}${apiTicket._source.createTm[0].substr(10)}`
         // );

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
            // geocoding: mapboxGeoPoint,
            ticketNumber: rawJSONTicket._source.detailId,
            partNumber: rawJSONTicket._source.srmModelNo[0],
            partDescription: rawJSONTicket._source.srmModelDesc[0],
            created: actualDate,
            longitude: mapboxGeoPoint.features[0].geometry.coordinates[0],
            latitude: mapboxGeoPoint.features[0].geometry.coordinates[1],
         });
      } catch (e) {
         console.log(e);
      }
   }

   return ticketResult;
};

const filterAndSort = (unfilteredTickets: Ticket[]): Ticket[] => {
   //filter out tickets older than 1 week
   const weekAgo = subWeeks(new Date(), 1);
   const filteredTickets = filter<Ticket>(unfilteredTickets, (o) =>
      isAfter(o.created, weekAgo)
   );

   //sort by city name
   const sortedTickets = sortBy<Ticket>(filteredTickets, (o) => [o.city]);

   return sortedTickets;
};

const persistTickets = async (
   tickets: Ticket[],
   connection: Connection
): Promise<number> => {
   let persistedTickets = 0;

   tickets.forEach((newTicket) => {
      let dbInsert = new TicketEntity();
      dbInsert.ticketNumber = newTicket.ticketNumber;
      dbInsert.priority = newTicket.priority;
      dbInsert.address = newTicket.address;
      dbInsert.city = newTicket.city;
      dbInsert.created = newTicket.created;
      dbInsert.latitude = newTicket.latitude;
      dbInsert.longitude = newTicket.longitude;
      dbInsert.partNumber = newTicket.partNumber;
      dbInsert.partDescription = newTicket.partDescription;

      try {
         connection.manager.save(dbInsert);
         persistedTickets++;
      } catch (err) {
         console.log("Could not insert", newTicket.ticketNumber);
      }
   });
   return persistedTickets;
};

async function main() {
   try {
      const dbConnection = await createConnection();
      const rawTickets = await pullRawData();
      const processedTickets = await geoCode(rawTickets);
      const filteredTickets = filterAndSort(processedTickets);
      // console.log(filteredTickets);
      const persistedTickets = await persistTickets(
         filteredTickets,
         dbConnection
      );
      await dbConnection.close();
      console.log("persisted tickets:", persistedTickets);
   } catch (err) {
      console.log("An error occurred in main:", err);
   }
}

if (require.main === module) {
   main();
   setInterval(main, 5000);
}
