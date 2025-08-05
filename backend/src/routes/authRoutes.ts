import express from 'express';
import bcrypt from 'bcryptjs';
import { AppDataSource } from '../data-source';
import { User } from '../entities/User';
import { generateToken, authenticateToken, AuthRequest } from '../middleware/auth';

const router = express.Router();
const userRepository = AppDataSource.getRepository(User);

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await userRepository.findOne({
      where: [{ username }, { email }]
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = userRepository.create({
      username,
      email,
      password: hashedPassword,
      role: 'user'
    });

    const savedUser = await userRepository.save(user);

    // Generate token
    const token = generateToken({
      id: savedUser.id,
      username: savedUser.username,
      email: savedUser.email,
      role: savedUser.role
    });

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: savedUser.id,
        username: savedUser.username,
        email: savedUser.email,
        role: savedUser.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user by username or email
    const user = await userRepository.findOne({
      where: [
        { username },
        { email: username }
      ]
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to login' });
  }
});

// Get current user profile
router.get('/profile', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const user = await userRepository.findOne({
      where: { id: req.user!.id }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get profile' });
  }
});

// Create default admin user (for initial setup)
router.post('/setup-admin', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if admin already exists
    const existingAdmin = await userRepository.findOne({
      where: { role: 'admin' }
    });

    if (existingAdmin) {
      return res.status(400).json({ error: 'Admin user already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin user
    const adminUser = userRepository.create({
      username,
      email,
      password: hashedPassword,
      role: 'admin'
    });

    const savedAdmin = await userRepository.save(adminUser);

    res.status(201).json({
      message: 'Admin user created successfully',
      user: {
        id: savedAdmin.id,
        username: savedAdmin.username,
        email: savedAdmin.email,
        role: savedAdmin.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create admin user' });
  }
});

export default router; 