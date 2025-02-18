import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveProductQuantity1731628329320 implements MigrationInterface {
    name = 'RemoveProductQuantity1731628329320'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "quantity"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" ADD "quantity" integer NOT NULL`);
    }

}
