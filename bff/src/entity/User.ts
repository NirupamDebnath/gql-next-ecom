import { UserRole } from "@utils/constants";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "varchar",
    length: 50,
    nullable: false,
  })
  firstName: string;

  @Column({
    type: "varchar",
    length: 50,
    nullable: false,
  })
  lastName: string;

  @Column({
    type: "varchar",
    length: 60,
    unique: true,
    nullable: false,
  })
  email: string;

  @Column({
    type: "varchar",
    length: 255,
    select: false,
    nullable: false,
  })
  password: string;

  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.USER,
    nullable: false,
  })
  role: UserRole;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
