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

module.exports = saveFile;
