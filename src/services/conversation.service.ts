import { NotFoundError } from "../errors/NotFoundError";
import { Conversation } from "../types/conversation";
import { Message, CreateMessageDto } from "../types/message";
import { getAgentById } from "./agent.service";
import {pool} from "../db/index";


export async function getConversationById(id:string) : Promise<Conversation> {
    const {rows} = await pool.query(`
        SELECT id,agent_id as "agentId",created_at AS "createdAt",updated_at AS "updatedAt" from conversations where id=$1;
        `, [id]);
    if(!rows.length) throw new NotFoundError("Conversation not found");
    return rows[0];
}

export async function getAllMessagesById(id:string) : Promise<Message[]> {
    await getConversationById(id);

    const {rows} = await pool.query(`
        SELECT id,conversation_id as "conversationId",sender as "from",content,created_at AS "createdAt",updated_at AS "updatedAt" from messages where conversation_id=$1 order by created_at ASC;
        `, [id]);

    return rows;

}

export async function createConversation(agentId:string , message : CreateMessageDto) : Promise<Conversation> {
    await getAgentById(agentId);

    const client = await pool.connect();

    try {
        await client.query("BEGIN;");

        const newConv = await client.query(`
            INSERT INTO conversations (agent_id) values($1)
            returning id,agent_id as "agentId",created_at AS "createdAt",updated_at AS "updatedAt";
            `,[agentId]);
        
        await client.query(`
            INSERT INTO messages (conversation_id,sender,content) values($1,$2,$3);
            `, [newConv.rows[0].id, message.from, message.content]);

        await client.query("COMMIT;");
        return newConv.rows[0];
    }
    catch(error) {
        try {
            await client.query("ROLLBACK;");
        }
        catch(rollbackError) {
            console.error("Rollback failed:", rollbackError)
        }
        throw error;
    }
    finally {
        client.release();
    }
    
}

export async function addMessageById(id:string,message:CreateMessageDto) : Promise<void> {
    const conversation = await getConversationById(id);
    await pool.query(`
        INSERT INTO messages (conversation_id,sender,content) values($1,$2,$3);
        `, [conversation.id,message.from,message.content])
}

export async function deleteConversationById(id:string) : Promise<void> {
    const { rowCount } = await pool.query(
        `DELETE FROM conversations WHERE id = $1;`,
        [id]
    );
    if (rowCount === 0) throw new NotFoundError("Conversation not found");
}