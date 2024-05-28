const redis = require("redis");

const client = redis.createClient({
    password: "tENSphuaMI8U3jU51IUjzzln0LAB6eYU",
    socket: {
        host: "redis-17656.c1.asia-northeast1-1.gce.cloud.redislabs.com",
        port: 17656
    }
});

client.on("connect", () => {
    console.log("Client is connecting to redis...");
});

client.on("ready", () => {
    console.log("Client connected to redis and ready to use...");
});

client.on("error", (err) => {
    console.log(err.message);
});

client.on("end", () => {
    console.log("Client disconnected from redis");
});

(async () => {
    try {
        await client.connect();
    } catch (err) {
        console.error("Error while connecting redis: ", err);
    }
})();

module.exports = client;