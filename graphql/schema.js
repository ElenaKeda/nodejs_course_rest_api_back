const { makeExecutableSchema } = require("@graphql-tools/schema");

const typeDefs = `
  type User {
    _id: ID!
    email: String!
    name: String!
    status: String!
  }

  type Post {
    _id: ID!
    title: String!
    imageUrl: String!
    content: String!
    creator: User!
    createdAt: String!
    updatedAt: String!
  }

  type PostsData {
    posts: [Post!]!
    totalItems: Int!
    currentPage: Int!
    itemsPerPage: Int!
  }

  type Query {
    posts(page: Int): PostsData!
  }
`;

const resolvers = require("./resolver");

module.exports = makeExecutableSchema({
  typeDefs,
  resolvers: {
    Query: {
      posts: resolvers.posts,
    },
  },
});
