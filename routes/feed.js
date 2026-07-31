const express = require("express");
const { body } = require("express-validator");

const feedController = require("../controllers/feed");
const asyncHandler = require("../utils/async-handler");
const isAuth = require("../middlewares/is-auth");

const router = express.Router();

const bodyCheckForFeedEntity = [
  body("title").trim().isString().isLength({ min: 5 }),
  body("content").trim().isLength({ min: 5, max: 255 }),
];

// GET /feed/posts
router.get("/posts", isAuth, asyncHandler(feedController.getPosts));

// POST /feed/post
router.post(
  "/post",
  isAuth,
  [...bodyCheckForFeedEntity],
  asyncHandler(feedController.createPost),
);

// PUT /feed/post/:postId
router.put(
  "/post/:postId",
  isAuth,
  [...bodyCheckForFeedEntity],
  asyncHandler(feedController.updatePost),
);

// DELETE /feed/post/:postId
router.delete("/post/:postId", isAuth, asyncHandler(feedController.deletePost));

// GET /feed/post/:postId
router.get("/post/:postId", isAuth, asyncHandler(feedController.getPost));

module.exports = router;
