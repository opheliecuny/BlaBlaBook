import cors from "cors";
import express from "express";
import { config } from "../config";
import { router as apiRouter } from "./routes/index.router";
import { xssSanitizer } from "./middlewares/xss-sanitizer.middleware";
import { helmetMiddleware } from "./middlewares/helmet.middleware";
import { globalRateLimit } from "./middlewares/rateLimit.middleware";
import { errorHandler } from "./middlewares/errorHandler";
import cookieParser from "cookie-parser";
import { prisma } from "./utils/prismaClient";
import { localeMiddleware } from "./middlewares/locale.middleware";

export const app = express();

// Requis derrière Render (proxy inverse) pour que les IPs, protocoles et
// headers (X-Forwarded-For, X-Forwarded-Proto) soient correctement lus
app.set("trust proxy", 1);

app.use(cors({ origin: config.allowedOrigins, credentials: true }));

app.use(express.json());
app.use(cookieParser());

app.use(xssSanitizer);
app.use(helmetMiddleware);
app.use(localeMiddleware); 

// Endpoint de santé pour Render Health Check + UptimeRobot
// Placé avant le rate limiting pour éviter les faux 429
// Teste la connexion à la base de données Neon
app.get("/health", async (_req, res) => {
  try {
    // Test de connexion à la base de données avec une requête simple
    await prisma.$queryRaw`SELECT 1`;

    res.status(200).json({
      status: "ok",
      db: "connected",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  } catch (_error) {
    res.status(500).json({
      status: "error",
      db: "down",
      timestamp: new Date().toISOString(),
    });
  }
});

app.use(globalRateLimit);

app.use(apiRouter);

app.use(errorHandler);
