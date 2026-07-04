import { Agent, CreateAgentDto } from "../types/agent";

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
