import { config } from "dotenv";

const vars : string[] = [];

export function validateRequired() {
    const envKeys = Object.keys(process.env);
    const envPairs = Object.entries(process.env);
    for(let i:number=0; i<vars.length; i++) {
        let value = vars[i];
        if(envKeys.includes(vars[i])){
            if(typeof envKeys[value])
        }
        else {
            throw new Error(`${vars[i]} is not in env.`)
        }
    }
}
