import {z} from "zod";

const UserSchema = z.object({
    id : z.uuid(),
    name : z.string().min(2).max(25),
    email : z.email(),
    password : z.string(),
    createdAt : z.date(),
    updatedAt : z.date()
})

export const UserRegisterSchema = UserSchema.pick({name:true, email:true, password:true});
export const UserLoginSchema = UserSchema.pick({email:true, password:true});
const UserResponseSchema = UserSchema.omit({password:true})

export type User = z.infer<typeof UserSchema>;
export type UserRegisterDto = z.infer<typeof UserRegisterSchema>;
export type UserResponse = z.infer<typeof UserResponseSchema>;
export type UserLoginDto = z.infer<typeof UserLoginSchema>