import { NotFoundError } from "../errors/NotFoundError";
import { Conversation } from "../types/conversation";
import { Message } from "../types/message";
import { getAgentById } from "./agent.service";


const conversations : Conversation[] = [];
let nextId = 1;


export function getConversationById(id:string) : Conversation {
    const conversation : Conversation | undefined = conversations.find(x => x.id===id);
    if(typeof conversation === "undefined") 
        throw new NotFoundError("Conversation not found");
    return conversation;
}

export function getAllMessagesById(id:string) : Message[] {
    const conversation = getConversationById(id);
    return conversation.messages;
}

export function createConversation(agentId:string , message : Message) : Conversation {
    getAgentById(agentId);

    let conversation : Conversation = {
        id : nextId.toString(),
        agent_id:agentId,
        messages : [message]
    }

    conversations.push(conversation);
    nextId++;
    return conversation;
}

export function addMessageById(id:string,message:Message) : void {
    const conversation : Conversation = getConversationById(id);
    conversation.messages.push(message);
}

export function deleteConversationById(id:string) : void {
    let index = conversations.findIndex(x => x.id===id);
    if(index === -1) {
        throw new NotFoundError("Conversation not found");
    }
    conversations.splice(index,1);
}