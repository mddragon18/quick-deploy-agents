import { Request, Response } from "express";
import { getHealthStatus } from "../services/health.service";

export function getHealth(req:Request,res:Response) {
    const health = getHealthStatus();
    res.json(health);
}

