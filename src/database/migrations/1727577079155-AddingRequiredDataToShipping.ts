import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddingRequiredDataToShipping1727577079155
  implements MigrationInterface
{
  name = 'AddingRequiredDataToShipping1727577079155';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product" ADD "width" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" ADD "height" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" ADD "length" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" ADD "weight" double precision NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "weight"`);
    await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "length"`);
    await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "height"`);
    await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "width"`);
  }
}
