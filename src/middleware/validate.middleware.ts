import { Request, Response, NextFunction, RequestHandler } from "express";
import {z} from "zod" ;
import { fromZodError } from "zod-validation-error";

export function validateBody(schema : z.ZodType) : RequestHandler<any,any,z.ZodType> {
    return (req : Request, res : Response , next : NextFunction) => {
        
        const result = schema.safeParse(req.body);

        if(!result.success) {
            return res.status(400).json({
                error : fromZodError(result.error)
            })
        }

        req.body = result.data;
        next();
    }
}