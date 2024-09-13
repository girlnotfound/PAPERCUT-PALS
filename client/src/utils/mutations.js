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

