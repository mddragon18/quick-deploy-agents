import express from "express";

const app = express();

const PORT = 3000;

//middleware


app.use((req,res,next)=> {
    console.log(`${req.method} ${req.path}`);
    next();
})

app.use(express.json())
//handlers

app.get("/",(req,res)=>{
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


export default app;
