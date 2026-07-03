import express from "express";

const app = express();

const PORT = 3000;

app.get("/",(req,res)=>{
    res.send("Hello from quick-agents-deploy");
});

app.listen(PORT,() => {
    console.log(`Server is running at https://localhost:${PORT}`);
});
