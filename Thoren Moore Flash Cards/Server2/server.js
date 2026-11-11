const express = require('express');
const cors = require('cors');

// Sample Cards
const cards = [
  {
    id: 1,
    front: 'I',
    back: 'me'
  }
]
// Create the Express application.
const app = express();

const PORT = 8000;

// Allow requests from Angular.
app.use(cors({
  origin: 'http://localhost:4200'
}));

// Parse incoming JSON request bodies.
app.use(express.json());

// Respond to requests at the home URL.
app.get('/', (req, res) => {
  res.send('Card API is running!');
});

// Retrieve cards.
app.get('/cards', (req, res) => {
  console.log('GET request received for cards');

  // Return card data as JSON.
  res.status(200).json(cards);
});

// app.ts / server.ts
app.post('/cards', (req, res) => {
  // Handling logic
  res.status(201).json(req.body);
});

// PUT: Update existing card
app.put('/cards/:id', (req, res) => {
  const id = Number(req.params.id);
  const { front, back } = req.body;

  const cardIndex = cards.findIndex((c) => c.id === id);

  if (cardIndex === -1) {
    return res.status(404).json({ error: 'Card with ID ${id} not found.' });
  }

  cards[cardIndex] = {
    ...cards[cardIndex],
    ...(front !== undefined && { front: front.trim() }),
    ...(back !== undefined && { back: back.trim() }),
  };

  return res.status(200).json(cards[cardIndex]);
});

// DELETE: Remove a card by ID
app.delete('/cards/:id', (req, res) => {
  const id = Number(req.params.id);
  const initialLength = cards.length;

  cards = cards.filter((c) => c.id !== id);

  if (cards.length === initialLength) {
    return res.status(404).json({ error: `Card with ID ${id} not found.` });
  }

  // 204 No Content confirms successful deletion without returning a body
  return res.status(204).send();
});

// Start the server.
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});