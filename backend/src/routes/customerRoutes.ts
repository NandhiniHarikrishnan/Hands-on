import express from 'express';
import { AppDataSource } from '../data-source';
import { Customer } from '../entities/Customer';

const router = express.Router();
const customerRepository = AppDataSource.getRepository(Customer);

// GET all customers
router.get('/', async (req, res) => {
  try {
    const customers = await customerRepository.find({
      relations: ['contactHistories', 'salesLeads', 'tasks']
    });
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

// GET customer by ID
router.get('/:id', async (req, res) => {
  try {
    const customer = await customerRepository.findOne({
      where: { id: parseInt(req.params.id) },
      relations: ['contactHistories', 'salesLeads', 'tasks']
    });
    
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch customer' });
  }
});

// POST create new customer
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, address, company } = req.body;
    
    const customer = customerRepository.create({
      name,
      email,
      phone,
      address,
      company
    });
    
    const savedCustomer = await customerRepository.save(customer);
    res.status(201).json(savedCustomer);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create customer' });
  }
});

// PUT update customer
router.put('/:id', async (req, res) => {
  try {
    const customer = await customerRepository.findOne({
      where: { id: parseInt(req.params.id) }
    });
    
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    
    customerRepository.merge(customer, req.body);
    const updatedCustomer = await customerRepository.save(customer);
    res.json(updatedCustomer);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update customer' });
  }
});

// DELETE customer
router.delete('/:id', async (req, res) => {
  try {
    const customer = await customerRepository.findOne({
      where: { id: parseInt(req.params.id) }
    });
    
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    
    await customerRepository.remove(customer);
    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete customer' });
  }
});

export default router; 