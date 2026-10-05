import { Request, Response, NextFunction } from "express";
import { AuthRequiredError } from "../errors/AuthRequiredError";

export function requireAuth(req: Request, res : Response, next : NextFunction) {
    if(req.session.userId===undefined) 
        throw new AuthRequiredError()
    next()
}