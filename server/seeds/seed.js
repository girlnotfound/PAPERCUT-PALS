const db = require('../config/connection');
const { User, Book } = require('../models');
const cleanDB = require('./cleanDB');
const axios = require('axios');
const bcrypt = require('bcrypt');

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
      comments: []
    }));
  } catch (error) {
    console.error('Error fetching books:', error);
    return [];
  }
};

const fetchBooksByAuthor = async (author) => {
  try {
    const response = await axios.get('https://www.googleapis.com/books/v1/volumes', {
      params: {
        q: `inauthor:${author}`,
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
      genre: book.volumeInfo.categories?.join(", ") || "Unknown",
      description: book.volumeInfo.description || 'No description available',
      publisher: book.volumeInfo.publisher || 'Unknown Publisher',
      published: book.volumeInfo.publishedDate || 'Unknown',
      comments: []
    }));
  } catch (error) {
    console.error('Error fetching books:', error);
    return [];
  }
};

const createMockUsers = async () => {
  const mockUsers = [
    { username: 'JohnDoe', email: 'john@example.com', password: 'password123' },
    { username: 'JaneSmith', email: 'jane@example.com', password: 'password456' },
    { username: 'BookLover', email: 'booklover@example.com', password: 'ilovebooks' },
    { username: 'AliceWonder', email: 'alice@example.com', password: 'wonderland' },
    { username: 'BobBuilder', email: 'bob@example.com', password: 'canwefixit' },
    { username: 'CharlieBrown', email: 'charlie@example.com', password: 'snoopy' },
    { username: 'DaisyFlower', email: 'daisy@example.com', password: 'petals' },
    { username: 'EveExplorer', email: 'eve@example.com', password: 'adventure' },
    { username: 'FrankSinatra', email: 'frank@example.com', password: 'myway' },
    { username: 'GraceHopper', email: 'grace@example.com', password: 'compiler' }
  ];

  const createdUsers = [];

  for (const user of mockUsers) {
    const newUser = await User.create({
      username: user.username,
      email: user.email,
      password: user.password
    });
    createdUsers.push(newUser);
  }

  return createdUsers;
};

const fetchBooksByTitle = async (title) => {
  try {
    const response = await axios.get('https://www.googleapis.com/books/v1/volumes', {
      params: {
        q: `intitle:${title}`,
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
      genre: book.volumeInfo.categories?.join(", ") || "Unknown",
      description: book.volumeInfo.description || 'No description available',
      publisher: book.volumeInfo.publisher || 'Unknown Publisher',
      published: book.volumeInfo.publishedDate || 'Unknown',
      comments: []
    }));

  } catch (error) {
    console.error('Error fetching books:', error);
    return [];
  }
};

const bookExists = async (bookId) => {
  const existingBook = await Book.findOne({ _id: bookId });
  return !!existingBook;
};

const addMockComments = async (books, users) => {
  const mockComments = [
    "Great read! Couldn't put it down.",
    "Highly recommended for fans of the genre.",
    "The characters were well-developed and relatable.",
    "An intriguing plot that kept me guessing until the end.",
    "Beautiful prose and vivid descriptions throughout.",
    "A thought-provoking book that challenges conventional wisdom.",
    "Not my favorite, but still an enjoyable read.",
    "The author's unique perspective shines through in every chapter.",
    "A perfect balance of humor and drama.",
    "I found myself completely immersed in the story world.",
    "The pacing was a bit slow for my taste, but the ending was worth it.",
    "A masterpiece that will stay with me for a long time.",
    "Interesting concept, but the execution fell short in some areas.",
    "The dialogue felt authentic and brought the characters to life.",
    "A page-turner that had me up all night reading.",
    "The themes explored in this book are both timely and timeless.",
    "While not groundbreaking, it's a solid addition to the genre.",
    "I appreciated the author's attention to historical detail.",
    "The plot twists were unexpected and brilliantly executed.",
    "A comfort read that I'll return to again and again."
  ];

  for (const book of books) {
    for (let i = 0; i < 3; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const randomComment = mockComments[Math.floor(Math.random() * mockComments.length)];
      book.comments.push({
        commentAuthor: randomUser.username,
        commentText: randomComment,
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000))
      });
    }
    await book.save();
  }
};

db.once('open', async () => {
  try {
    await cleanDB('Book', 'books');
    await cleanDB('User', 'users');

    const genres = ['fiction', 'nonfiction', 'romance', 'horror', 'fantasy', 'adventure', 'biographies'];
    const authors = ['J.K. Rowling', 'George R.R. Martin', 'Stephen King', 'Agatha Christie', 'Jane Austen'];
    const titles = ['Eldest', 'Harry Potter and The Deathly Hollows', 'A Game of Thrones'];

    let allBooks = [];

    for (let i = 0; i < genres.length; i++) {
      const data = await fetchBooks(genres[i]);
      for (const bookData of data) {
        if (!(await bookExists(bookData._id))) {
          const createdBook = await Book.create(bookData);
          allBooks.push(createdBook);
        } else {
          console.log(`Book with ID ${bookData._id} already exists. Skipping.`);
        }
      }
    }

    for (let i = 0; i < authors.length; i++) {
      const data = await fetchBooksByAuthor(authors[i]);
      for (const bookData of data) {
        if (!(await bookExists(bookData._id))) {
          const createdBook = await Book.create(bookData);
          allBooks.push(createdBook);
        } else {
          console.log(`Book with ID ${bookData._id} already exists. Skipping.`);
        }
      }
    }

    for (let i = 0; i < titles.length; i++) {
      const data = await fetchBooksByTitle(titles[i]);
      for (const bookData of data) {
        if (!(await bookExists(bookData._id))) {
          const createdBook = await Book.create(bookData);
          allBooks.push(createdBook);
        } else {
          console.log(`Book with ID ${bookData._id} already exists. Skipping.`);
        }
      }
    }


    const users = await createMockUsers();
    await addMockComments(allBooks, users);

    // Add favorite books to users
    for (const user of users) {
      const numberOfFavorites = Math.floor(Math.random() * 5) + 1; // 1 to 5 favorite books
      const favoriteBooks = allBooks
        .sort(() => 0.5 - Math.random())
        .slice(0, numberOfFavorites)
        .map(book => book._id);
      user.favoriteBooks = favoriteBooks;
      await user.save();
    }

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error during seeding:', err);
    process.exit(1);
  }
});