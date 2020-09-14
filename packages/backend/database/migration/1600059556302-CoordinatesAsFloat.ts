import { MigrationInterface, QueryRunner } from "typeorm";

export class CoordinatesAsFloat1600059556302 implements MigrationInterface {
   name = "CoordinatesAsFloat1600059556302";

   public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`ALTER TABLE "ticket" DROP COLUMN "longitude"`);
      await queryRunner.query(
         `ALTER TABLE "ticket" ADD "longitude" double precision NOT NULL`
      );
      await queryRunner.query(`ALTER TABLE "ticket" DROP COLUMN "latitude"`);
      await queryRunner.query(
         `ALTER TABLE "ticket" ADD "latitude" double precision NOT NULL`
      );
   }

   public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`ALTER TABLE "ticket" DROP COLUMN "latitude"`);
      await queryRunner.query(
         `ALTER TABLE "ticket" ADD "latitude" integer NOT NULL`
      );
      await queryRunner.query(`ALTER TABLE "ticket" DROP COLUMN "longitude"`);
      await queryRunner.query(
         `ALTER TABLE "ticket" ADD "longitude" integer NOT NULL`
      );
   }
}
