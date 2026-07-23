module.exports = (error, req, res, next) => {
  const status = error.statusCode || 500;

  res.status(status).json({
    message: error.message || "Something went wrong",
  });
};
