const { gql } = require('apollo-server-express');
// import graphql, include all fields for item and user models as well as auth token, and queries and mutations according to what information they are taking in and responding with
const typeDefs = gql`
  type User {
    _id: ID!
    username: String!
    email: String!
    password: String!
    issues: [Issue]
    projects: [Project]
  }

  type Issue {
    _id: ID!
    name: String!
    status: String!
    description: String
    user: String!
    project: String!
  }

  type Project {
    _id: ID!
    name: String!
    status: String!
    description: String
    user: String!
    issues: 
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    users: [User]
    user(username: String!): User
    issues(project: String!): [Issue]
    projects: [Project]
    project(projectId: ID!): Project
    issueStatus(status: String!): [Issue]
    projectStatus(status: String!): [Status]
    me: User
  }

  type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    addProject()
    addItem(name: String!, genre: String!, location: String!, condition: String!, description: String, image_id: String!): Item
    removeItem (itemId: ID!): Item
  }
`;
// export typedefs
module.exports = typeDefs;
