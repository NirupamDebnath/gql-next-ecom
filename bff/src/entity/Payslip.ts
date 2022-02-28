import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class Payslip {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "money",
    nullable: false,
  })
  basic: number;

  @Column({
    type: "money",
  })
  house_rent_allowance: number;

  @Column({
    type: "money",
  })
  pf: number;

  @Column({
    type: "money",
  })
  vpf: number;

  @Column({
    type: "money",
  })
  incomeTax: number;

  @Column({
    type: "money",
  })
  labour_welfare_fund: number;

  @Column({
    type: "money",
  })
  gpa_premium: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
