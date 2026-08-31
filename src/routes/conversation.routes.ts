import {Router} from "express";
import {getAllMessagesByIdHandler,addMessageByIdHandler,deleteConversationByIdHandler} from "../controllers/conversation.controller"
import { validateBody } from "../middleware/validate.middleware";
import { CreateMessageSchema } from "../types/message";

const router = Router()

router.get("/:id",getAllMessagesByIdHandler)

router.post("/:id/messages", validateBody(CreateMessageSchema), addMessageByIdHandler)
router.delete("/:id",deleteConversationByIdHandler)

export default router