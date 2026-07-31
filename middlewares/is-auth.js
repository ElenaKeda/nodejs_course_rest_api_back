const jwt = require("jsonwebtoken");

const HttpError = require("../utils/http-error");

module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization");

  if (!authHeader) {
    throw new HttpError("Not authenticated.", 401);
  }

  const token = authHeader.split(" ")[1];

  let decodedToken;

  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    throw new HttpError("Invalid token.", 500);
  }

  if (!decodedToken) {
    throw new HttpError("Not authenticated.", 401);
  }

  req.userId = decodedToken.userId;

  next();
};
