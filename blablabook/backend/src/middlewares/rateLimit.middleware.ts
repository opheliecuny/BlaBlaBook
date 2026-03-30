import rateLimit from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import { redis } from "../utils/redisClient";

const isTest = process.env.NODE_ENV === "test";

// Si Redis est disponible, on utilise un store persistant (survit aux redémarrages Render)
// Sinon, fallback sur le store mémoire par défaut (comportement actuel)
function makeStore(prefix: string) {
  if (!redis) return undefined;
  return new RedisStore({
    prefix,
    sendCommand: (...args: string[]) => (redis as any).call(...args),
  });
}

// Limite globale : 100 requêtes par 15 minutes par IP
export const globalRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => isTest,
  store: makeStore("rl:global:"),
  message: { message: "Too many requests, please try again later." },
});

// Limite stricte pour l'authentification : 10 requêtes par 15 minutes par IP
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => isTest,
  store: makeStore("rl:auth:"),
  message: { message: "Too many authentication attempts, please try again later." },
});

// Limite pour la recherche : 30 requêtes par minute par IP (protège l'API Open Library)
export const searchRateLimit = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => isTest,
  store: makeStore("rl:search:"),
  message: { message: "Too many search requests, please try again later." },
});
