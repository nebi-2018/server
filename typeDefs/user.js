import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    authUserProfile: User! @isAuth
    getUsers: [User]
    loginUser(username: String!, password: String!): AuthResp!
  }

  extend type Mutation {
    registerUser(newUser: UserInput!): AuthResp!
  }

  input UserInput {
    username: String!
    password: String!
    email: String!
    avatarImage: Upload
  }

  type User {
    username: String!
    email: String!
    avatarImage: String
    id: ID
  }

  type AuthResp {
    user: User!
    token: String
  }
`;
