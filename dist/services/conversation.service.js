"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConversationById = getConversationById;
exports.getAllMessagesById = getAllMessagesById;
exports.createConversation = createConversation;
exports.addMessageById = addMessageById;
exports.deleteConversationById = deleteConversationById;
const NotFoundError_1 = require("../errors/NotFoundError");
const agent_service_1 = require("./agent.service");
const conversations = [];
let nextId = 1;
function getConversationById(id) {
    const conversation = conversations.find(x => x.id === id);
    if (typeof conversation === "undefined")
        throw new NotFoundError_1.NotFoundError("Conversation not found");
    return conversation;
}
function getAllMessagesById(id) {
    const conversation = getConversationById(id);
    return conversation.messages;
}
function createConversation(agentId, message) {
    (0, agent_service_1.getAgentById)(agentId);
    let conversation = {
        id: nextId.toString(),
        agent_id: agentId,
        messages: [message]
    };
    conversations.push(conversation);
    nextId++;
    return conversation;
}
function addMessageById(id, message) {
    const conversation = getConversationById(id);
    conversation.messages.push(message);
}
function deleteConversationById(id) {
    let index = conversations.findIndex(x => x.id === id);
    if (index === -1) {
        throw new NotFoundError_1.NotFoundError("Conversation not found");
    }
    conversations.splice(index, 1);
}
//# sourceMappingURL=conversation.service.js.map