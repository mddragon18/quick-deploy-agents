import { Agent, CreateAgentDto, UpdateAgentDto } from "../types/agent";
import { NotFoundError } from "../errors/NotFoundError";

const agents : Agent[] = [];
let nextId=1;


export function createAgent(createAgentDto : CreateAgentDto) : Agent {
    const date = new Date();
    const agent : Agent = {
        id : nextId.toString(),
        name : createAgentDto.name,
        description : createAgentDto.description ?? "",
        createdAt : date,
        updatedAt : date
    }

    agents.push(agent);
    nextId++;
    return agent;
}

export function getAllAgents() : Agent[] {
    return agents;
}

export function getAgentById(id : string): Agent {
    const agent : Agent | undefined = agents.find(x => x.id === id);

    if(typeof agent === "undefined") {
        throw new NotFoundError("Agent not found");
    }
    return agent;
}

export function updateAgent(id:string, updateAgentDto : UpdateAgentDto) : Agent {
    const agent : Agent = getAgentById(id);
    Object.assign(agent,updateAgentDto);
    agent.updatedAt = new Date();
    return agent
}

export function deleteAgent(id: string) : void {
    const delIndex = agents.findIndex(agent => agent.id === id);
    if(delIndex === -1) {
        throw new NotFoundError("Agent not found");
    }
    agents.splice(delIndex,1);
}
