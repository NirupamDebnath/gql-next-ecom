import { gql } from "apollo-server-express";

export const typeDefs = gql`
  scalar Upload

  directive @deprecated(
    reason: String = "No longer supported"
  ) on FIELD_DEFINITION | ENUM_VALUE
  directive @uppercase on FIELD_DEFINITION

  type File {
    filename: String!
    mimetype: String!
    encoding: String!
  }

  type Query {
    signup(email: String!, firstName: String!, lastName: String!): String!
    verifyEmail(token: String!): String!
    signin(email: String!, password: String!): AuthPayload!
    hello: String @auth(requires: USER)
  }

  type Mutation {
    createUser(token: String!, password: String!): String!
    uploadPayslip(file: Upload!): File! @auth(requires: USER)
  }

  type AuthPayload {
    access_token: String!
  }
`;
