import { Application, Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";
import { comparePassword, hashPassword } from "./utils/auth.ts";
import { iUser, Passwords, User } from "./db.ts";

const app = new Application();

app.use(oakCors({preflightContinue: true, optionsSuccessStatus: 200}));

const api = new Router();

api.post("/register", async (ctx) => {
    const {email, password}: {email: string, password: string} = await ctx.request.body({type: "json"}).value;

    if(!email || !password) return ctx.response.body = {error: true};

    const userExists: iUser | null = await User.findOne({email});

    if(userExists) return ctx.response.body = {error: true};

    const hashedPassword = await hashPassword(password);
    if(!hashedPassword) return;

    await User.create<iUser>({email, password: hashedPassword, token: crypto.randomUUID()});

    return ctx.response.body = {message: "Your account has been created"};
});

api.post("/login", async (ctx) => {
    const {email, password}: {email: string, password: string} = await ctx.request.body({type: "json"}).value;

    if(!email || !password) return ctx.response.body = {error: "Provide your username and password!"};

    let user: iUser | null = await User.findOne({email});

    if(!user) return ctx.response.body = {error: "User doesn't exist!"};

    const passwordCorrect = password === user.password || await comparePassword(password, user.password);

    if(!passwordCorrect) return ctx.response.body = {error: "Incorrect password!"};

    return ctx.response.body = {token: user.token};
});

api.post("/user", async (ctx) => {
    const {token}: {token: string} = await ctx.request.body({type: "json"}).value;

    const user: iUser | null = await User.findOne({token}).lean();

    if(!user) return ctx.response.body = {error: "Invalid token"};

    return ctx.response.body = {user};
});

api.post("/user/create_password", async (ctx) => {
    const {type, password, token, identifier}: {type: string, password: string, token: string, identifier: string} = await ctx.request.body({type: "json"}).value;

    console.log(await ctx.request.body({type: "json"}).value);

    if(!type || !identifier || !password || !token) return ctx.response.body = {error: true};

    const user = await User.findOne({token});

    if(!user) return ctx.response.body = {error: "Invalid token"};

    await Passwords.create({author: user.email, type, identifier, password});
    
    await user.save();

    return ctx.response.body = {message: "Password has been saved"};
});

api.post("/user/get_passwords", async (ctx) => {
    const {token}: {token: string} = await ctx.request.body({type: "json"}).value;

    const user = await User.findOne({token});

    if(!user) return ctx.response.body = {error: "Invalid token"};

    const passwords = await Passwords.find({author: user.email}).sort({createdAt: "desc"});

    return ctx.response.body = {passwords};
});

app.use(api.routes()).use(api.allowedMethods());

app.listen({port: 6004});