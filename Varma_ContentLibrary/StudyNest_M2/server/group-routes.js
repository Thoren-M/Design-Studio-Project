const express = require('express');
const mongoose = require('mongoose');
const Assignment = require('./models/assignment');

const cardSchema = new mongoose.Schema(
  {
    front: { type: String, required: true, trim: true },
    back: { type: String, required: true, trim: true }
  },
  { timestamps: true }
);

const Card = mongoose.model('Card', cardSchema);
const router = express.Router();

function addCrudRoutes(basePath, Model, fields) {
  router.param('id', (req, res, next, id) => {
    if (!mongoose.isObjectIdOrHexString(id)) {
      return res.status(400).json({ message: 'Invalid record ID.' });
    }
    next();
  });

  function validateInput(req, res, next) {
    const data = {};

    for (const field of fields) {
      const value = req.body?.[field];

      if (typeof value !== 'string' || !value.trim()) {
        return res.status(400).json({
          message: `${field} is required.`
        });
      }

      data[field] = value.trim();
    }

    res.locals.record = data;
    next();
  }

  router.get(basePath, async (req, res, next) => {
    try {
      const records = await Model.find().sort({ createdAt: -1 });
      res.json(records);
    } catch (error) {
      next(error);
    }
  });

  router.post(basePath, validateInput, async (req, res, next) => {
    try {
      const record = await Model.create(res.locals.record);
      res.status(201).json(record);
    } catch (error) {
      next(error);
    }
  });

  router.put(`${basePath}/:id`, validateInput, async (req, res, next) => {
    try {
      const record = await Model.findByIdAndUpdate(
        req.params.id,
        { $set: res.locals.record },
        { new: true, runValidators: true }
      );

      if (!record) {
        return res.status(404).json({ message: 'Record not found.' });
      }

      res.json(record);
    } catch (error) {
      next(error);
    }
  });

  router.delete(`${basePath}/:id`, async (req, res, next) => {
    try {
      const record = await Model.findByIdAndDelete(req.params.id);

      if (!record) {
        return res.status(404).json({ message: 'Record not found.' });
      }

      res.json({
        message: 'Record deleted successfully.',
        id: req.params.id
      });
    } catch (error) {
      next(error);
    }
  });
}

addCrudRoutes('/cards', Card, ['front', 'back']);

addCrudRoutes('/api/assignments', Assignment, [
  'title',
  'course',
  'description',
  'dueDate',
  'status'
]);

module.exports = router;