import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm";
import { Customer } from "./Customer";

@Entity()
export class ContactHistory {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Customer, customer => customer.contactHistories, { onDelete: 'CASCADE' })
  customer!: Customer;

  @Column()
  date!: Date;

  @Column()
  type!: string; // e.g., call, email, meeting

  @Column({ nullable: true })
  notes!: string;

  @CreateDateColumn()
  createdAt!: Date;
}