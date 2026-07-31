const Post = require("../models/post");

const ITEMS_PER_PAGE = 2;

async function getPaginatedPosts(filter, page) {
  const totalItems = await Post.countDocuments(filter);

  const posts = await Post.find(filter)
    .populate("creator")
    .sort({ createdAt: -1 })
    .skip((page - 1) * ITEMS_PER_PAGE)
    .limit(ITEMS_PER_PAGE);

  return {
    posts,
    totalItems,
    currentPage: page,
    itemsPerPage: ITEMS_PER_PAGE,
  };
}

module.exports = {
  ITEMS_PER_PAGE,
  getPaginatedPosts,
};
