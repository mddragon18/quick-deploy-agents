import { config } from "dotenv";
config();
const req : string[] = []; //will add when needed
export function validateRequired() {
    for(let i=0; i<req.length; i++) {
        if (req[i] in process.env) {
            if(typeof process.env[req[i]] === "undefined")
                throw new Error(`${req[i]} is not set`);
        }
        else {
            throw new Error(`${req[i]} is not in env`);
        }
    }
}

export const PORT = Number(process.env.PORT) || 3000;

