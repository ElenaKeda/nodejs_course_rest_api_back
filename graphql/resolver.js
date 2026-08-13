const Post = require("../models/post");
const User = require("../models/user");
const { getPaginatedPosts } = require("../utils/pagination");
const HttpError = require("../utils/http-error");

const root = {
  posts: async (parent, args) => {
    const page = args?.page || 1;

    const data = await getPaginatedPosts({}, page);

    return data;
  },

  users: async () => {
    return await User.find().populate("posts");
  },

  createPost: async ({ title, imageUrl, content }, { req }) => {
    const user = await User.findById(req.userId);

    if (!user) {
      throw new HttpError("User not found.", 404);
    }

    const post = new Post({
      title,
      imageUrl,
      content,
      creator: req.userId,
    });

    const createdPost = await post.save();

    user.posts.push(createdPost._id);
    await user.save();

    return await createdPost.populate("creator");
  },
};

module.exports = root;
