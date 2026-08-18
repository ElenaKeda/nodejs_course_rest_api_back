const bcrypt = require("bcryptjs");

const Post = require("../models/post");
const User = require("../models/user");
const { getPaginatedPosts } = require("../utils/pagination");
const HttpError = require("../utils/http-error");
const { validateUserInput, validatePostInput } = require("./validators");

const root = {
  posts: async (parent, args) => {
    const page = args?.page || 1;

    const data = await getPaginatedPosts({}, page);

    return data;
  },

  post: async (parent, args) => {
    const post = await Post.findById(args.id).populate("creator");

    if (!post) {
      throw new HttpError("Post not found", 404);
    }

    return post;
  },

  // users: async () => {
  //   return await User.find().populate("posts");
  // },

  createUser: async (parent, args) => {
    const { email, password, name } = args.userInput;

    validateUserInput({ email, password, name });

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new HttpError("User already exists", 422);
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({
      email,
      password: hashedPassword,
      name,
    });

    const createdUser = await user.save();

    return createdUser;
  },

  createPost: async (parent, args, context) => {
    const { title, content, imageUrl } = args.postInput;

    validatePostInput({
      title,
      content,
      imageUrl,
    });

    const user = await User.findById(context.userId);

    if (!user) {
      throw new HttpError("User not found.", 404);
    }

    const post = new Post({
      title,
      imageUrl,
      content,
      creator: context.userId,
    });

    const createdPost = await post.save();

    user.posts.push(createdPost._id);
    await user.save();

    await createdPost.populate("creator");

    return createdPost;
  },

  updatePost: async (parent, args, context) => {
    const { postId, postInput } = args;
    const { title, content, imageUrl } = postInput;

    validatePostInput({
      title,
      content,
      imageUrl,
    });

    const post = await Post.findById(postId);

    if (!post) {
      throw new HttpError("Post not found.", 404);
    }

    if (post.creator.toString() !== context.userId) {
      throw new HttpError("Not authorized!", 403);
    }

    post.title = title.trim();
    post.content = content.trim();
    post.imageUrl = imageUrl;

    const updatedPost = await post.save();

    await updatedPost.populate("creator");

    return updatedPost;
  },

  deletePost: async (parent, args, context) => {
    const { postId } = args;

    const post = await Post.findById(postId);

    if (!post) {
      throw new HttpError("Post not found.", 404);
    }

    if (post.creator.toString() !== context.userId) {
      throw new HttpError("Not authorized!", 403);
    }

    await Post.findByIdAndDelete(postId);

    const user = await User.findById(context.userId);

    if (!user) {
      throw new HttpError("User not found.", 404);
    }

    user.posts.pull(postId);

    await user.save();

    return {
      message: "Post deleted successfully!",
    };
  },
};

module.exports = root;
