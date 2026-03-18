import cors from "cors"; 
import express from "express"; 
import { config } from "../config";
import { router as apiRouter } from "./routes/index.router";
import { xssSanitizer } from "./middlewares/xss-sanitizer.middleware";
import { helmetMiddlewre } from "./middlewares/helmet.middleware";
import { errorHandler } from "./middlewares/errorHandler";


export const app = express(); 

app.use(cors({ origin: config.allowedOrigins, credentials: true }));

app.use(express.json()); 

app.use(xssSanitizer);

app.use(helmetMiddlewre); 

app.use(apiRouter);

app.use(errorHandler);
