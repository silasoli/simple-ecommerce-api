import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddingShippingDataInOrder1728782873114
  implements MigrationInterface
{
  name = 'AddingShippingDataInOrder1728782873114';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "orders" ADD "shippingData" text`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "shippingData"`);
  }
}
