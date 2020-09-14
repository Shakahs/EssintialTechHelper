import { MigrationInterface, QueryRunner } from "typeorm";

export class NullablePartDescription1600119634727
   implements MigrationInterface {
   name = "NullablePartDescription1600119634727";

   public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(
         `ALTER TABLE "ticket" ALTER COLUMN "partDescription" DROP NOT NULL`
      );
   }

   public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(
         `ALTER TABLE "ticket" ALTER COLUMN "partDescription" SET NOT NULL`
      );
   }
}
