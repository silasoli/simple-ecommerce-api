import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddingAsaasData1726347415079 implements MigrationInterface {
  name = 'AddingAsaasData1726347415079';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "paymentStatus"`);
    await queryRunner.query(`DROP TYPE "public"."orders_paymentstatus_enum"`);
    await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "orderStatus"`);
    await queryRunner.query(`DROP TYPE "public"."orders_orderstatus_enum"`);
    await queryRunner.query(
      `CREATE TYPE "public"."orders_status_enum" AS ENUM('PENDING', 'RECEIVED', 'CONFIRMED', 'SENT', 'OVERDUE', 'REFUNDED', 'RECEIVED_IN_CASH', 'REFUND_REQUESTED', 'REFUND_IN_PROGRESS', 'CHARGEBACK_REQUESTED', 'CHARGEBACK_DISPUTE', 'AWAITING_CHARGEBACK_REVERSAL', 'DUNNING_REQUESTED', 'DUNNING_RECEIVED', 'AWAITING_RISK_ANALYSIS')`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ADD "status" "public"."orders_status_enum" NOT NULL DEFAULT 'PENDING'`,
    );
    await queryRunner.query(`ALTER TABLE "orders" ADD "asaasData" text`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "asaasData"`);
    await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "status"`);
    await queryRunner.query(`DROP TYPE "public"."orders_status_enum"`);
    await queryRunner.query(
      `CREATE TYPE "public"."orders_orderstatus_enum" AS ENUM('PENDING', 'RECEIVED', 'CONFIRMED', 'SENT', 'REFUNDED')`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ADD "orderStatus" "public"."orders_orderstatus_enum" NOT NULL DEFAULT 'PENDING'`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."orders_paymentstatus_enum" AS ENUM('PENDING', 'RECEIVED', 'CONFIRMED', 'OVERDUE', 'REFUNDED', 'RECEIVED_IN_CASH', 'REFUND_REQUESTED', 'REFUND_IN_PROGRESS', 'CHARGEBACK_REQUESTED', 'CHARGEBACK_DISPUTE', 'AWAITING_CHARGEBACK_REVERSAL', 'DUNNING_REQUESTED', 'DUNNING_RECEIVED', 'AWAITING_RISK_ANALYSIS')`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ADD "paymentStatus" "public"."orders_paymentstatus_enum" NOT NULL DEFAULT 'PENDING'`,
    );
  }
}
