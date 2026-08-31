import { env } from "../configs";
import {Pool} from "pg";

export const pool = new Pool({
    connectionString:env.DB_URL
})
