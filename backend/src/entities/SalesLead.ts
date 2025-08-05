import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Customer } from "./Customer";
import { Task } from "./Task";

export enum SalesStage {
  LEAD = "Lead",
  QUALIFIED = "Qualified",
  PROPOSAL = "Proposal",
  CLOSED = "Closed"
}

@Entity()
export class SalesLead {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Customer, customer => customer.salesLeads, { onDelete: 'CASCADE' })
  customer!: Customer;

  @Column({ type: "enum", enum: SalesStage })
  stage!: SalesStage;

  @Column({ type: "float", nullable: true })
  value!: number;

  @Column({ nullable: true })
  description!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => Task, task => task.salesLead)
  tasks!: Task[];
}