require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: 'http://localhost:4200' }));
app.use(express.json());

const materialSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    course: { type: String, required: true, trim: true },
    content: { type: String, required: true, trim: true }
  },
  { timestamps: true }
);

const Material = mongoose.model('Material', materialSchema);

// Check that the submitted fields contain text.
function validateMaterial(req, res, next) {
  const fields = ['title', 'course', 'content'];

  if (
    fields.some(
      field =>
        typeof req.body?.[field] !== 'string' ||
        !req.body[field].trim()
    )
  ) {
    return res.status(400).json({
      message: 'Title, course, and content are required.'
    });
  }

  res.locals.material = {
    title: req.body.title.trim(),
    course: req.body.course.trim(),
    content: req.body.content.trim()
  };

  next();
}

// Reject invalid MongoDB IDs.
app.param('id', (req, res, next, id) => {
  if (!mongoose.isObjectIdOrHexString(id)) {
    return res.status(400).json({
      message: 'Invalid material ID.'
    });
  }

  next();
});

// READ all materials.
app.get('/api/materials', async (req, res) => {
  const materials = await Material.find().sort({ createdAt: -1 });
  res.json(materials);
});

// CREATE a material.
app.post('/api/materials', validateMaterial, async (req, res) => {
  const material = await Material.create(res.locals.material);
  res.status(201).json(material);
});

// UPDATE a material.
app.put('/api/materials/:id', validateMaterial, async (req, res) => {
  const material = await Material.findByIdAndUpdate(
    req.params.id,
    { $set: res.locals.material },
    { new: true, runValidators: true }
  );

  if (!material) {
    return res.status(404).json({
      message: 'Material not found.'
    });
  }

  res.json(material);
});

// DELETE a material.
app.delete('/api/materials/:id', async (req, res) => {
  const material = await Material.findByIdAndDelete(req.params.id);

  if (!material) {
    return res.status(404).json({
      message: 'Material not found.'
    });
  }

  res.json({ message: 'Material deleted successfully.' });
});
app.use(require('./group-routes'));
// Handle errors.
app.use((error, req, res, next) => {
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Please complete all required fields.'
    });
  }

  if (error.status === 400) {
    return res.status(400).json({
      message: 'Invalid request.'
    });
  }

  console.error(error.message);
  res.status(500).json({
    message: 'A server error occurred. Please try again.'
  });
});

// Start only after MongoDB connects.
async function startServer() {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI ||
        'mongodb://127.0.0.1:27017/studynest'
    );

    console.log('Connected to MongoDB: studynest');

    app.listen(PORT, '127.0.0.1', () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
}

startServer();