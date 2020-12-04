import { random } from "lodash";

require("dotenv").config();
import * as path from "path";
import * as fs from "fs";
import { createConnection, getConnection, getManager } from "typeorm";
import { Connection } from "typeorm/connection/Connection";
import { TicketEntity } from "./database/entity/Ticket";
import fastify from "fastify";
import ormConfig from "./ormConfig2";
import { Tracker } from "../../types";
import fetch from "node-fetch";
import FormData from "form-data";
import { FastifyLoggerInstance } from "fastify/types/logger";

const easypostAPIToken = process.env["EASYPOST_TOKEN"];

const server = fastify({ logger: true });
let dbConnection: undefined | Connection;

const staticPath =
   process.env["NODE_ENV"] === "production"
      ? "/app/static"
      : path.join(__dirname, "../../build/frontend");

const indexHTML = path.join(staticPath, "index.html");

console.log("staticpath is", staticPath);

server.register(require("fastify-static"), {
   root: staticPath,
});

server.setNotFoundHandler((req, reply) => {
   reply.status(200);
   reply.type("text/html").send(fs.createReadStream(indexHTML));
});

server.get("/api/available", async (request, reply) => {
   //@ts-ignore
   const ticketResults = await getConnection()
      .createQueryBuilder(TicketEntity, "t")
      .where({ visible: true })
      .getMany();
   return ticketResults;
});

const pollTracking = async (
   trackingNumber: string,
   log: FastifyLoggerInstance
): Promise<Tracker> => {
   let attempts = 0;
   while (attempts < 5) {
      attempts++;
      let trackerResult: Tracker;
      log.info(
         `fetching: https://api.easypost.com/v2/trackers/${trackingNumber}, attempt: ${attempts}`
      );
      const trackerGetResultRaw = await fetch(
         `https://api.easypost.com/v2/trackers/${trackingNumber}`,
         {
            headers: {
               Authorization: `Basic RVpBSzI4NDk4M2UyMDRkOTQ5OGM4Nzc2ZGQ5MWEwNzExNTE1em1tZFRsSkt3R0ZKOTNpVm9NcTBNUTo=`,
            },
         }
      );
      if (trackerGetResultRaw.ok) {
         trackerResult = await trackerGetResultRaw.json();
         if (trackerResult.status !== "unknown") {
            return trackerResult;
         }
      } else {
         throw new Error("Upstream API error");
      }

      await new Promise((resolve) =>
         setTimeout(resolve, (2 ^ attempts) * 1000 + random(0, 1000))
      );
   }

   throw new Error("Could not poll for tracker result");
};

server.get("/api/tracking", async (req, reply) => {
   //@ts-ignore
   const { trackingNumber } = req.query;
   if (!trackingNumber) {
      reply.status(400);
      reply.send("trackingNumber required");
      return;
   }

   try {
      const result = await pollTracking(trackingNumber, req.log);
      return result;
   } catch (e) {
      req.log.info("creating new tracker");
      const data = new FormData();
      data.append("tracker[carrier]", "FedEx");
      data.append("tracker[tracking_code]", trackingNumber);

      const trackerPostResultRaw = await fetch(
         "https://api.easypost.com/v2/trackers",
         {
            method: "POST",
            headers: {
               Authorization: `Basic RVpBSzI4NDk4M2UyMDRkOTQ5OGM4Nzc2ZGQ5MWEwNzExNTE1em1tZFRsSkt3R0ZKOTNpVm9NcTBNUTo=`,
            },
            body: data,
         }
      );

      if (trackerPostResultRaw.ok) {
         return pollTracking(trackingNumber, req.log);
      } else {
         reply.status(500);
         return "Unable to create tracker, try again later";
      }
   }
});

const start = async () => {
   try {
      console.log("connecting to database");
      //@ts-ignore
      await createConnection(ormConfig);
   } catch (err) {
      console.log("database connection failed:", err);
   }

   try {
      console.log("starting fastify");
      await server.listen(3000, "0.0.0.0");
      server.log.info(`server listening on ${server.server.address().port}`);
   } catch (err) {
      server.log.error("starting fastify failed:", err);
      process.exit(1);
   }
};

start();
