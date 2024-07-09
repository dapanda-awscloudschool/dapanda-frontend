import Redis from "ioredis";

const redis = new Redis({
  host: "redis.dpd-db-ns.svc.cluster.local",
  port: 6379,
  password: "dapanda123#",
});

export default redis;
