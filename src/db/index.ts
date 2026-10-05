import { env } from "../configs";
import {Pool} from "pg";

export const pool = new Pool({
    connectionString:env.DB_URL,

    max:20,
    min:4,

    connectionTimeoutMillis:2000,
    idleTimeoutMillis:30000
})
