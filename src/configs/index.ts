import { config } from "dotenv";
config();
const vars : string[] = [];

export function validateRequired() {
    const envKeys = Object.keys(process.env);
    const envPairs = Object.entries(process.env);
    for(let i:number=0; i<vars.length; i++) {
        let value = vars[i];
        if(envKeys.includes(vars[i])){
            if(typeof envKeys[value] === "undefined") {
                throw new Error(`${value} is not set in the environment`)
            }
        }
        else {
            throw new Error(`${vars[i]} is not in env.`)
        }
    }
}
