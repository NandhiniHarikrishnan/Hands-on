import express from 'express';
import { AppDataSource } from '../data-source';
import { SalesLead, SalesStage } from '../entities/SalesLead';
import { Customer } from '../entities/Customer';

const router = express.Router();
const salesLeadRepository = AppDataSource.getRepository(SalesLead);
const customerRepository = AppDataSource.getRepository(Customer);

// GET all sales leads
router.get('/', async (req, res) => {
  try {
    const salesLeads = await salesLeadRepository.find({
      relations: ['customer', 'tasks']
    });
    res.json(salesLeads);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sales leads' });
  }
});

// GET sales leads by stage
router.get('/stage/:stage', async (req, res) => {
  try {
    const stage = req.params.stage as SalesStage;
    const salesLeads = await salesLeadRepository.find({
      where: { stage },
      relations: ['customer', 'tasks']
    });
    res.json(salesLeads);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sales leads by stage' });
  }
});

// GET sales lead by ID
router.get('/:id', async (req, res) => {
  try {
    const salesLead = await salesLeadRepository.findOne({
      where: { id: parseInt(req.params.id) },
      relations: ['customer', 'tasks']
    });
    
    if (!salesLead) {
      return res.status(404).json({ error: 'Sales lead not found' });
    }
    
    res.json(salesLead);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sales lead' });
  }
});

// POST create new sales lead
router.post('/', async (req, res) => {
  try {
    const { customerId, stage, value, description } = req.body;
    
    const customer = await customerRepository.findOne({
      where: { id: customerId }
    });
    
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    
    const salesLead = salesLeadRepository.create({
      customer,
      stage: stage || SalesStage.LEAD,
      value,
      description
    });
    
    const savedSalesLead = await salesLeadRepository.save(salesLead);
    res.status(201).json(savedSalesLead);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create sales lead' });
  }
});

// PUT update sales lead
router.put('/:id', async (req, res) => {
  try {
    const salesLead = await salesLeadRepository.findOne({
      where: { id: parseInt(req.params.id) }
    });
    
    if (!salesLead) {
      return res.status(404).json({ error: 'Sales lead not found' });
    }
    
    salesLeadRepository.merge(salesLead, req.body);
    const updatedSalesLead = await salesLeadRepository.save(salesLead);
    res.json(updatedSalesLead);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update sales lead' });
  }
});

// PUT update sales lead stage
router.put('/:id/stage', async (req, res) => {
  try {
    const { stage } = req.body;
    const salesLead = await salesLeadRepository.findOne({
      where: { id: parseInt(req.params.id) }
    });
    
    if (!salesLead) {
      return res.status(404).json({ error: 'Sales lead not found' });
    }
    
    salesLead.stage = stage;
    const updatedSalesLead = await salesLeadRepository.save(salesLead);
    res.json(updatedSalesLead);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update sales lead stage' });
  }
});

// DELETE sales lead
router.delete('/:id', async (req, res) => {
  try {
    const salesLead = await salesLeadRepository.findOne({
      where: { id: parseInt(req.params.id) }
    });
    
    if (!salesLead) {
      return res.status(404).json({ error: 'Sales lead not found' });
    }
    
    await salesLeadRepository.remove(salesLead);
    res.json({ message: 'Sales lead deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete sales lead' });
  }
});

export default router; 