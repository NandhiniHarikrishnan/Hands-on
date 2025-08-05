import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { ContactHistory } from "./ContactHistory";
import { SalesLead } from "./SalesLead";
import { Task } from "./Task";

@Entity()
export class Customer {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ nullable: true })
  phone!: string;

  @Column({ nullable: true })
  address!: string;

  @Column({ nullable: true })
  company!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => ContactHistory, contactHistory => contactHistory.customer)
  contactHistories!: ContactHistory[];

  @OneToMany(() => SalesLead, salesLead => salesLead.customer)
  salesLeads!: SalesLead[];

  @OneToMany(() => Task, task => task.customer)
  tasks!: Task[];
}