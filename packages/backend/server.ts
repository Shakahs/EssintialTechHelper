require("dotenv").config();
import * as path from "path";
import { createConnection, getConnection, getManager } from "typeorm";
import { Connection } from "typeorm/connection/Connection";
import { TicketEntity } from "./database/entity/Ticket";
const fastify = require("fastify")({ logger: true });
import ormConfig from "./ormConfig2";

let dbConnection: undefined | Connection;

fastify.register(require("fastify-static"), {
   root: path.join(__dirname, "../../build/frontend"),
});

fastify.get("/api/available", async (request, reply) => {
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
      await fastify.listen(3000);
      fastify.log.info(`server listening on ${fastify.server.address().port}`);
   } catch (err) {
      fastify.log.error(err);
      process.exit(1);
   }
};

start();
