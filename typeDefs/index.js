import { gql } from "apollo-server-express";
import post from "./post.js";
import user from "./user.js";
import image from "./image.js";

const linkSchema = gql`
  directive @isAuth on FIELD_DEFINITION
  type Query {
    _: Boolean
  }
  type Mutation {
    _: Boolean
  }
`;

export default [linkSchema, post, user, image];
