import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddingImgArrayInProductTable1726323610867
  implements MigrationInterface
{
  name = 'AddingImgArrayInProductTable1726323610867';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "image_url"`);
    await queryRunner.query(
      `ALTER TABLE "product" ADD "main_image_url" character varying NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "product" ADD "images" text NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "images"`);
    await queryRunner.query(
      `ALTER TABLE "product" DROP COLUMN "main_image_url"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" ADD "image_url" character varying NOT NULL`,
    );
  }
}
