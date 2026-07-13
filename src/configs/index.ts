import { config } from "dotenv";

const vars : string[] = [];

export function validateRequired() {
    const envPairs = Object.entries(process.env);
    for(let i=0; i<vars.length; i++) {
        let value = vars[i];
        
    }
}
