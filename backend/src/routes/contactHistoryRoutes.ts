import express from 'express';
import { AppDataSource } from '../data-source';
import { ContactHistory } from '../entities/ContactHistory';
import { Customer } from '../entities/Customer';

const router = express.Router();
const contactHistoryRepository = AppDataSource.getRepository(ContactHistory);
const customerRepository = AppDataSource.getRepository(Customer);

// GET all contact history entries
router.get('/', async (req, res) => {
  try {
    const contactHistories = await contactHistoryRepository.find({
      relations: ['customer']
    });
    res.json(contactHistories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch contact history' });
  }
});

// GET contact history by customer ID
router.get('/customer/:customerId', async (req, res) => {
  try {
    const contactHistories = await contactHistoryRepository.find({
      where: { customer: { id: parseInt(req.params.customerId) } },
      relations: ['customer'],
      order: { date: 'DESC' }
    });
    res.json(contactHistories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch contact history' });
  }
});

// POST create new contact history entry
router.post('/', async (req, res) => {
  try {
    const { customerId, date, type, notes } = req.body;
    
    const customer = await customerRepository.findOne({
      where: { id: customerId }
    });
    
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    
    const contactHistory = contactHistoryRepository.create({
      customer,
      date: new Date(date),
      type,
      notes
    });
    
    const savedContactHistory = await contactHistoryRepository.save(contactHistory);
    res.status(201).json(savedContactHistory);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create contact history entry' });
  }
});

// PUT update contact history entry
router.put('/:id', async (req, res) => {
  try {
    const contactHistory = await contactHistoryRepository.findOne({
      where: { id: parseInt(req.params.id) }
    });
    
    if (!contactHistory) {
      return res.status(404).json({ error: 'Contact history entry not found' });
    }
    
    contactHistoryRepository.merge(contactHistory, req.body);
    const updatedContactHistory = await contactHistoryRepository.save(contactHistory);
    res.json(updatedContactHistory);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update contact history entry' });
  }
});

// DELETE contact history entry
router.delete('/:id', async (req, res) => {
  try {
    const contactHistory = await contactHistoryRepository.findOne({
      where: { id: parseInt(req.params.id) }
    });
    
    if (!contactHistory) {
      return res.status(404).json({ error: 'Contact history entry not found' });
    }
    
    await contactHistoryRepository.remove(contactHistory);
    res.json({ message: 'Contact history entry deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete contact history entry' });
  }
});

export default router; 