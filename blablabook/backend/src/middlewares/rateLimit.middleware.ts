import rateLimit from "express-rate-limit";

const isTest = process.env.NODE_ENV === "test";

// Limite globale : 100 requêtes par 15 minutes par IP
export const globalRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => isTest,
  message: { message: "Too many requests, please try again later." },
});

// Limite stricte pour l'authentification : 10 requêtes par 15 minutes par IP
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => isTest,
  message: { message: "Too many authentication attempts, please try again later." },
});

// Limite pour la recherche : 30 requêtes par minute par IP (protège l'API Open Library)
export const searchRateLimit = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => isTest,
  message: { message: "Too many search requests, please try again later." },
});
