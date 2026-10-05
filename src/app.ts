import express from "express";
import { logger } from "./middleware/logger.middleware";
import healthRouter from "./routes/health.routes";
import agentRouter from "./routes/agent.routes";
import conversationRouter from "./routes/conversation.routes"
import authRouter from "./routes/auth.routes"
import { errorHandler } from "./middleware/error.middleware";
import { pool } from "./db";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";

const app = express();
//middleware

app.use(logger);
app.use(express.json());

// Catch malformed JSON syntax errors thrown by express.json()
app.use((err: any, req: any, res: any, next: any) => {
  if (err instanceof SyntaxError && 'body' in err) {
    return res.status(400).json({ error: "Malformed JSON payload in request body" });
  }
  next(err);
});

const pgSession = connectPgSimple(session);

app.use(session({
  store: new pgSession({
    pool:pool,
    tableName:'session'
  }),
  secret:'dev-secret',
  resave:false,
  saveUninitialized:false,
  cookie : {
    maxAge : 1000 * 60 * 60 * 24 * 2,
    sameSite : "lax",
    httpOnly : true
  }
}));

//handlers

app.use("/health",healthRouter);
app.use("/agents",agentRouter);
app.use("/conversations",conversationRouter)
app.use("/auth",authRouter)

app.use(errorHandler);
export default app;
