import { Agent, CreateAgentDto } from "../types/agent";

const agents : Agent[] = [];
let i="1";
export function createAgent(createAgentDto : CreateAgentDto) : Agent {
    let agent : Agent;
    agent = {
        id : i,
        name : createAgentDto.name,
        description : "",
        createdAt : new Date(),
        updatedAt : new Date()
    }

    if(createAgentDto.description) {
        agent.description = createAgentDto.description;
    }

    return agent;
}
