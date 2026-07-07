import { NextFunction, Request, Response } from "express";
import { createAgent, getAllAgents, updateAgent, deleteAgent, getAgentById } from "../services/agent.service";

interface AgentParams {
    id : string;
}

export function getAllAgentsHandler(_req: Request, res: Response, next:NextFunction): void {
     try {const agents = getAllAgents();
    res.status(200).json(agents);}

    catch(error) {
        next(error);
    }
}

export function getAgentByIdHandler(req: Request<AgentParams>, res: Response, next:NextFunction): void {
    try{const agent = getAgentById(req.params.id);
    res.status(200).json(agent);}
    catch(error) {
        next(error);
    }
}

export function createAgentHandler(req:Request,res:Response, next:NextFunction) :void {
    try {const agent = createAgent(req.body);
    res.status(201).json(agent);}
    catch(error) {
        next(error);
    }
}

export function updateAgentHandler(req:Request<AgentParams>,res:Response, next:NextFunction): void {
    try {const agent = updateAgent(req.params.id,req.body);
    res.status(200).json(agent); } 
    catch(error) {
        next(error);
    }
}

export function deleteAgentHandler(req:Request<AgentParams>,res:Response, next:NextFunction) {
    try {deleteAgent(req.params.id);
    res.status(204).send();}
    catch(error) {
        next(error);
    }
}
