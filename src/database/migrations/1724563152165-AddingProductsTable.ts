import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddingProductsTable1724563152165 implements MigrationInterface {
  name = 'AddingProductsTable1724563152165';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "product" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "batch" character varying NOT NULL, "name" character varying NOT NULL, "brand" character varying, "description" character varying NOT NULL, "price" integer NOT NULL, "category" text NOT NULL, "image_url" character varying NOT NULL, "quantity" integer NOT NULL, "code" character varying, "subcategory" text NOT NULL, "discount_price" integer, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "product"`);
  }
}
