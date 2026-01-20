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
app.use(cors({
  origin: true, // Allow any origin
  credentials: true
}));
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
app.use('/api/works', require('./routes/workRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/sections', require('./routes/sectionRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

