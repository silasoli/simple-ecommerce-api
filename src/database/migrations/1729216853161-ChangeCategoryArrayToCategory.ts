import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeCategoryArrayToCategory1729216853161
  implements MigrationInterface
{
  name = 'ChangeCategoryArrayToCategory1729216853161';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "category"`);
    await queryRunner.query(
      `ALTER TABLE "product" ADD "category" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "category"`);
    await queryRunner.query(
      `ALTER TABLE "product" ADD "category" text NOT NULL`,
    );
  }
}
