const { validationResult } = require("express-validator");

const Post = require("../models/post");
const User = require("../models/user");
const HttpError = require("../utils/http-error");
const { saveFile, clearImage } = require("../utils/file");
const { getPaginatedPosts } = require("../utils/pagination");
const { getIO } = require("../utils/socket");

exports.getPosts = async (req, res, next) => {
  const page = +req.query.page || 1;

  const data = await getPaginatedPosts({}, page);

  res.status(200).json({
    message: "Fetched posts successfully!",
    posts: data.posts,
    totalItems: data.totalItems,
    currentPage: data.currentPage,
    itemsPerPage: data.itemsPerPage,
  });
};

exports.getPost = async (req, res, next) => {
  const post = await Post.findById(req.params.postId).populate("creator");

  if (!post) {
    throw new HttpError("Post not found", 404);
  }

  res.status(200).json({
    message: "Fetched post successfully!",
    post,
  });
};

exports.createPost = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new HttpError(
      "Validation failed! Please, enter correct values!",
      422,
    );
  }

  const title = req.body.title;
  const content = req.body.content;

  if (!req.files || !req.files.image) {
    throw new HttpError("No image provided.", 422);
  }

  const imageUrl = saveFile(req.files.image);

  const post = new Post({
    title,
    imageUrl,
    content,
    creator: req.userId,
  });

  const createdPost = await post.save();

  const user = await User.findById(req.userId);

  if (!user) {
    throw new HttpError("User not found.", 404);
  }

  user.posts.push(createdPost._id);

  await user.save();

  await createdPost.populate("creator");

  getIO().emit("posts", {
    action: "create",
    post: createdPost,
  });

  return res.status(201).json({
    message: "Post created successfully!",
    post: createdPost,
  });
};

exports.updatePost = async (req, res, next) => {
  const postId = req.params.postId;
  const title = req.body.title;
  const content = req.body.content;

  const post = await Post.findById(postId);

  if (!post) {
    throw new HttpError("Post not found", 404);
  }

  if (post.creator.toString() !== req.userId) {
    throw new HttpError("Not authorized!", 403);
  }

  post.title = title;
  post.content = content;

  if (!req.files || !req.files.image) {
    throw new HttpError("No image provided.", 422);
  }

  const oldImageUrl = post.imageUrl;

  const imageUrl = saveFile(req.files.image);

  post.imageUrl = imageUrl;

  await clearImage(oldImageUrl);

  const updatedPost = await post.save();

  await updatedPost.populate("creator");

  getIO().emit("posts", {
    action: "update",
    post: updatedPost,
  });

  return res.status(200).json({
    message: "Post updated successfully!",
    post: updatedPost,
  });
};

exports.deletePost = async (req, res, next) => {
  const postId = req.params.postId;

  const post = await Post.findById(postId);

  if (!post) {
    throw new HttpError("Post not found", 404);
  }

  if (post.creator.toString() !== req.userId) {
    throw new HttpError("Not authorized!", 403);
  }

  if (post.imageUrl) {
    await clearImage(post.imageUrl);
  }

  await Post.findByIdAndDelete(postId);

  const user = await User.findById(req.userId);

  user.posts.pull(postId);

  await user.save();

  getIO().emit("posts", {
    action: "delete",
    postId,
  });

  return res.status(200).json({
    message: "Post deleted successfully!",
  });
};
