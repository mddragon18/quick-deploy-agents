"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllAgentsHandler = getAllAgentsHandler;
exports.getAgentByIdHandler = getAgentByIdHandler;
exports.createAgentHandler = createAgentHandler;
exports.updateAgentHandler = updateAgentHandler;
exports.deleteAgentHandler = deleteAgentHandler;
const agent_service_1 = require("../services/agent.service");
async function getAllAgentsHandler(_req, res) {
    const agents = await (0, agent_service_1.getAllAgents)();
    res.status(200).json(agents);
}
async function getAgentByIdHandler(req, res) {
    const agent = await (0, agent_service_1.getAgentById)(req.params.id);
    res.status(200).json(agent);
}
async function createAgentHandler(req, res) {
    const agent = await (0, agent_service_1.createAgent)(req.body);
    res.status(201).json(agent);
}
async function updateAgentHandler(req, res) {
    const agent = await (0, agent_service_1.updateAgent)(req.params.id, req.body);
    res.status(200).json(agent); //200 because we're sending the agent back , otherwise it would be 204
}
async function deleteAgentHandler(req, res) {
    await (0, agent_service_1.deleteAgent)(req.params.id);
    res.status(204).send();
}
//# sourceMappingURL=agent.controller.js.map