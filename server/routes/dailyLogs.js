const express = require('express');
const router = express.Router();
const DailyLog = require('../models/DailyLog');
const auth = require('../middleware/auth');

// Protect all routes with auth middleware
router.use(auth);

// GET /dailylogs - Fetch all daily logs for req.userId (optional date filter)
router.get(['/', '/dailylogs'], async (req, res) => {
  try {
    const filter = { userId: req.userId };
    if (req.query.date) {
      const parsedDate = new Date(req.query.date);
      if (!isNaN(parsedDate.getTime())) {
        const startOfDay = new Date(parsedDate);
        startOfDay.setUTCHours(0, 0, 0, 0);
        const endOfDay = new Date(parsedDate);
        endOfDay.setUTCHours(23, 59, 59, 999);
        filter.date = { $gte: startOfDay, $lte: endOfDay };
      } else {
        filter.date = req.query.date;
      }
    }

    const logs = await DailyLog.find(filter).sort({ date: -1 });
    return res.status(200).json(logs);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /dailylogs - Create a new daily log for req.userId
router.post(['/', '/dailylogs'], async (req, res) => {
  try {
    const { date, specialNote } = req.body;

    if (!date || !specialNote) {
      return res.status(400).json({ message: 'Date and specialNote are required fields' });
    }

    const newLog = new DailyLog({
      userId: req.userId,
      date,
      specialNote
    });

    await newLog.save();
    return res.status(201).json(newLog);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PUT /dailylogs/:id - Update a daily log owned by req.userId
router.put(['/:id', '/dailylogs/:id'], async (req, res) => {
  try {
    const { specialNote, date } = req.body;

    const log = await DailyLog.findOne({ _id: req.params.id, userId: req.userId });
    if (!log) {
      return res.status(404).json({ message: 'Daily log not found or unauthorized' });
    }

    if (specialNote !== undefined) log.specialNote = specialNote;
    if (date !== undefined) log.date = date;

    await log.save();
    return res.status(200).json(log);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE /dailylogs/:id - Delete a daily log owned by req.userId
router.delete(['/:id', '/dailylogs/:id'], async (req, res) => {
  try {
    const log = await DailyLog.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!log) {
      return res.status(404).json({ message: 'Daily log not found or unauthorized' });
    }

    return res.status(200).json({ message: 'Daily log deleted successfully', id: req.params.id });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
