const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// Manual CORS handling for Vercel - Wildcard Mode
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  // res.setHeader('Access-Control-Allow-Credentials', 'true'); // Not needed for token auth

  // Handle preflight directly
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  next();
});

app.use(cors({
  origin: '*',
  credentials: false // Important: must be false when origin is *
}));

// Explicit preflight handling
app.options('*', cors());

// Debug Middleware to log requests (Optional, remove in prod if noisy)
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url} - Origin: ${req.headers.origin}`);
  next();
});
app.use(express.json());

// Serve static files (uploads)
// This will allow us to access uploaded images via http://localhost:5000/uploads/filename.jpg
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/rawfilims')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// Basic Route
app.get('/', (req, res) => {
  res.send('Rawfilims API is running...');
});

// Routes
// Routes
app.use('/api/works', require('./routes/workRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/sections', require('./routes/sectionRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: err.message || 'Something went wrong!',
    error: process.env.NODE_ENV === 'production' ? {} : err
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
