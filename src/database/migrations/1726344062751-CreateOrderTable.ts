import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateOrderTable1726344062751 implements MigrationInterface {
  name = 'CreateOrderTable1726344062751';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."orders_paymentstatus_enum" AS ENUM('PENDING', 'RECEIVED', 'CONFIRMED', 'OVERDUE', 'REFUNDED', 'RECEIVED_IN_CASH', 'REFUND_REQUESTED', 'REFUND_IN_PROGRESS', 'CHARGEBACK_REQUESTED', 'CHARGEBACK_DISPUTE', 'AWAITING_CHARGEBACK_REVERSAL', 'DUNNING_REQUESTED', 'DUNNING_RECEIVED', 'AWAITING_RISK_ANALYSIS')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."orders_orderstatus_enum" AS ENUM('PENDING', 'RECEIVED', 'CONFIRMED', 'SENT', 'REFUNDED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "orders" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "amount" integer NOT NULL, "paymentStatus" "public"."orders_paymentstatus_enum" NOT NULL DEFAULT 'PENDING', "orderStatus" "public"."orders_orderstatus_enum" NOT NULL DEFAULT 'PENDING', "external_customer_id" character varying NOT NULL, "external_order_id" character varying NOT NULL, "products" json NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "orders"`);
    await queryRunner.query(`DROP TYPE "public"."orders_orderstatus_enum"`);
    await queryRunner.query(`DROP TYPE "public"."orders_paymentstatus_enum"`);
  }
}
