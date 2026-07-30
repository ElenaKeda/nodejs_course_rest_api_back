const { validationResult } = require("express-validator");

const Post = require("../models/post");
const HttpError = require("../utils/http-error");
const { saveFile, clearImage } = require("../utils/file");
const { getPaginatedPosts } = require("../utils/pagination");

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
  const post = await Post.findById(req.params.postId);

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
  const imageUrl = saveFile(req.files.image);

  const post = new Post({
    title,
    imageUrl,
    content,
    // creator: req.userId,
    creator: { name: "Test User" },
  });

  const createdPost = await post.save();

  res.status(201).json({
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

  post.title = title;
  post.content = content;

  if (req.files && req.files.image) {
    const oldImageUrl = post.imageUrl;
    const imageUrl = saveFile(req.files.image);

    post.imageUrl = imageUrl;

    clearImage(oldImageUrl);
  }

  const updatedPost = await post.save();

  res.status(200).json({
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

  if (post.imageUrl) {
    await clearImage(post.imageUrl);
  }

  await Post.findByIdAndDelete(postId);

  res.status(200).json({
    message: "Post deleted successfully!",
  });
};
