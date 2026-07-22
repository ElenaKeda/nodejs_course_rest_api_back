const express = require("express");
const { body } = require("express-validator");

const feedController = require("../controllers/feed");

const router = express.Router();

const bodyCheckForFeedEntity = [
  body("title").trim().isString().isLength({ min: 5 }),
  body("content").trim().isLength({ min: 5, max: 255 }),
];

// GET /feed/posts
router.get("/posts", feedController.getPosts);

// POST /feed/post
router.post("/post", [...bodyCheckForFeedEntity], feedController.createPost);

module.exports = router;
