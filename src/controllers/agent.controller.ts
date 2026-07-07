import { Request, Response } from "express";
import { createAgent, getAllAgents, updateAgent, deleteAgent, getAgentById } from "../services/agent.service";

interface AgentParams {
    id : string;
}

export function getAllAgentsHandler(_req: Request, res: Response): void {
    const agents = getAllAgents();
    res.status(200).json(agents);
}

export function getAgentByIdHandler(req: Request<AgentParams>, res: Response): void {
    const agent = getAgentById(req.params.id);
    res.status(200).json(agent);
}

export function createAgentHandler(req:Request,res:Response) :void {
    const agent = createAgent(req.body);
    res.status(201).json(agent);
}

export function updateAgentHandler(req:Request<AgentParams>,res:Response): void {
    const agent = updateAgent(req.params.id,req.body);
    res.status(200).json(agent); //200 because we're sending the agent back , otherwise it would be 204
}

export function deleteAgentHandler(req:Request<AgentParams>,res:Response) {
    deleteAgent(req.params.id);
    res.status(204).send();
}
