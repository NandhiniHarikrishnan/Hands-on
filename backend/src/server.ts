import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { AppDataSource } from './data-source';
import customerRoutes from './routes/customerRoutes';
import contactHistoryRoutes from './routes/contactHistoryRoutes';
import salesLeadRoutes from './routes/salesLeadRoutes';
import taskRoutes from './routes/taskRoutes';
import authRoutes from './routes/authRoutes';
import { authenticateToken } from './middleware/auth';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Debug: Log all routes
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Public routes (no authentication required)
app.use('/api/auth', authRoutes);
console.log('Auth routes loaded');

// Test route to verify server is working
app.post('/api/test', (req, res) => {
  res.json({ message: 'Test route working' });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'CRM API is running' });
});

// Protected routes (authentication required)
app.use('/api/customers', authenticateToken, customerRoutes);
app.use('/api/contact-history', authenticateToken, contactHistoryRoutes);
app.use('/api/sales-leads', authenticateToken, salesLeadRoutes);
app.use('/api/tasks', authenticateToken, taskRoutes);

// Initialize database and start server
AppDataSource.initialize()
  .then(() => {
    console.log('Database connected successfully');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log('Available routes:');
      console.log('- POST /api/auth/register');
      console.log('- POST /api/auth/login');
      console.log('- GET /api/auth/profile');
      console.log('- GET /api/health');
    });
  })
  .catch((error) => {
    console.error('Error during Data Source initialization:', error);
  }); 