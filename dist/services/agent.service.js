"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAgent = createAgent;
exports.getAllAgents = getAllAgents;
exports.getAgentById = getAgentById;
exports.updateAgent = updateAgent;
exports.deleteAgent = deleteAgent;
const db_1 = require("../db");
const agents = [];
let nextId = 1;
async function createAgent(createAgentDto) {
    const { rows } = await db_1.pool.query(`INSERT INTO agents (name,description) values($1,$2)
        RETURNING id , name , description , created_at AS "createdAt" , updated_at AS "updatedAt"`, [createAgentDto.name, createAgentDto.description || null]);
    return rows[0];
}
async function getAllAgents() {
    const { rows } = await db_1.pool.query(`SELECT * FROM agents`);
    return rows;
}
async function getAgentById(id) {
    const { rows } = await db_1.pool.query(`SELECT * FROM agents where id=$1`, [id]);
    return rows[0];
}
async function updateAgent(id, updateAgentDto) {
    const { rows } = await db_1.pool.query(`UPDATE agents SET name=$1,description=$2 where id=$3
        returning id, name , description, created_at AS "createdAt" , updated_at AS "updatedAt"
        `, [updateAgentDto.name || null, updateAgentDto.description || null, id]);
    return rows[0];
}
async function deleteAgent(id) {
    await db_1.pool.query(`DELETE from agents where id=$1`, [id]);
}
//# sourceMappingURL=agent.service.js.map