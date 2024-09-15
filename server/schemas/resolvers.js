const { User, Book } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth');

const resolvers = {
  Query: {
    users: async () => {
      return User.find().populate('favoriteBooks');
    },
    user: async (parent, { username }) => {
      return User.findOne({ username }).populate('favoriteBooks');
    },
    books: async (parent, {}) => {
      return Book.find({}).sort({ createdAt: -1 });
    },
    book: async (parent, { bookId }) => {
      return Book.findOne({ _id: bookId });
    },
    favoriteBooks: async (parent, args, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id }).populate('favoriteBooks');
      }
      throw new AuthenticationError('You need to be logged in!');
    },
  },

  Mutation: {
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('You need to be logged in!');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw AuthenticationError;
      }

      const token = signToken(user);

      return { token, user };
    },
    addBook: async (parent, { _id, title, imageLink, author, genre, description, publisher, published }, context) => {
      if (context.user) {
        const book = await FavoriteBook.create({
          _id,
          title,
          imageLink,
          author,
          genre,
          description,
          publisher,
          published
        });
        return book;
      }
      throw new AuthenticationError('You need to be logged in!');
      
    },
    deleteBook: async (parent, { bookId }, context) => {
      if (context.user) {
        const book = await Book.findOneAndDelete({
          _id: bookId,
        });

        await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { favoriteBooks: book._id } }
        );

        return book;
      }
      throw new AuthenticationError('You need to be logged in!');
    },


    
    addComment: async (parent, { bookId, commentText }, context) => {
      if (context.user) {
        return Book.findOneAndUpdate(
          { _id: bookId },
          {
            $addToSet: {
              comments: { commentText, commentAuthor: context.user.username },
            },
          },
          {
            new: true,
            runValidators: true,
          }
        );
      }
      throw new AuthenticationError('You need to be logged in!');
    },
    unFavoriteBook: async (parent, { favoriteBookId }, context) => {
      if (context.user) {
          const favoriteBook = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { favoriteBooks: favoriteBookId } }
        );

        return favoriteBook;
      }
      throw new AuthenticationError('You need to be logged in!');
    },

    favoriteBook: async (parent, { favoriteBookId }, context) => {
      if (context.user) {
        const favoriteBook = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { favoriteBooks: favoriteBookId } }
        );

        return favoriteBook;
      }
      throw new AuthenticationError('You need to be logged in!');
    },
    
    removeComment: async (parent, { bookId, commentId }, context) => {
      if (context.user) {
        return Book.findOneAndUpdate(
          { _id: bookId },
          {
            $pull: {
              comments: {
                _id: commentId,
                commentAuthor: context.user.username,
              },
            },
          },
          { new: true }
        );
      }
      throw new AuthenticationError('You need to be logged in!');
    },
  },
};

module.exports = resolvers;
