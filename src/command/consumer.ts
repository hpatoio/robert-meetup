import "dotenv/config";

const Redis = require("ioredis");

const redis = new Redis(process.env.REDIS_URL);
const channel = "organization";

redis.subscribe(channel, (err, count) => {
  if (err) {
    console.error("Failed to subscribe: %s", err.message);
  } else {
    // `count` represents the number of channels this client are currently subscribed to.
    console.log(
      `Subscribed successfully! This client is currently subscribed to ${count} channels.`
    );
  }
});

redis.on("message", (receivingChannel, message) => {
  console.log(
    `Your favourite animal is ${message} in channle ${receivingChannel}`
  );
});
