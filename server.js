const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// app.use(cors());
const corsOptions = {
  origin: 'https://tasks-assign.netlify.app', // Correct origin without trailing slash
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // Specify allowed methods
  credentials: true, // If you need to send cookies or authorization headers
};

app.use(cors(corsOptions));

app.use(bodyParser.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Import routes
const taskRoutes = require('./routes/taskRoutes');
app.use('/api/tasks', taskRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
