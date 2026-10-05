import { config } from "dotenv";
import {z} from "zod";
config();


const envSchema = z.object({
    PORT : z.coerce.number().int().positive(),
    DB_URL : z.url()
})

export const env = envSchema.parse(process.env);
