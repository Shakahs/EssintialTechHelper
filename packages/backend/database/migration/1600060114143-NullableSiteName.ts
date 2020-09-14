import { MigrationInterface, QueryRunner } from "typeorm";

export class NullableSiteName1600060114143 implements MigrationInterface {
   name = "NullableSiteName1600060114143";

   public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(
         `ALTER TABLE "ticket" ALTER COLUMN "siteName" DROP NOT NULL`
      );
   }

   public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(
         `ALTER TABLE "ticket" ALTER COLUMN "siteName" SET NOT NULL`
      );
   }
}
