"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const logger_middleware_1 = require("./middleware/logger.middleware");
const health_routes_1 = __importDefault(require("./routes/health.routes"));
const agent_routes_1 = __importDefault(require("./routes/agent.routes"));
const conversation_routes_1 = __importDefault(require("./routes/conversation.routes"));
const error_middleware_1 = require("./middleware/error.middleware");
const app = (0, express_1.default)();
//middleware
app.use(logger_middleware_1.logger);
app.use(express_1.default.json());
app.use(express_1.default.json());
// Catch malformed JSON syntax errors thrown by express.json()
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && 'body' in err) {
        return res.status(400).json({ error: "Malformed JSON payload in request body" });
    }
    next(err);
});
//handlers
app.use("/health", health_routes_1.default);
app.use("/agents", agent_routes_1.default);
app.use("/conversations", conversation_routes_1.default);
app.use(error_middleware_1.errorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map