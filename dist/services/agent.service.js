"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAgent = createAgent;
exports.getAllAgents = getAllAgents;
exports.getAgentById = getAgentById;
exports.updateAgent = updateAgent;
exports.deleteAgent = deleteAgent;
const NotFoundError_1 = require("../errors/NotFoundError");
const agents = [];
let nextId = 1;
function createAgent(createAgentDto) {
    const date = new Date();
    const agent = {
        id: nextId.toString(),
        name: createAgentDto.name,
        description: createAgentDto.description ?? "",
        createdAt: date,
        updatedAt: date
    };
    agents.push(agent);
    nextId++;
    return agent;
}
function getAllAgents() {
    return agents;
}
function getAgentById(id) {
    const agent = agents.find(x => x.id === id);
    if (typeof agent === "undefined") {
        throw new NotFoundError_1.NotFoundError("Agent not found");
    }
    return agent;
}
function updateAgent(id, updateAgentDto) {
    const agent = getAgentById(id);
    Object.assign(agent, updateAgentDto);
    agent.updatedAt = new Date();
    return agent;
}
function deleteAgent(id) {
    const delIndex = agents.findIndex(agent => agent.id === id);
    if (delIndex === -1) {
        throw new NotFoundError_1.NotFoundError("Agent not Found");
    }
    agents.splice(delIndex, 1);
}
//# sourceMappingURL=agent.service.js.map