const { Schema, model } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

const bookSchema = new Schema({
  _id: {
    type: String,
    required,
    trim: true
  },
  title: {
    type: String,
    required: 'You need to have a title!',
    minlength: 1,
    maxlength: 280,
    trim: true,
  },
  imageLink:{
    type: String,
    required: 'You need to have an imageLink',
    trim: true,
  },
  author: {
    type: String,
    required: true,
    trim: true,
  },
  genre: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  publisher: {
    type: String,
    required: true,
    trim: true, 
  },
  published: {
    type: String,
    trim: true, 
  },
  createdAt: {
    type: Date,
    default: Date.now,
    get: (timestamp) => dateFormat(timestamp),
  },
  comments: [
    {
      commentText: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 280,
      },
      commentAuthor: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
        get: (timestamp) => dateFormat(timestamp),
      },
    },
  ],
});

const Book = model('Book', bookSchema);

module.exports = Book;
