import { Request, Response } from "express";
import { createAgent, getAllAgents, updateAgent, deleteAgent, getAgentById } from "../services/agent.service";

interface AgentParams {
    id : string;
}

export async function getAllAgentsHandler(_req: Request, res: Response): Promise<void> {
    const agents = await getAllAgents();
    res.status(200).json(agents);
}

export async function getAgentByIdHandler(req: Request<AgentParams>, res: Response): Promise<void> {
    const agent = await getAgentById(req.params.id);
    res.status(200).json(agent);
}

export async function createAgentHandler(req:Request,res:Response) : Promise<void> {
    const agent = await createAgent(req.body);
    res.status(201).json(agent);
}

export async function updateAgentHandler(req:Request<AgentParams>,res:Response): Promise<void> {
    const agent = await updateAgent(req.params.id,req.body);
    res.status(200).json(agent); //200 because we're sending the agent back , otherwise it would be 204
}

export async function deleteAgentHandler(req:Request<AgentParams>,res:Response) {
    await deleteAgent(req.params.id);
    res.status(204).send();
}
