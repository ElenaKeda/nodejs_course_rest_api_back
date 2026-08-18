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

  type DeletePostResponse {
    message: String!
  }

  type Query {
    posts(page: Int): PostsData!
    post(id: ID!): Post!
  }

  type Mutation {
    createPost(
      title: String!
      content: String!
      imageUrl: String!
    ): Post!

    updatePost(
      postId: ID!
      title: String!
      content: String!
      imageUrl: String!
    ): Post!

    deletePost(postId: ID!): DeletePostResponse!
  }
`;

const resolvers = require("./resolver");

module.exports = makeExecutableSchema({
  typeDefs,
  resolvers: {
    Query: {
      posts: resolvers.posts,
      post: resolvers.post,
    },

    Mutation: {
      createPost: resolvers.createPost,
      updatePost: resolvers.updatePost,
      deletePost: resolvers.deletePost,
    },
  },
});
