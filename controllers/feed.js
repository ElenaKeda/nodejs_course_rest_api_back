const { validationResult } = require("express-validator");

const Post = require("../models/post");
const HttpError = require("../utils/http-error");
const saveFile = require("../utils/file");

exports.getPosts = async (req, res, next) => {
  const posts = await Post.find();

  res.status(200).json({
    message: "Fetched posts successfully!",
    posts,
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
