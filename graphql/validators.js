const HttpError = require("../utils/http-error");

const validateUserInput = ({ email, password, name }) => {
  if (!email || !email.includes("@")) {
    throw new HttpError("Invalid email.", 422);
  }

  if (!password || password.length < 6) {
    throw new HttpError("Password must be at least 6 characters long.", 422);
  }

  if (!name || name.trim().length < 2) {
    throw new HttpError("Name must be at least 2 characters long.", 422);
  }
};

const validatePostInput = ({ title, content, imageUrl }) => {
  if (!title || title.trim().length < 5) {
    throw new HttpError("Title must be at least 5 characters long.", 422);
  }

  if (!content || content.trim().length < 5) {
    throw new HttpError("Content must be at least 5 characters long.", 422);
  }

  if (!imageUrl || !imageUrl.trim()) {
    throw new HttpError("Image is required.", 422);
  }
};

module.exports = {
  validateUserInput,
  validatePostInput,
};
