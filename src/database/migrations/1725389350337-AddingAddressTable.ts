import { MigrationInterface, QueryRunner } from "typeorm";

export class AddingAddressTable1725389350337 implements MigrationInterface {
    name = 'AddingAddressTable1725389350337'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "customers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "cpfCnpj" character varying NOT NULL, "email" character varying NOT NULL, "mobilePhone" character varying NOT NULL, "external_id" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_b5dd7e453fd13c3d2b6d3e56448" UNIQUE ("cpfCnpj"), CONSTRAINT "UQ_807c905570dadeda513f678036d" UNIQUE ("external_id"), CONSTRAINT "PK_235ef3b889390c91380dbba01fb" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "customers"`);
    }

}
