import express from 'express';
import { AppDataSource } from '../data-source';
import { Task, TaskStatus } from '../entities/Task';
import { Customer } from '../entities/Customer';
import { SalesLead } from '../entities/SalesLead';

const router = express.Router();
const taskRepository = AppDataSource.getRepository(Task);
const customerRepository = AppDataSource.getRepository(Customer);
const salesLeadRepository = AppDataSource.getRepository(SalesLead);

// GET all tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await taskRepository.find({
      relations: ['customer', 'salesLead']
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// GET tasks by status
router.get('/status/:status', async (req, res) => {
  try {
    const status = req.params.status as TaskStatus;
    const tasks = await taskRepository.find({
      where: { status },
      relations: ['customer', 'salesLead']
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks by status' });
  }
});

// GET overdue tasks
router.get('/overdue', async (req, res) => {
  try {
    const overdueTasks = await taskRepository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.customer', 'customer')
      .leftJoinAndSelect('task.salesLead', 'salesLead')
      .where('task.dueDate < :today', { today: new Date() })
      .andWhere('task.status != :completed', { completed: TaskStatus.COMPLETED })
      .getMany();
    
    res.json(overdueTasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch overdue tasks' });
  }
});

// GET task by ID
router.get('/:id', async (req, res) => {
  try {
    const task = await taskRepository.findOne({
      where: { id: parseInt(req.params.id) },
      relations: ['customer', 'salesLead']
    });
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch task' });
  }
});

// POST create new task
router.post('/', async (req, res) => {
  try {
    const { customerId, salesLeadId, title, dueDate, notes } = req.body;
    
    const customer = await customerRepository.findOne({
      where: { id: customerId }
    });
    
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    
    let salesLead: SalesLead | undefined = undefined;
    if (salesLeadId) {
      const foundSalesLead = await salesLeadRepository.findOne({
        where: { id: salesLeadId }
      });
      salesLead = foundSalesLead === null ? undefined : foundSalesLead;
      if (!salesLead) {
        return res.status(404).json({ error: 'Sales lead not found' });
      }
    }
    
    const task = taskRepository.create({
      customer,
      title,
      dueDate: new Date(dueDate),
      notes,
      status: TaskStatus.PENDING,
      ...(salesLead ? { salesLead } : {})
    });
    
    const savedTask = await taskRepository.save(task);
    res.status(201).json(savedTask);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// PUT update task
router.put('/:id', async (req, res) => {
  try {
    const task = await taskRepository.findOne({
      where: { id: parseInt(req.params.id) }
    });
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    taskRepository.merge(task, req.body);
    const updatedTask = await taskRepository.save(task);
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// PUT update task status
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const task = await taskRepository.findOne({
      where: { id: parseInt(req.params.id) }
    });
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    task.status = status;
    const updatedTask = await taskRepository.save(task);
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update task status' });
  }
});

// DELETE task
router.delete('/:id', async (req, res) => {
  try {
    const task = await taskRepository.findOne({
      where: { id: parseInt(req.params.id) }
    });
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    await taskRepository.remove(task);
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

export default router; 