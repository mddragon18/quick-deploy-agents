import { UserResponse, UserRegisterDto, UserLoginDto } from "../types/user";
import argon2, { argon2id } from "argon2";
import { pool } from "../db";
import { ConflictError } from "../errors/ConflictError";
import { InvalidCredentialsError } from "../errors/InvalidCredentialsError";
import { NotFoundError } from "../errors/NotFoundError";
// (alias) type UserRegisterDto = {
//  name: string;
//  email: string;
//  password: string;
// 
// const UserSchema = z.object({
//     id : z.uuid(),
//     name : z.string().min(2).max(25),
//     email : z.email(),
//     password : z.string(),
//     createdAt : z.date(),
//     updatedAt : z.date()
// })

export async function registerUser(userRegisterDto: UserRegisterDto): Promise<UserResponse> {

    const hash = await argon2.hash(userRegisterDto.password, {
        type: argon2id,
        memoryCost: 2 ** 16,
        timeCost: 3,
        parallelism: 1
    })
    try
    {
        const { rows } = await pool.query(`
        INSERT into users (name,email,password) values ($1,$2,$3) 
        returning id,name,email,created_at as "createdAt",updated_at as "updatedAt";
        `, [userRegisterDto.name, userRegisterDto.email.toLowerCase().trim(), hash]);

        return rows[0];
    }
    catch(error : any) {
        if(error.code === '23505')
            throw new ConflictError("Email already registered") 
        throw error;
    }
}

export async function loginUser(dto : UserLoginDto) : Promise<UserResponse> {
        const {rows} = await pool.query(`
            Select id,name,email,password,created_at as "createdAt",updated_at as "updatedAt" from users where email=$1; 
            `,[dto.email.toLowerCase().trim()]);
        if(!rows.length) {
            throw new InvalidCredentialsError("Invalid Credentials")
        }
        const valid : boolean = await argon2.verify(rows[0].password,dto.password);
        if(!valid) {
            throw new InvalidCredentialsError("Invalid Credentials")
        }
        const response : UserResponse = {
            id : rows[0].id,
            name : rows[0].name,
            email : rows[0].email,
            createdAt : rows[0].createdAt,
            updatedAt : rows[0].updatedAt
        } 
        return response;
}

export async function getUserById(id : string) : Promise<UserResponse> {
    const {rows} = await pool.query(`
            Select id,name,email,created_at as "createdAt",updated_at as "updatedAt" from users where id=$1; 
            `,[id]);
    if(!rows.length) throw new NotFoundError("User not found");
    return rows[0];
}
