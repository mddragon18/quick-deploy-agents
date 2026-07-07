import express from "express";
import { logger } from "./middleware/logger.middleware";
import healthRouter from "./routes/health.routes";
import agentRouter from "./routes/agent.routes";
import { errorHandler } from "./middleware/error.middleware";

const app = express();
//middleware

app.use(logger);
app.use(express.json())


//handlers

app.use("/health",healthRouter);
app.use("/agents",agentRouter);


app.use(errorHandler);
export default app;
