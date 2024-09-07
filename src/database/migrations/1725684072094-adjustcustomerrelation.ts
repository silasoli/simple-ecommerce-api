import { MigrationInterface, QueryRunner } from 'typeorm';

export class Adjustcustomerrelation1725684072094 implements MigrationInterface {
  name = 'Adjustcustomerrelation1725684072094';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "costumers" ADD "addressId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "costumers" ADD CONSTRAINT "UQ_ee121b53956c18bb84624fb69be" UNIQUE ("addressId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "costumers" ADD CONSTRAINT "FK_ee121b53956c18bb84624fb69be" FOREIGN KEY ("addressId") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "costumers" DROP CONSTRAINT "FK_ee121b53956c18bb84624fb69be"`,
    );
    await queryRunner.query(
      `ALTER TABLE "costumers" DROP CONSTRAINT "UQ_ee121b53956c18bb84624fb69be"`,
    );
    await queryRunner.query(`ALTER TABLE "costumers" DROP COLUMN "addressId"`);
  }
}
