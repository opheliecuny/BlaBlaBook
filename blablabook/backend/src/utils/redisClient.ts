import Redis from "ioredis";

const REDIS_URL = process.env.REDIS_URL;

// Si REDIS_URL n'est pas défini (dev sans Redis), on crée un client null
// qui laisse toutes les opérations échouer silencieusement
let redis: Redis | null = null;

if (REDIS_URL) {
  redis = new Redis(REDIS_URL, {
    maxRetriesPerRequest: 3, // Limite les tentatives de reconnexion pour éviter les délais d'attente prolongés
    tls: {}, // Active TLS si REDIS_URL commence par rediss://
    connectTimeout: 10_000, // Timeout de connexion de 10 secondes
    enableOfflineQueue: true, // IMPORTANT : permet au middleware d'attendre la connexion avant de faire des requêtes
  });

  redis.on("error", (err) => {
    console.error("[Redis] Connection error:", err.message);
  });

  redis.on("connect", () => {
    console.log("[Redis] Connected");
  });
}

/**
 * Récupère une valeur du cache. Retourne null si Redis est indisponible ou si la clé n'existe pas.
 */
export async function cacheGet(key: string): Promise<string | null> {
  if (!redis) return null;
  try {
    return await redis.get(key);
  } catch {
    return null;
  }
}

/**
 * Stocke une valeur dans le cache avec un TTL en secondes.
 * Échoue silencieusement si Redis est indisponible.
 */
export async function cacheSet(
  key: string,
  value: string,
  ttlSeconds: number,
): Promise<void> {
  if (!redis) return;
  try {
    await redis.setex(key, ttlSeconds, value);
  } catch {
    // Redis indisponible — on continue sans cache
  }
}

export { redis };
