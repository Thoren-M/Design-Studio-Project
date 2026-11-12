const path = require('path');
const dotenv = require('dotenv');

const envResult = dotenv.config({ path: path.resolve(__dirname, '.env') });
if (envResult.error) {
  console.error('Could not load .env file:', envResult.error.message);
}

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGODB_URI || '';

// 1. Define the Mongoose Schema and Model
const cardSchema = new mongoose.Schema(
  {
    front: { type: String, required: true, trim: true },
    back: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

const Card = mongoose.model('Card', cardSchema);

// 2. Connect to MongoDB Atlas
mongoose
  .connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => console.error('Connection error:', err));

const app = express();

app.use(
  cors({
    origin: 'http://localhost:4200',
  })
);
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Card API is running!');
});

// GET: Retrieve all cards from MongoDB
app.get('/cards', async (req, res) => {
  try {
    const allCards = await Card.find();
    res.status(200).json(allCards);
  } catch (err) {
    console.error('Error fetching cards:', err);
    res.status(500).json({ message: 'Failed to load cards' });
  }
});

// POST: Create a new card in MongoDB
app.post('/cards', async (req, res) => {
  try {
    const { front, back } = req.body;
    const newCard = new Card({ front, back });
    const savedCard = await newCard.save();
    res.status(201).json(savedCard);
  } catch (err) {
    console.error('Error creating card:', err);
    res.status(400).json({ message: 'Failed to create card', error: err.message });
  }
});

// PUT: Update an existing card in MongoDB
app.put('/cards/:id', async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid MongoDB card ID format' });
  }

  try {
    const { front, back } = req.body;
    const updatedCard = await Card.findByIdAndUpdate(
      id,
      {
        ...(front !== undefined && { front: front.trim() }),
        ...(back !== undefined && { back: back.trim() }),
      },
      { new: true, runValidators: true }
    );

    if (!updatedCard) {
      return res.status(404).json({ message: `Card with ID ${id} not found.` });
    }

    res.status(200).json(updatedCard);
  } catch (err) {
    console.error('Error updating card:', err);
    res.status(500).json({ message: 'Server error updating card' });
  }
});

// DELETE: Remove a card by MongoDB _id
app.delete('/cards/:id', async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid MongoDB card ID format' });
  }

  try {
    const deletedCard = await Card.findByIdAndDelete(id);
    if (!deletedCard) {
      return res.status(404).json({ message: 'Card not found in database' });
    }
    res.status(200).json({ message: 'Card deleted', id });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ message: 'Server error deleting card' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});