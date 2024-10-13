 // finance-broker-saas/backend/server.js

 require('dotenv').config(); // Load environment variables

 const express = require('express');
 const cors = require('cors');
 const mongoose = require('mongoose');
 const axios = require('axios'); // Ensure this is declared only once
 const bcrypt = require('bcryptjs');
 const jwt = require('jsonwebtoken');
 const multer = require('multer');
 const { v4: uuidv4 } = require('uuid');
 const path = require('path');
 const fs = require('fs').promises;
 const pdf = require('pdf-parse');
 const authRoutes = require('./routes/auth');
 const { calculateLoanRecommendations } = require('./utils/loanCalculator');

 const User = require('./models/User');

 const app = express();
 const upload = multer({ dest: 'uploads/' });

 // Middleware
 app.use(cors());
 app.use(express.json({ limit: '5mb' })); // Adjust the limit as needed
 app.use(express.urlencoded({ extended: true, limit: '5mb' }));

 // In-memory banks array (consider moving this to a database in production)
 let banks = [];

 // Connect to MongoDB
 mongoose.connect('mongodb://localhost:27017/finance_broker', {
   useNewUrlParser: true,
   useUnifiedTopology: true,
 })
 .then(() => console.log('Connected to MongoDB'))
 .catch(err => console.error('Error connecting to MongoDB:', err));

 // Use auth routes
 app.use('/api', authRoutes);


// Signup route
app.post('/api/signup', async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Error creating user' });
  }
});

// Login route
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Error logging in' });
  }
});




// AI Endpoint
app.post('/api/ai', async (req, res) => {
    const { messages } = req.body;
    const API_KEY = process.env.ANTHROPIC_API_KEY;
  
    try {
      if (!API_KEY) {
        throw new Error('ANTHROPIC_API_KEY is not set');
      }
  
      const response = await axios.post(
        'https://api.anthropic.com/v1/messages',
        {
          messages: messages,
          max_tokens: 1000,
          model: 'claude-2',
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': API_KEY,
            'anthropic-version': '2023-06-01',
          },
        }
      );
  
      if (response.data && response.data.content) {
        res.json({ content: response.data.content });
      } else {
        throw new Error('Unexpected response structure from AI service');
      }
    } catch (error) {
      console.error('Error calling AI service:', error);
      res.status(500).json({ error: 'Error processing AI request' });
    }
  });
      

// Loan Recommendations Endpoint
app.post('/api/loan-recommendations', async (req, res) => {
    const clientInfo = req.body;
  
    try {
      const recommendations = await calculateLoanRecommendations(clientInfo, banks);
      res.json(recommendations);
    } catch (error) {
      console.error('Error calculating loan recommendations:', error);
      res.status(500).json({ error: 'Error calculating loan recommendations' });
    }
  });
  


// Edit Bank Name
app.put('/api/banks/:bankId', (req, res) => {
    const { bankId } = req.params;
    const { name } = req.body;
    const bank = banks.find(b => b.id === bankId);
    
    if (!bank) {
      return res.status(404).json({ error: 'Bank not found' });
    }
  
    bank.name = name;
    res.json({ message: 'Bank name updated successfully' });
  });

// Get All Banks
app.get('/api/banks', (req, res) => {
  res.json(
    banks.map((bank) => ({
      id: bank.id,
      name: bank.name,
      policies: bank.policies.map((policy) => ({
        id: policy.id,
        name: policy.name,
        text: policy.text,
      })),
    }))
  );
});

// Upload a New Policy
app.post('/api/banks/policies', upload.single('policy'), async (req, res) => {
    const { bankName } = req.body;
  
    if (!req.file || !bankName) {
      return res.status(400).json({ error: 'Bank name and policy file are required' });
    }
  
    const policyId = uuidv4();
    const oldPath = req.file.path;
    const newPath = path.join('uploads', `${policyId}_${req.file.originalname}`);
  
    try {
      await fs.rename(oldPath, newPath);
      const policyText = await extractTextFromPDF(newPath);
  
      let bank = banks.find((b) => b.name.toLowerCase() === bankName.toLowerCase());
      if (!bank) {
        bank = { id: uuidv4(), name: bankName, policies: [] };
        banks.push(bank);
      }
  
      bank.policies.push({
        id: policyId,
        name: req.file.originalname,
        path: newPath,
        text: policyText,
      });
  
      res.json({ message: 'Policy uploaded and parsed successfully' });
    } catch (error) {
      console.error('Error processing file:', error);
      res.status(500).json({ error: 'Error processing file' });
    }
  });

async function extractTextFromPDF(filePath) {
  try {
    const dataBuffer = await fs.readFile(filePath);
    const data = await pdf(dataBuffer);
    return data.text;
  } catch (error) {
    console.error('Error parsing PDF:', error);
    throw new Error('Failed to parse PDF');
  }
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


