"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const agent_controller_1 = require("../controllers/agent.controller");
const express_1 = require("express");
const agent_1 = require("../types/agent");
const message_1 = require("../types/message");
const validate_middleware_1 = require("../middleware/validate.middleware");
const conversation_controller_1 = require("../controllers/conversation.controller");
const router = (0, express_1.Router)();
router.post("/", (0, validate_middleware_1.validateBody)(agent_1.CreateAgentSchema), agent_controller_1.createAgentHandler);
router.get("/", agent_controller_1.getAllAgentsHandler);
router.get("/:id", agent_controller_1.getAgentByIdHandler);
router.patch("/:id", (0, validate_middleware_1.validateBody)(agent_1.UpdateAgentSchema), agent_controller_1.updateAgentHandler);
router.delete("/:id", agent_controller_1.deleteAgentHandler);
router.post("/:agent_id/conversation", (0, validate_middleware_1.validateBody)(message_1.MessageSchema), conversation_controller_1.createConversationHandler);
exports.default = router;
//# sourceMappingURL=agent.routes.js.map