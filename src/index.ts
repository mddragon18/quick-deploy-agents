import app from "./app";
import {env} from "./configs/index"


app.listen(env.PORT,()=>{
    console.log(`Server Started at https://localhost:${env.PORT}`);
})
