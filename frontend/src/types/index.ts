// Customer types
export interface Customer {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  company?: string;
  createdAt: string;
  updatedAt: string;
  contactHistories?: ContactHistory[];
  salesLeads?: SalesLead[];
  tasks?: Task[];
}

// Contact History types
export interface ContactHistory {
  id: number;
  customer: Customer;
  date: string;
  type: string;
  notes?: string;
  createdAt: string;
}

// Sales Lead types
export enum SalesStage {
  LEAD = "Lead",
  QUALIFIED = "Qualified",
  PROPOSAL = "Proposal",
  CLOSED = "Closed"
}

export interface SalesLead {
  id: number;
  customer: Customer;
  stage: SalesStage;
  value?: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
  tasks?: Task[];
}

// Task types
export enum TaskStatus {
  PENDING = "Pending",
  COMPLETED = "Completed",
  OVERDUE = "Overdue"
}

export interface Task {
  id: number;
  customer: Customer;
  salesLead?: SalesLead;
  title: string;
  dueDate: string;
  status: TaskStatus;
  notes?: string;
  createdAt: string;
}

// Form types
export interface CustomerFormData {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  company?: string;
}

export interface ContactHistoryFormData {
  customerId: number;
  date: string;
  type: string;
  notes?: string;
}

export interface SalesLeadFormData {
  customerId: number;
  stage: SalesStage;
  value?: number;
  description?: string;
}

export interface TaskFormData {
  customerId: number;
  salesLeadId?: number;
  title: string;
  dueDate: string;
  notes?: string;
} 