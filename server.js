const express = require("express");

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  const ip =
    req.headers["cf-connecting-ip"] ||
    req.headers["x-real-ip"] ||
    req.headers["x-forwarded-for"] ||
    req.socket.remoteAddress ||
    "";

  return res.json({ ip });
});

app.listen(3000, () => {
  console.log("Server is running");
});
