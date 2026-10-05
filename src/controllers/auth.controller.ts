import { Request, Response } from "express"
import { registerUser, loginUser, getUserById } from "../services/auth.service"
import { UserResponse } from "../types/user"
import { NotFoundError } from "../errors/NotFoundError";

export async function registerUserHandler(req: Request, res: Response): Promise<void> {
    const user = await registerUser(req.body);
    res.status(201).json(user);
}

export async function loginUserHandler(req: Request, res: Response): Promise<void> {
    const user = await loginUser(req.body)
    req.session.regenerate(() => {
        req.session.userId = user.id;
        res.status(200).json(user);
    })
}

export async function logoutUserHanlder(req: Request, res: Response): Promise<void> {
    req.session.destroy(() => {
        res.clearCookie("connect.sid");
        res.status(204).end()
    })
}

export async function getUserByIdHandler(req: Request, res: Response): Promise<void> {
    try
    {
        const user = await getUserById(req.session.userId!);
        res.status(200).json(user);
    }
    catch(err) {
        if(err instanceof NotFoundError) {
            req.session.destroy(() => {
                res.clearCookie("connect.sid")
                res.status(401).send();
            })
            return
        }
        throw err;
    }
}