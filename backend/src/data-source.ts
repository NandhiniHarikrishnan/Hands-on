import "reflect-metadata";
import { DataSource } from "typeorm";
import { Customer } from "./entities/Customer";
import { ContactHistory } from "./entities/ContactHistory";
import { SalesLead } from "./entities/SalesLead";
import { Task } from "./entities/Task";
import { User } from "./entities/User";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true, // Set to false in production and use migrations
  logging: false,
  entities: [Customer, ContactHistory, SalesLead, Task, User],
  migrations: [],
  subscribers: [],
});