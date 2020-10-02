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

server.get("/api/tracking", async (req, reply) => {
   //@ts-ignore
   const { trackingNumber } = req.query;
   if (!trackingNumber) {
      reply.status(400);
      reply.send("trackingNumber required");
      return;
   }

   const data = new FormData();
   data.append("tracker[carrier]", "FedEx");
   data.append("tracker[tracking_code]", trackingNumber);

   const trackerResultRaw = await fetch(
      "https://api.easypost.com/v2/trackers",
      {
         method: "POST",
         headers: {
            // "Content-Type": `multipart/form-data' boundary=${data.getBoundary()}`,
            // "Content-Length": `${data.getLengthSync()}`,
            // Authorization: `Basic ${easypostAPIToken}`,
            Authorization: `Basic RVpBSzI4NDk4M2UyMDRkOTQ5OGM4Nzc2ZGQ5MWEwNzExNTE1em1tZFRsSkt3R0ZKOTNpVm9NcTBNUTo=`,
         },
         body: data,
      }
   );
   const trackerResult: Tracker = await trackerResultRaw.json();

   if (trackerResult?.object === "Tracker") {
      return trackerResult;
   } else {
      reply.status(500);
      reply.send("");
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
