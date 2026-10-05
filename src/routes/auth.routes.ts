import { Router } from "express";
import { registerUserHandler,loginUserHandler,logoutUserHanlder, getUserByIdHandler } from "../controllers/auth.controller";
import { UserRegisterSchema,UserLoginSchema } from "../types/user";
import { validateBody } from "../middleware/validate.middleware";
import { requireAuth } from "../middleware/requireAuth.middleware";

const router = Router()

router.post('/register',validateBody(UserRegisterSchema),registerUserHandler)
router.post('/login',validateBody(UserLoginSchema),loginUserHandler)
router.post('/logout',logoutUserHanlder)
router.get('/me',requireAuth,getUserByIdHandler)

export default router;