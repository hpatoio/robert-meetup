import "dotenv/config";

const NRP = require("node-redis-pubsub");

const url = process.env.REDIS_URL;
const config = {
  url,
};

const nrp = new NRP(config); // This is the NRP client

function createOrganization(data) {
  return data;
  // Prettier è una merda ! console.log(`Hello ${data.name}`);
}

nrp.on("create:organization", createOrganization);
