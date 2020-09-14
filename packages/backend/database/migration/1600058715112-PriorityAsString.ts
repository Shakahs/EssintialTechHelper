import { MigrationInterface, QueryRunner } from "typeorm";

export class PriorityAsString1600058715112 implements MigrationInterface {
   name = "PriorityAsString1600058715112";

   public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`ALTER TABLE "ticket" DROP COLUMN "priority"`);
      await queryRunner.query(
         `ALTER TABLE "ticket" ADD "priority" character varying NOT NULL`
      );
   }

   public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`ALTER TABLE "ticket" DROP COLUMN "priority"`);
      await queryRunner.query(
         `ALTER TABLE "ticket" ADD "priority" integer NOT NULL`
      );
   }
}
