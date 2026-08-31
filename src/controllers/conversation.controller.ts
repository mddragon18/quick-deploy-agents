import {Request, Response} from "express";
import {createConversation,getAllMessagesById, addMessageById, deleteConversationById} from "../services/conversation.service"

interface ConversationParams {
    agentId : string
    id : string
}

export async function getAllMessagesByIdHandler(req : Request<ConversationParams> , res : Response)  {
    const messages = await getAllMessagesById(req.params.id);
    res.status(200).json(messages);
}

export async function createConversationHandler(req : Request<ConversationParams> , res : Response) {
    const conversation = await createConversation(req.params.agentId, req.body)
    res.status(201).json(conversation)
}

export async function addMessageByIdHandler(req : Request<ConversationParams>, res : Response) {
    await addMessageById(req.params.id,req.body);
    res.status(200).send()
}

export async function deleteConversationByIdHandler(req : Request<ConversationParams>, res : Response) {
    await deleteConversationById(req.params.id);
    res.status(204).send()
}


