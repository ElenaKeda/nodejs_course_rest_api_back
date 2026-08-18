const { makeExecutableSchema } = require("@graphql-tools/schema");

const typeDefs = `
  type User {
    _id: ID!
    email: String!
    name: String!
    status: String!
    posts: [Post!]
    createdAt: String!
    updatedAt: String!
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

  input UserInputData {
    email: String!
    password: String!
    name: String!
  }

  input PostInputData {
    title: String!
    content: String!
    imageUrl: String!
  }

  type DeletePostResponse {
    message: String!
  }

  type Query {
    posts(page: Int): PostsData!
    post(id: ID!): Post!
  }

  type Mutation {
    createPost(postInput: PostInputData!): Post!

    updatePost(
      postId: ID!
      postInput: PostInputData!
    ): Post!

    deletePost(postId: ID!): DeletePostResponse!

    createUser(userInput: UserInputData!): User!
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

      createUser: resolvers.createUser,
    },
  },
});
