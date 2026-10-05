import { Agent, CreateAgentDto, UpdateAgentDto } from "../types/agent";
import { NotFoundError } from "../errors/NotFoundError";
import { pool } from "../db";

const agents : Agent[] = [];
let nextId=1;


export async function createAgent(createAgentDto : CreateAgentDto) : Promise<Agent> {
    const {rows} = await pool.query(
        `INSERT INTO agents (name,description) values($1,$2)
        RETURNING id , name , description , created_at AS "createdAt" , updated_at AS "updatedAt"`,
        [createAgentDto.name,createAgentDto.description || ""] 
    );
    
    return rows[0];
}

export async function getAllAgents() : Promise<Agent[]> {
    const {rows} = await pool.query(
        `SELECT id,name,description,created_at AS "createdAt",updated_at AS "updatedAt" FROM agents`
    );
    return rows;
}

export async function getAgentById(id : string): Promise<Agent> {
    const {rows} = await pool.query(
        `SELECT id,name,description,created_at AS "createdAt",updated_at AS "updatedAt" FROM agents where id=$1`,
        [id]
    );
    if(!rows.length) throw new NotFoundError("Agent not found");
    return rows[0];

}

export async function updateAgent(id:string, updateAgentDto : UpdateAgentDto) : Promise<Agent> {
    await getAgentById(id);
    const setClauses : string[] = [];
    const values : any[] = [];

    for(const [key,value] of Object.entries(updateAgentDto)) {
        if (value != undefined) {
            values.push(value);
            setClauses.push(`${key}=$${values.length}`)
        }   
    }

    if(setClauses.length==0) return await getAgentById(id);

    setClauses.push(`updated_at = NOW()`);
    values.push(id);
    const idIndex = values.length;

    const query = `
    UPDATE agents SET ${setClauses.join(', ')} where id=$${idIndex}
    returning id, name, description, created_at AS "createdAt" , updated_at AS "updatedAt"
    `;
    const {rows} = await pool.query(query,values);
    return rows[0];
}

export async function deleteAgent(id: string) : Promise<void> {
    await getAgentById(id);
    await pool.query(
        `DELETE from agents where id=$1`,
        [id]
    );
}
