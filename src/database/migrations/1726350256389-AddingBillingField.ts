import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddingBillingField1726350256389 implements MigrationInterface {
  name = 'AddingBillingField1726350256389';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."orders_billingtype_enum" AS ENUM('BOLETO', 'CREDIT_CARD', 'PIX')`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ADD "billingType" "public"."orders_billingtype_enum" NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "billingType"`);
    await queryRunner.query(`DROP TYPE "public"."orders_billingtype_enum"`);
  }
}
