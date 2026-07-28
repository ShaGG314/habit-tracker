const express = require('express');
const router = express.Router();
const JournalEntry = require('../models/JournalEntry');
const auth = require('../middleware/auth');

// Protect all routes with auth middleware
router.use(auth);

// GET /journal - Fetch all journal entries for req.userId (optional date filter)
router.get(['/', '/journal'], async (req, res) => {
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

    const entries = await JournalEntry.find(filter).sort({ date: -1 });
    return res.status(200).json(entries);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /journal - Create a new journal entry for req.userId
router.post(['/', '/journal'], async (req, res) => {
  try {
    const { date, entryText } = req.body;

    if (!date || !entryText) {
      return res.status(400).json({ message: 'Date and entryText are required fields' });
    }

    const newEntry = new JournalEntry({
      userId: req.userId,
      date,
      entryText
    });

    await newEntry.save();
    return res.status(201).json(newEntry);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PUT /journal/:id - Update a journal entry owned by req.userId
router.put(['/:id', '/journal/:id'], async (req, res) => {
  try {
    const { entryText, date } = req.body;

    const entry = await JournalEntry.findOne({ _id: req.params.id, userId: req.userId });
    if (!entry) {
      return res.status(404).json({ message: 'Journal entry not found or unauthorized' });
    }

    if (entryText !== undefined) entry.entryText = entryText;
    if (date !== undefined) entry.date = date;

    await entry.save();
    return res.status(200).json(entry);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE /journal/:id - Delete a journal entry owned by req.userId
router.delete(['/:id', '/journal/:id'], async (req, res) => {
  try {
    const entry = await JournalEntry.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!entry) {
      return res.status(404).json({ message: 'Journal entry not found or unauthorized' });
    }

    return res.status(200).json({ message: 'Journal entry deleted successfully', id: req.params.id });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
