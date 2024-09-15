const db = require('../config/connection');
const { User, Book } = require('../models');
const userSeeds = require('./userSeeds.json');
const favoriteBookSeeds = require('./favoriteBookSeeds.json');
const cleanDB = require('./cleanDB');
const axios = require('axios');

const fetchBooks = async (genre) => {
  try {
    const response = await axios.get('https://www.googleapis.com/books/v1/volumes', {
      params: {
        q: `subject:${genre}`,
        maxResults: 40,
        orderBy: 'relevance',
        printType: 'books'
      }
    });

    return response.data.items.map(book => ({
      _id: book.id,
      title: book.volumeInfo.title,
      imageLink: book.volumeInfo.imageLinks?.thumbnail || "https://via.placeholder.com/128x192",
      author: book.volumeInfo.authors?.[0] || 'Unknown Author',
      genre: genre,
      description: book.volumeInfo.description || 'No description available',
      publisher: book.volumeInfo.publisher || 'Unknown Publisher',
      published: book.volumeInfo.publishedDate || 'Unknown',
    }));
  } catch (error) {
    console.error('Error fetching books:', error);
    return [];
  }
};

db.once('open', async () => {
  try {
    await cleanDB('Book', 'books');
    await cleanDB('User', 'users');

    const genres = ['fiction', 'nonfiction', 'romance', 'horror', 'fantasy', 'adventure', 'biographies'];

    for (let i = 0; i < genres.length; i++) {
      const data = await fetchBooks(genres[i]);
      await Book.create(data);
    }

    console.log('all done!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
});