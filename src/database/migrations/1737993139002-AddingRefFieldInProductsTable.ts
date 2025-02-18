import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddingRefFieldInProductsTable1737993139002
  implements MigrationInterface
{
  name = 'AddingRefFieldInProductsTable1737993139002';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "product" ADD "ref" integer`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "ref"`);
  }
}
