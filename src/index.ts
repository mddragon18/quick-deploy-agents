import express from "express";

const app = express();

const PORT = 3000;

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


app.listen(PORT,() => {
    console.log(`Server is running at https://localhost:${PORT}`);
});
