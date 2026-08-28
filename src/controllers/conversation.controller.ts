import {Request, Response} from "express";
import {createConversation,getAllMessagesById, addMessageById, deleteConversationById} from "../services/conversation.service"

interface ConversationParams {
    agent_id : string
    id : string
}

export function getAllMessagesByIdHandler(req : Request<ConversationParams> , res : Response)  {
    const messages = getAllMessagesById(req.params.id);
    res.status(200).json(messages);
}

export function createConversationHandler(req : Request<ConversationParams> , res : Response) {
    const conversation = createConversation(req.params.agent_id, req.body)
    res.status(201).json(conversation)
}

export function addMessageByIdHandler(req : Request<ConversationParams>, res : Response) {
    addMessageById(req.params.id,req.body);
    res.status(200).send()
}

export function deleteConversationByIdHandler(req : Request<ConversationParams>, res : Response) {
    deleteConversationById(req.params.id);
    res.status(204).send()
}


