import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1600057146364 implements MigrationInterface {
   name = "InitialSchema1600057146364";

   public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(
         `CREATE TABLE "ticket" ("id" SERIAL NOT NULL, "siteName" character varying NOT NULL, "priority" integer NOT NULL, "address" character varying NOT NULL, "city" character varying NOT NULL, "ticketNumber" character varying NOT NULL, "partNumber" character varying NOT NULL, "partDescription" character varying NOT NULL, "created" TIMESTAMP NOT NULL, "longitude" integer NOT NULL, "latitude" integer NOT NULL, CONSTRAINT "PK_d9a0835407701eb86f874474b7c" PRIMARY KEY ("id"))`
      );
   }

   public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`DROP TABLE "ticket"`);
   }
}
