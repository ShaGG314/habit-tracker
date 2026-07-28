const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const dailyLogRoutes = require('./routes/dailyLogs');
const journalEntryRoutes = require('./routes/journalEntries');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/dailylogs', dailyLogRoutes);
app.use('/api/journal', journalEntryRoutes);

mongoose.connect(process.env.MONGO_URI)
    .then(()=> console.log('MongoDB connected'))
    .catch(err => console.log(err));

app.listen(process.env.PORT, ()=> console.log(`Server running on port ${process.env.PORT}`));