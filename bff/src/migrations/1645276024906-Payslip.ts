import {MigrationInterface, QueryRunner} from "typeorm";

export class Payslip1645276024906 implements MigrationInterface {
    name = 'Payslip1645276024906'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "payslip" ("id" SERIAL NOT NULL, "basic" money NOT NULL, "house_rent_allowance" money NOT NULL, "pf" money NOT NULL, "vpf" money NOT NULL, "incomeTax" money NOT NULL, "labour_welfare_fund" money NOT NULL, "gpa_premium" money NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_2945d796bbfe386e3e1bd04d13d" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "payslip"`);
    }

}
