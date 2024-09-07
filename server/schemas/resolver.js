const { User, FavoriteBook } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth');

const resolvers = {
  Query: {
    users: async () => {
      return User.find().populate('favoriteBooks');
    },
    user: async (parent, { username }) => {
      return User.findOne({ username }).populate('favoriteBooks');
    },
    favoriteBooks: async (parent, { username }) => {
      const params = username ? { username } : {};
      return FavoriteBook.find(params).sort({ createdAt: -1 });
    },
    favoriteBook: async (parent, { favoriteBookId }) => {
      return FavoriteBook.findOne({ _id: favoriteBookId });
    },
    me: async (parent, args, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id }).populate('thoughts');
      }
      throw AuthenticationError;
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
        throw AuthenticationError;
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw AuthenticationError;
      }

      const token = signToken(user);

      return { token, user };
    },
    addfavoriteBook: async (parent, { title, author, genre, synopsis, publisher}, context) => {
      if (context.user) {
        const favoriteBook = await FavoriteBook.create({
          favoredBy: context.user.username,
          title,
          author,
          genre,
          synopsis,
          publisher
        });

        await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { favoriteBooks: favoriteBook._id } }
        );

        return favoriteBook;
      }
      throw AuthenticationError;
      ('You need to be logged in!');
    },
    addComment: async (parent, { favoriteBookId, commentText }, context) => {
      if (context.user) {
        return favoriteBookId.findOneAndUpdate(
          { _id: favoriteBookId },
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
      throw AuthenticationError;
    },
    unFavoriteBook: async (parent, { favoriteBookId }, context) => {
      if (context.user) {
        const favoriteBook = await FavoriteBook.findOneAndDelete({
          _id: favoriteBookId,
          favoredBy: context.user.username,
        });

        await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { favoriteBooks: favoriteBook._id } }
        );

        return thought;
      }
      throw AuthenticationError;
    },
    removeComment: async (parent, { favoriteBookId, commentId }, context) => {
      if (context.user) {
        return Thought.findOneAndUpdate(
          { _id: favoriteBookId },
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
      throw AuthenticationError;
    },
  },
};

module.exports = resolvers;
