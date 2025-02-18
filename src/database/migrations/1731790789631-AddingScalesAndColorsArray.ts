import { MigrationInterface, QueryRunner } from "typeorm";

export class AddingScalesAndColorsArray1731790789631 implements MigrationInterface {
    name = 'AddingScalesAndColorsArray1731790789631'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" ADD "scales" text`);
        await queryRunner.query(`ALTER TABLE "product" ADD "colors" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "colors"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "scales"`);
    }

}
