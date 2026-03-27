import cors from "cors";
import express from "express";
import { config } from "../config";
import { router as apiRouter } from "./routes/index.router";
import { xssSanitizer } from "./middlewares/xss-sanitizer.middleware";
import { helmetMiddlewre } from "./middlewares/helmet.middleware";
import { globalRateLimit } from "./middlewares/rateLimit.middleware";
import { errorHandler } from "./middlewares/errorHandler";
import cookieParser from "cookie-parser";

export const app = express();

app.use(cors({ origin: config.allowedOrigins, credentials: true }));

app.use(express.json());
app.use(cookieParser());

app.use(xssSanitizer);
app.use(helmetMiddlewre);
app.use(globalRateLimit);

app.use(apiRouter);

app.use(errorHandler);
