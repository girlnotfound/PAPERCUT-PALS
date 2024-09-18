import { gql } from '@apollo/client';

export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser($username: String!, $email: String!, $profileImage: String) {
    updateUser(username: $username, email: $email, profileImage: $profileImage) {
      _id
      username
      email
      profileImage
    }
  }
`;


export const ADD_COMMENT = gql`
  mutation addComment($bookId: String!, $commentText: String!) {
    addComment(bookId: $bookId, commentText: $commentText) {
      comments {
        _id
        commentAuthor
        commentText
        createdAt
      }
    }
  }
`;

export const REMOVE_COMMENT = gql`
  mutation removeComment($bookId: String!, $commentId: ID!) {
    removeComment(bookId: $bookId, commentId: $commentId) {
      comments {
        _id
        commentAuthor
        commentText
        createdAt
      }
    }
  }
`;


export const ADD_BOOK = gql`
  mutation addBook($_id: String!, $title: String!, $imageLink: String!, $author: String!, $genre: String!, $description: String!, $publisher: String!, $published: String!) {
    addBook(_id: $_id, title: $title, imageLink: $imageLink, author: $author, genre: $genre, description: $description, publisher: $publisher, published: $published) {
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

export const FAVORITE_BOOK = gql`
  mutation favoriteBook($favoriteBookId: String!) {
    favoriteBook(favoriteBookId: $favoriteBookId) {
      username
      favoriteBooks {
        _id
      }
    }
  }
`;

export const UNFAVORITE_BOOK = gql`
  mutation unFavoriteBook($favoriteBookId: String!) {
    unFavoriteBook(favoriteBookId: $favoriteBookId) {
      username
      favoriteBooks {
        _id
      }
    }
  }
`;
