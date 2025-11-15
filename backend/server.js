require("dotenv").config();
const express = require("express");
const cors = require("cors");

const connectDB = require("./db/index");
const boardRoutes = require("./routes/boards");

const app = express();

// connect database
connectDB();

// middleware
app.use(cors());
app.use(express.json());

// routes
app.use("/api/board", boardRoutes);

// start server
app.listen(process.env.PORT, () => {
  console.log("Server running on port " + process.env.PORT);
});
