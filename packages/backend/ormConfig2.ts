import { TicketEntity } from "./database/entity/Ticket";

const ormConfig = {
   type: "postgres",
   host: "localhost",
   port: "5432",
   username: "dev",
   password: "password",
   synchronize: true,
   logging: true,
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
