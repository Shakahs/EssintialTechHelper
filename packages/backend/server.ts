require("dotenv").config();
import * as path from "path";
import { createConnection, getConnection, getManager } from "typeorm";
import { Connection } from "typeorm/connection/Connection";
import { TicketEntity } from "./database/entity/Ticket";
import fastify from "fastify";
import ormConfig from "./ormConfig2";

const server = fastify({ logger: true });
let dbConnection: undefined | Connection;

const staticPath =
   process.env["NODE_ENV"] === "production"
      ? "/app/static"
      : path.join(__dirname, "../../build/frontend");

console.log("staticpath is", staticPath);

server.register(require("fastify-static"), {
   root: staticPath,
});

server.get("/api/available", async (request, reply) => {
   //@ts-ignore
   const ticketResults = await getConnection()
      .createQueryBuilder(TicketEntity, "t")
      .where({ visible: true })
      .getMany();
   return ticketResults;
});

const start = async () => {
   try {
      console.log("starting fastify");
      //@ts-ignore
      await createConnection(ormConfig);

      await server.listen(3000, "0.0.0.0");
      server.log.info(`server listening on ${server.server.address().port}`);
   } catch (err) {
      server.log.error(err);
      process.exit(1);
   }
};

start();
