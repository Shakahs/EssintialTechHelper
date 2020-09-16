import { createConnection } from "typeorm";
import { Connection } from "typeorm/connection/Connection";
import { TicketEntity } from "./database/entity/Ticket";
const fastify = require("fastify")({ logger: true });
import ormConfig from "./ormConfig2";

let dbConnection: undefined | Connection;

fastify.get("/", async (request, reply) => {
   const ticketResults = await dbConnection
      .createQueryBuilder(TicketEntity, "ticket")
      .where("ticket.visible=:visible", { visible: true })
      .getMany();
   return ticketResults;
});

const start = async () => {
   try {
      await fastify.listen(3000);
      fastify.log.info(`server listening on ${fastify.server.address().port}`);
   } catch (err) {
      fastify.log.error(err);
      process.exit(1);
   }
};

//@ts-ignore
createConnection(ormConfig).then((conn) => {
   dbConnection = conn;
   start();
});
