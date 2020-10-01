require("dotenv").config();
import * as path from "path";
import * as fs from "fs";
import { createConnection, getConnection, getManager } from "typeorm";
import { Connection } from "typeorm/connection/Connection";
import { TicketEntity } from "./database/entity/Ticket";
import fastify from "fastify";
import ormConfig from "./ormConfig2";
import { Tracker } from "../../types";
const Easypost = require("@easypost/api");
const easypostAPI = new Easypost(process.env["EASYPOST_TOKEN"]);

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
   if (trackingNumber) {
      const trackerPost = new easypostAPI.Tracker({
         tracking_code: trackingNumber,
         carrier: "FedEx",
      });
      const trackerPostResult: Tracker = await trackerPost.save();
      if (trackerPostResult?.object === "Tracker") {
         return trackerPostResult;
      } else {
         reply.status(500);
         reply.send("");
      }
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
