const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const HttpError = require("../utils/http-error");

exports.signup = async (req, res) => {
  const { email, password, name } = req.body;

  console.log({ email, password, name });

  const existingUser = await User.findOne({
    email,
  });

  if (existingUser) {
    throw new HttpError("User already exists", 422);
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = new User({
    email,
    password: hashedPassword,
    name,
  });

  await user.save();

  res.status(201).json({
    message: "User created",
    userId: user._id,
  });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({
    email,
  });

  if (!user) {
    throw new HttpError("Invalid credentials", 401);
  }

  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    throw new HttpError("Invalid credentials", 401);
  }

  const token = jwt.sign(
    {
      email: user.email,
      userId: user._id.toString(),
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    },
  );

  res.status(200).json({
    token,
    userId: user._id.toString(),
  });
};
