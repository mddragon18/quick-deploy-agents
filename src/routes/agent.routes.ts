import { getAllAgentsHandler,getAgentByIdHandler,deleteAgentHandler,createAgentHandler,updateAgentHandler
 } from "../controllers/agent.controller";
import {Router} from "express";
import { CreateAgentSchema,UpdateAgentSchema } from "../types/agent";
import { CreateMessageSchema } from "../types/message";
import { validateBody } from "../middleware/validate.middleware";
import { createConversationHandler } from "../controllers/conversation.controller";

const router = Router();

router.post("/", validateBody(CreateAgentSchema) ,createAgentHandler);
router.get("/",getAllAgentsHandler);

router.get("/:id",getAgentByIdHandler);
router.patch("/:id", validateBody(UpdateAgentSchema) ,updateAgentHandler)
router.delete("/:id",deleteAgentHandler);

router.post("/:agentId/conversation", validateBody(CreateMessageSchema) ,createConversationHandler)

export default router;

