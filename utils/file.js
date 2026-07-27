const fs = require("fs");
const path = require("path");
const uuid = require("uuid");

const saveFile = (file) => {
  const extension = file.name.split(".").pop();

  const fileName = `${uuid.v4()}.${extension}`;

  const filePath = path.join(__dirname, "..", "images", fileName);

  file.mv(filePath);

  return `images/${fileName}`;
};

const clearImage = (filePath) => {
  const fullPath = path.join(__dirname, "..", filePath);

  fs.unlink(fullPath, (err) => {
    if (err) {
      console.log("Deleting image failed:", err);
    }
  });
};

module.exports = {
  saveFile,
  clearImage,
};
