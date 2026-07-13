import app from "./app";
import { validateRequired,PORT } from "./configs";

validateRequired();
app.listen(PORT,()=>{
    console.log(`Server Started at https://localhost:${PORT}`);
})
