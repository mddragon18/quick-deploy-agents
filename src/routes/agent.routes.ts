import { getAllAgentsHandler,getAgentByIdHandler,deleteAgentHandler,createAgentHandler,updateAgentHandler
 } from "../controllers/agent.controller";
import {Router} from "express";

const router = Router();

router.post("/", createAgentHandler);
router.patch("/:id",updateAgentHandler)
router.get("/",getAllAgentsHandler);
router.get("/:id",getAgentByIdHandler);
router.delete("/:id",deleteAgentHandler);

export default router;

