"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllMessagesByIdHandler = getAllMessagesByIdHandler;
exports.createConversationHandler = createConversationHandler;
exports.addMessageByIdHandler = addMessageByIdHandler;
exports.deleteConversationByIdHandler = deleteConversationByIdHandler;
const conversation_service_1 = require("../services/conversation.service");
function getAllMessagesByIdHandler(req, res) {
    const messages = (0, conversation_service_1.getAllMessagesById)(req.params.id);
    res.status(200).json(messages);
}
function createConversationHandler(req, res) {
    const conversation = (0, conversation_service_1.createConversation)(req.params.agent_id, req.body);
    res.status(201).json(conversation);
}
function addMessageByIdHandler(req, res) {
    (0, conversation_service_1.addMessageById)(req.params.id, req.body);
    res.status(200).send();
}
function deleteConversationByIdHandler(req, res) {
    (0, conversation_service_1.deleteConversationById)(req.params.id);
    res.status(204).send();
}
//# sourceMappingURL=conversation.controller.js.map