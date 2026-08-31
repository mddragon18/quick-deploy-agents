"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const conversation_controller_1 = require("../controllers/conversation.controller");
const validate_middleware_1 = require("../middleware/validate.middleware");
const message_1 = require("../types/message");
const router = (0, express_1.Router)();
router.get("/:id", conversation_controller_1.getAllMessagesByIdHandler);
router.post("/:id/messages", (0, validate_middleware_1.validateBody)(message_1.MessageSchema), conversation_controller_1.addMessageByIdHandler);
router.delete("/:id", conversation_controller_1.deleteConversationByIdHandler);
exports.default = router;
//# sourceMappingURL=conversation.routes.js.map