import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm";
import { Customer } from "./Customer";
import { SalesLead } from "./SalesLead";

export enum TaskStatus {
  PENDING = "Pending",
  COMPLETED = "Completed",
  OVERDUE = "Overdue"
}

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Customer, customer => customer.tasks, { onDelete: 'CASCADE' })
  customer!: Customer;

  @ManyToOne(() => SalesLead, salesLead => salesLead.tasks, { nullable: true, onDelete: 'SET NULL' })
  salesLead!: SalesLead;

  @Column()
  title!: string;

  @Column({ type: "date" })
  dueDate!: Date;

  @Column({ type: "enum", enum: TaskStatus, default: TaskStatus.PENDING })
  status!: TaskStatus;

  @Column({ nullable: true })
  notes!: string;

  @CreateDateColumn()
  createdAt!: Date;
}