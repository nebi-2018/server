import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    info: String!
  }
  extend type Mutation {
    imageUploader(file: Upload!): File!
  }

  type File {
    id: ID!
    filename: String!
    mimetype: String!
    path: String!
  }
`;
