require("dotenv").config({ quiet: true });
const dns = require("dns");

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const fileUpload = require("express-fileupload");

const authRoutes = require("./routes/auth");
const feedRoutes = require("./routes/feed");
const errorHandler = require("./middlewares/error-handler");

const MONGO_DB_URI = `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@cluster0.ixpnbhi.mongodb.net/messages?retryWrites=true&w=majority`;

const app = express();

app.use(fileUpload());

// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json
app.use("/images", express.static(path.join(__dirname, "images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE",
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/auth", authRoutes);
app.use("/feed", feedRoutes);

app.use(errorHandler);

mongoose
  .connect(MONGO_DB_URI)
  .then(() => {
    console.log("Connected!");

    app.listen(process.env.PORT);
  })
  .catch((err) => console.log({ mongooseConnectErr: err }));
