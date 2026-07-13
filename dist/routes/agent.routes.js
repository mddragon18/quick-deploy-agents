"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const agent_controller_1 = require("../controllers/agent.controller");
const express_1 = require("express");
const router = (0, express_1.Router)();
router.post("/", agent_controller_1.createAgentHandler);
router.get("/", agent_controller_1.getAllAgentsHandler);
router.get("/:id", agent_controller_1.getAgentByIdHandler);
router.patch("/:id", agent_controller_1.updateAgentHandler);
router.delete("/:id", agent_controller_1.deleteAgentHandler);
exports.default = router;
//# sourceMappingURL=agent.routes.js.map