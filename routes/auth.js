const express = require("express");
const authController = require("../controllers/auth");
const asyncHandler = require("../utils/async-handler");

const router = express.Router();

router.post("/signup", asyncHandler(authController.signup));

router.post("/login", asyncHandler(authController.login));

module.exports = router;
