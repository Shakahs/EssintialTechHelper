import { TicketEntity } from "./database/entity/Ticket";

const ormConfig = {
   type: "postgres",
   host: process.env["DATABASE_HOST"],
   port: process.env["DATABASE_PORT"],
   username: process.env["DATABASE_USER"],
   password: process.env["DATABASE_PASSWORD"],
   database: process.env["DATABASE_NAME"],
   synchronize: true,
   // logging: true,
   entities: [TicketEntity],
   migrations: ["database/migration/**/*.ts"],
   subscribers: ["database/subscriber/**/*.ts"],
   cli: {
      entitiesDir: "database/entity",
      migrationsDir: "database/migration",
      subscribersDir: "database/subscriber",
   },
};

export default ormConfig;
