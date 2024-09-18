import { gql } from '@apollo/client';

export const QUERY_USER = gql`
  query user($username: String!) {
    user(username: $username) {
      _id
      username
      email
      favoriteBooks {
        _id
      }
    }
  }
`;

export const QUERY_USERS = gql`
  query users {
    users {
      _id
      username
      email
      favoriteBooks {
        _id
      }
    }
  }
`;

export const QUERY_BOOKS = gql`
  query getBooks {
    books {
      _id
      title
      imageLink
      author
      genre
      description
      publisher
      published
      createdAt
      comments {
        _id
        commentAuthor
        commentText
        createdAt
      }
    }
  }
`;

export const QUERY_ME = gql`
  query me {
    me {
      _id
      username
      email
      profileImage
    }
  }
`;

export const QUERY_BOOK = gql`
  query getBook($bookId: String!) {
    book(bookId: $bookId) {
      _id
      title
      imageLink
      author
      genre
      description
      publisher
      published
      createdAt
      comments {
        _id
        commentAuthor
        commentText
        createdAt
      }
    }
  }
`;

export const QUERY_FAVORITEBOOKS = gql`
  query getFavoriteBooks($username: String!) {
    favoriteBooks(username: $username) {
      _id
      username
      email
      favoriteBooks {
        _id
      }
    }
  }
`;