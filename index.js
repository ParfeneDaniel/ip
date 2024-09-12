const express = require("express");
const { rateLimit } = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 5,
});

const app = express();
app.use(express.json());
app.use(limiter);

app.get("/", (req, res) => {
  try {
    const IP = req.headers["x-real-ip"];
    return res.status(200).json({ IP });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = app;
