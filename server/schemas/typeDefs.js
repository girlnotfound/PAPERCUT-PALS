const typeDefs = `
  type User {
    _id: ID
    username: String
    email: String
    password: String
    favoriteBooks: [Book]!
  }

  type Book {
    _id: String
    title: String
    imageLink: String
    author: String
    genre: String
    description: String
    publisher: String
    published: String
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
    favoriteBooks(username: String): User
    book(bookId: String!): Book
    books: [Book]
    me: User
  }

  type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    addBook(title: String!, imageLink: String!, author: String!, genre: String!, synopsis: String!, publisher: String!, published: String ): Book
    addComment(bookId: String!, commentText: String!): Book
    favoriteBook(favoriteBookId: String!): User
    unFavoriteBook(favoriteBookId: String!): User
    deleteBook(bookId: String!): Book
    removeComment(bookId: String!, commentId: ID!): Book
  }
`;

module.exports = typeDefs;
