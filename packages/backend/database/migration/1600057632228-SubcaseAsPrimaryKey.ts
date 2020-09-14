import { MigrationInterface, QueryRunner } from "typeorm";

export class SubcaseAsPrimaryKey1600057632228 implements MigrationInterface {
   name = "SubcaseAsPrimaryKey1600057632228";

   public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(
         `CREATE TABLE "ticket" ("ticketNumber" character varying NOT NULL, "siteName" character varying NOT NULL, "priority" integer NOT NULL, "address" character varying NOT NULL, "city" character varying NOT NULL, "partNumber" character varying NOT NULL, "partDescription" character varying NOT NULL, "created" TIMESTAMP NOT NULL, "longitude" integer NOT NULL, "latitude" integer NOT NULL, CONSTRAINT "PK_cbbc24b2a384886c1684b6c2219" PRIMARY KEY ("ticketNumber"))`
      );
   }

   public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`DROP TABLE "ticket"`);
   }
}
