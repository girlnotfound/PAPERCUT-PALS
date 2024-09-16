const typeDefs = `
  type User {
    _id: ID
    username: String
    email: String
    password: String
    favoriteBooks: [FavoriteBook]!
  }

  type FavoriteBook {
    _id: ID
    favoredBy: String
    title: String
    author: String
    genre: String
    synopsis: String
    publisher: String
    createdAt: String
    comments: [Comment]!
  }

  type Comment {
    _id: ID
    commentText: String
    commentAuthor: String
    createdAt: String
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    users: [User]
    user(username: String!): User
    favoriteBooks(username: String): [FavoriteBook]
    favoriteBook(favoriteBookId: ID!): FavoriteBook
    me: User
  }

  type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    addBook(title: String!, author: String!, genre: String!, synopsis: String!, publisher: String! ): FavoriteBook
    addComment(favoriteBookId: ID!, commentText: String!): FavoriteBook
    unFavoriteBook(favoriteBookId: ID!): FavoriteBook
    removeComment(favoriteBookId: ID!, commentId: ID!): FavoriteBook
    updateUser(username: String, email: String): User
  }
`;

module.exports = typeDefs;
