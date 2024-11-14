import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddingBussinessFieldsInProducts1728949075580
  implements MigrationInterface
{
  name = 'AddingBussinessFieldsInProducts1728949075580';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product" ADD "isFeatured" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" ADD "isNewCollection" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product" DROP COLUMN "isNewCollection"`,
    );
    await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "isFeatured"`);
  }
}
