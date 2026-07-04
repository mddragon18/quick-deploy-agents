import express from "express";
import healthRouter from "./routes/health.routes";

const app = express();



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

app.use("/health",healthRouter);

app.post("/agents",(req,res)=>{
    console.log(req.body);

    res.json({
        "message":"Agent created"
    })
})


export default app;
