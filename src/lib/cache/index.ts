import "server-only";

import Redis from "ioredis";

const CONNECT_TIMEOUT_MS = 500;

type CacheClient = { redis: Redis; connected: Promise<boolean> };

const createCacheClient = (): CacheClient | null => {
  const url = process.env.REDIS_URL;

  if (!url) return null;

  const redis = new Redis(url, {
    lazyConnect: true,
    enableOfflineQueue: false,
    maxRetriesPerRequest: 1,
    connectTimeout: CONNECT_TIMEOUT_MS,
  });

  let reported = false;

  redis.on("error", (error: Error) => {
    if (reported) return;
    reported = true;
    console.warn(`Redis indisponível, seguindo sem cache: ${error.message}`);
  });

  return {
    redis,
    connected: redis
      .connect()
      .then(() => true)
      .catch(() => false),
  };
};

const globalForCache = globalThis as unknown as {
  cache: CacheClient | null | undefined;
};

const client =
  globalForCache.cache === undefined
    ? createCacheClient()
    : globalForCache.cache;

if (process.env.NODE_ENV !== "production") {
  globalForCache.cache = client;
}

export const cacheEnabled = client !== null;

async function readyClient(): Promise<Redis | null> {
  if (!client) return null;

  await client.connected;

  return client.redis.status === "ready" ? client.redis : null;
}

function decode<T>(raw: string): { hit: true; value: T } | { hit: false } {
  try {
    return { hit: true, value: JSON.parse(raw) as T };
  } catch {
    return { hit: false };
  }
}

export async function remember<T>(
  key: string,
  ttlSeconds: number,
  load: () => Promise<T>,
): Promise<T> {
  const redis = await readyClient();

  if (!redis) return load();

  const raw = await redis.get(key).catch(() => null);

  if (raw !== null) {
    const cached = decode<T>(raw);
    if (cached.hit) return cached.value;
  }

  const value = await load();
  const ttl = Math.max(1, Math.trunc(ttlSeconds));

  await redis.set(key, JSON.stringify(value), "EX", ttl).catch(() => null);

  return value;
}

export async function forget(...keys: string[]): Promise<void> {
  if (keys.length === 0) return;

  const redis = await readyClient();

  if (!redis) return;

  await redis.del(...keys).catch(() => 0);
}
