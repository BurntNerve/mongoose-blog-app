const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const mongoose = require('mongoose');

const { Blogpost } = require('../models');

router.get('/', (req, res) => {
  Blogpost.find()
    .exec()
    .then(posts => {
      res.json({
        posts: posts.map(post => post.represent())
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: 'Internal sever error.' });
    });
});

router.get('/:id', (req, res) => {
  Blogpost.findById(req.params.id)
    .then(post => {
      res.json(post.represent());
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: 'Internal server error' });
    });
});

router.post('/', jsonParser, (req, res) => {
  const requiredFields = ['title', 'content', 'author'];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing the ${field} field.`;
      console.log(message);
      res.status(400).send(message);
    }
  }

  Blogpost.create({
    _id: mongoose.Types.ObjectId(),
    title: req.body.title,
    content: req.body.content,
    author: `${req.body.firstName} ${req.body.lastName}`,
    created: new Date()
  })
    .then(post => {
      res.status(204).json(post.represent());
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: 'Internal server error.' });
    });
});

router.put('/:id', jsonParser, (req, res) => {
  if (req.body.id === undefined || req.body.id !== req.params.id) {
    const message = `Your ${req.params.id} and ${req.body.id} must match!`;
    console.log(message);
    res.status(400).send(message);
  }

  toUpdate = {};
  updatableFields = ['title', 'content', 'author'];
  for (let i = 0; i < updatableFields.length; i++) {
    const field = updatableFields[i];
    if (field in req.body) {
      toUpdate[field] = req.body[field];
    }
  }

  Blogpost.findByIdAndUpdate(req.params.id, { $set: toUpdate })
    .exec()
    .then(post => {
      res.status(204).end();
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: 'Internal server error' });
    });
});

router.delete('/:id', (req, res) => {
  Blogpost.findByIdAndRemove(req.params.id)
    .exec()
    .then(post => {
      res.status(204).end();
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: 'Internal server error.' });
    });
});
module.exports = router;
