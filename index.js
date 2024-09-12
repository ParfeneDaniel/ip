const express = require("express");

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  try {
    const IP = req.socket.remoteAddress;
    return res.status(200).json({ IP });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = app;
