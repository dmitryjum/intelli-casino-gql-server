import { RedisPubSub } from 'graphql-redis-subscriptions';
import Redis, { RedisOptions } from 'ioredis';

const isProduction = process.env.NODE_ENV === 'production';

// Define Redis options dynamically
const options: RedisOptions = {
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
  ...(isProduction ? { tls: {} } : {}), // Enable TLS only for AWS
  retryStrategy: (times: number) => Math.min(times * 50, 2000) // Retry strategy
};

export const pubsub = new RedisPubSub({
  publisher: new Redis(options),
  subscriber: new Redis(options),
});