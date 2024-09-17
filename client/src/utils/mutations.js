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
  mutation addComment($favoriteBookId: ID!, $commentText: String!) {
    addComment(favoriteBookId: $favoriteBookId, commentText: $commentText) {
      comments {
        _id
        commentText
        createdAt
      }
    }
  }
`;


export const ADD_BOOK = gql`
  mutation addBook($title: String!, $author: String!, $genre: String!, $synopsis: String!, $publisher: String!) {
    addBook(title: $title, author: $author, genre: $genre, synopsis: $synopsis, publisher: $publisher) {
      _id
      favoredBy
      title
      author
      genre
      synopsis
      publisher
      createdAt
      comments {
        _id
        commentText
      }
    }
  }
`;
