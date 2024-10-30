// src/models/Task.js

const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  dueDate: { type: Date, default: Date.now },
  priority: { type: String, default: 'Low' },
  status: { type: String, default: 'To Do' },
  comments: [
    {
      text: { type: String, required: true },
      createdAt: { type: Date, default: Date.now },
    }
  ],
});

module.exports = mongoose.model('Task', taskSchema);
