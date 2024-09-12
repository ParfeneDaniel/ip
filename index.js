const express = require("express");
const redis = require("redis");
const { RateLimiterRedis } = require("rate-limiter-flexible");

const app = express();

const client = redis.createClient();
client.connect();
client.on("connect", () => {
  console.log("Connected to Redis");
});

const limiter = new RateLimiterRedis({
  storeClient: client,
  keyPrefix: "limiter_by_ip",
  points: 5,
  duration: 60,
  blockDuration: 60,
});

app.get("/", async (req, res) => {
  try {
    const ip =
      req.headers["cf-connecting-ip"] ||
      req.headers["x-real-ip"] ||
      req.headers["x-forwarded-for"] ||
      req.socket.remoteAddress ||
      "";

    const resIP = await limiter.get(ip);

    if (resIP !== null && resIP.consumedPoints > 5) {
      const sec = Math.round(resIP.msBeforeNext / 1000) || 1;
      return res.status(429).json({ message: "To many requests", sec });
    }

    await limiter.consume(ip);

    return res.status(200).json({ message: "OK" });
  } catch (rlRejected) {
    if (rlRejected instanceof Error) {
      return res.status(500).json({ message: "Internal Server Error" });
    } else {
      const sec = Math.round(rlRejected.msBeforeNext / 1000) || 1;
      return res.status(429).json({ message: "Too Many Requests", sec });
    }
  }
});

module.exports = app;
