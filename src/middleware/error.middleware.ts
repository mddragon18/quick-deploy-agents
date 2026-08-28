import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError";
import { ValidationError } from "../errors/ValidationError";

export function errorHandler(
    err:Error,
    req:Request,
    res:Response,
    next:NextFunction
) {
    if(err instanceof ValidationError) {
        return res.status(err.statusCode).json({
            message:err.message,
            required_fields:err.required_fields,
            required_types:err.required_types
        })
    }

    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            message:err.message
        });
    }

    console.error(err);

    return res.status(500).json({
        message:"Internal Server Error"
    });
}
