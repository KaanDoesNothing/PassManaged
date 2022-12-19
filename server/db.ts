import mongoose from "npm:mongoose";
import { config } from "https://deno.land/x/dotenv@v3.2.0/mod.ts";

const UserSchema = new mongoose.Schema({
    email: {type: String, required: true},
    password: {type: String, required: true},
    passwords: {type: Array, required: true},
    token: {type: String, required: true}
}, {timestamps: true});

const PasswordSchema = new mongoose.Schema({
    author: {type: String, required: true},
    type: {type: String, required: true},
    identifier: {type: String, required: true},
    password: {type: String, required: true}
}, {timestamps: true})

export interface iUser {
    email: string,
    password: string,
    token: string
}

export const User = mongoose.model<iUser>("user", UserSchema);
export const Passwords = mongoose.model("password", PasswordSchema)

//@ts-ignore
await mongoose.connect(config().MONGODB, {dbName: "PassManaged"});