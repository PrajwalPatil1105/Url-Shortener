const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const connectDB = require("./config/db.js");
const dotenv = require("dotenv");
const linkRouter = require("./Route/linkRoutes.js");
const authRoutes = require("./Route/authRoutes.js");

app.set("trust proxy", true);
app.set("trust proxy", ["loopback", "linklocal", "uniquelocal"]);

dotenv.config();
app.use(express.json());
app.use(cors({ origin: "*" }));

app.set("view engine", "ejs");
app.set("views", "./views");

connectDB();

app.use("/url", linkRouter);
app.use("/auth", authRoutes);

app.listen(4000, () => {
  console.log("Server started on port 4000");
});
