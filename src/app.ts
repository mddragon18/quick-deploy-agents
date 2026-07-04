import express from "express";
import { logger } from "./middleware/logger.middleware";
import healthRouter from "./routes/health.routes";

const app = express();
//middleware

app.use(logger);
app.use(express.json())


//handlers

app.use("/health",healthRouter);


export default app;
