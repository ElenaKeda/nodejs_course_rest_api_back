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

  createPost: async (parent, args, context) => {
    const { title, content, imageUrl } = args;

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
    const { postId, title, content, imageUrl } = args;

    const post = await Post.findById(postId);

    if (!post) {
      throw new HttpError("Post not found.", 404);
    }

    if (post.creator.toString() !== context.userId) {
      throw new HttpError("Not authorized!", 403);
    }

    post.title = title;
    post.content = content;
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
