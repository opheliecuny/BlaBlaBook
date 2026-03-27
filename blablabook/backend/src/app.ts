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

export const app = express();

app.use(cors({ origin: config.allowedOrigins, credentials: true }));

app.use(express.json());
app.use(cookieParser());

app.use(xssSanitizer);
app.use(helmetMiddleware);
app.use(globalRateLimit);

// Endpoint de santé pour Render Health Check + UptimeRobot
// Teste la connexion à la base de données Neon
app.get("/health", async (req, res) => {
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

app.use(apiRouter);

app.use(errorHandler);
