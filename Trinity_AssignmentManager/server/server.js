require('dotenv').config();

const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const Assignment = require('./models/assignment');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({ origin: 'http://localhost:4200' }));
app.use(express.json());

app.get('/api/assignments', async (_req, res) => {
  const assignments = await Assignment.find().sort({ dueDate: 1 });
  res.json(assignments);
});

app.post('/api/assignments', async (req, res) => {
  const assignment = await Assignment.create(req.body);
  res.status(201).json(assignment);
});

app.put('/api/assignments/:id', async (req, res) => {
  const assignment = await Assignment.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!assignment) return res.status(404).json({ message: 'Assignment not found.' });
  res.json(assignment);
});

app.delete('/api/assignments/:id', async (req, res) => {
  const assignment = await Assignment.findByIdAndDelete(req.params.id);
  if (!assignment) return res.status(404).json({ message: 'Assignment not found.' });
  res.status(204).send();
});

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(400).json({ message: error.message });
});

mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/studynest')
  .then(() => app.listen(port, () => console.log(`Assignment API running on port ${port}`)))
  .catch((error) => {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  });
