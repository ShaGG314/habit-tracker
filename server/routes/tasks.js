const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const auth = require('../middleware/auth');

// Apply auth middleware to all routes in this file
router.use(auth);

// GET /tasks - Fetch all tasks for req.userId (optional type filter)
router.get(['/', '/tasks'], async (req, res) => {
  try {
    const filter = { userId: req.userId };
    if (req.query.type) {
      filter.type = req.query.type;
    }

    const tasks = await Task.find(filter).sort({ date: 1 });
    return res.status(200).json(tasks);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /tasks - Create a new task for req.userId
router.post(['/', '/tasks'], async (req, res) => {
  try {
    const { name, type, date, completed } = req.body;

    if (!name || !type || !date) {
      return res.status(400).json({ message: 'Name, type, and date are required fields' });
    }

    const newTask = new Task({
      userId: req.userId,
      name,
      type,
      date,
      completed: completed !== undefined ? completed : false
    });

    await newTask.save();
    return res.status(201).json(newTask);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PUT /tasks/:id - Update a task owned by req.userId
router.put(['/:id', '/tasks/:id'], async (req, res) => {
  try {
    const { name, type, date, completed } = req.body;

    const task = await Task.findOne({ _id: req.params.id, userId: req.userId });
    if (!task) {
      return res.status(404).json({ message: 'Task not found or unauthorized' });
    }

    if (name !== undefined) task.name = name;
    if (type !== undefined) task.type = type;
    if (date !== undefined) task.date = date;
    if (completed !== undefined) task.completed = completed;

    await task.save();
    return res.status(200).json(task);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE /tasks/:id - Delete a task owned by req.userId
router.delete(['/:id', '/tasks/:id'], async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!task) {
      return res.status(404).json({ message: 'Task not found or unauthorized' });
    }

    return res.status(200).json({ message: 'Task deleted successfully', id: req.params.id });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
