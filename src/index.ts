import express from "express";
import { time } from "node:console";

const app = express();

const PORT = 3000;

//middleware

app.use(express.json())

app.use((req,res,next)=> {
    console.log(`${req.method} ${req.path}`);
    next();
})

//handlers

app.get("/",(req,res)=>{
    console.log(req.method);
    console.log(req.path);
    console.log(req.headers);
    res.send("Hello from quick-agents-deploy");
});

app.get("/health", (req,res)=>{
    res.json({
        status:"ok",
        uptime:process.uptime()
    })
})

app.post("/agents",(req,res)=>{
    console.log(req.body);

    res.json({
        "message":"Agent created"
    })
})

app.listen(PORT,() => {
    console.log(`Server is running at https://localhost:${PORT}`);
});
