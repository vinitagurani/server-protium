// src/routes/taskRoutes.js
const express = require('express');
const Task = require('../models/Task');
const router = express.Router();

// Get all tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new task
router.post('/', async (req, res) => {
  const task = new Task(req.body);
  try {
    const newTask = await task.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a task
router.patch('/:id', async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});



// Delete a task
router.delete('/:id', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.post('/:id/comments', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const newComment = { text: req.body.text };
    task.comments.push(newComment);
    await task.save();

    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Optional: Get comments for a task
router.get('/:id/comments', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    res.json(task.comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get tasks with optional filters
router.get('/search', async (req, res) => {
  const { status, priority, query } = req.query;
  const filters = {};

  if (status) filters.status = status;
  if (priority) filters.priority = priority;
  if (query) filters.name = { $regex: query, $options: 'i' };

  try {
    const tasks = await Task.find(filters);
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/filter', async (req, res) => {
  const { status, priority, dueDate } = req.query; // Get all filters from query parameters
  const filters = {};

  if (status) filters.status = status;
  if (priority) filters.priority = priority;
  if (dueDate) filters.dueDate = { $lte: new Date(dueDate) }; // Adjust the date filter as needed

  try {
      const tasks = await Task.find(filters); // Filter tasks based on the provided filters
      res.status(200).json(tasks);
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
});

// Get a single task by ID
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update task status or priority
router.patch('/:id/status', async (req, res) => {
  const { status, priority } = req.body;
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: { status, priority } },
      { new: true }
    );
    res.json(updatedTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// not working 
router.delete('/:taskId/comments/:commentId', async (req, res) => {
  console.log(`Attempting to delete comment ${req.params.commentId} from task ${req.params.taskId}`);
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) {
      console.log('Task not found');
      return res.status(404).json({ message: 'Task not found' });
    }

    // Find the comment to delete
    const commentExists = task.comments.some(comment => comment._id.toString() === req.params.commentId);
    if (!commentExists) {
      console.log('Comment not found');
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Filter out the comment to delete
    task.comments = task.comments.filter(comment => comment._id.toString() !== req.params.commentId);
    await task.save();

    console.log('Comment deleted successfully');
    res.status(204).send(); // No content to return
  } catch (err) {
    console.error('Error deleting comment:', err);
    res.status(400).json({ message: err.message });
  }
});



module.exports = router;

