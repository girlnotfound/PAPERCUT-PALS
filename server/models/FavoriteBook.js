const { Schema, model } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

const favoriteBookSchema = new Schema({
  favoritedBy: {
    type: String,
    required: true,
    trim: true,
  },
  title: {
    type: String,
    required: 'You need to have a title!',
    minlength: 1,
    maxlength: 280,
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
  synopsis: {
    type: String,
    required: true,
    trim: true,
  },
  publisher: {
    type: String,
    required: true,
    trim: true, 
  },
  addedAt: {
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

const Thought = model('FavoriteBook', thoughtSchema);

module.exports = Thought;
