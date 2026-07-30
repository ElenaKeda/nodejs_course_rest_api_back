const express = require("express");
const { body } = require("express-validator");

const authController = require("../controllers/auth");
const asyncHandler = require("../utils/async-handler");

const router = express.Router();

router.post(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .normalizeEmail(),

    body("password")
      .trim()
      .isLength({ min: 5 })
      .withMessage("Password must be at least 5 characters."),

    body("name")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Name must be at least 2 characters."),
  ],
  asyncHandler(authController.signup),
);

router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .normalizeEmail(),

    body("password")
      .trim()
      .isLength({ min: 5 })
      .withMessage("Password must be at least 5 characters."),
  ],
  asyncHandler(authController.login),
);

module.exports = router;
