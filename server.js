import express from 'express';
import { configDotenv } from 'dotenv';
import {connectDB} from './config/db.js'
import routes from './routes/index.js';
connectDB()
configDotenv();
const app=express();
app.use(express.json());
app.use('/api',routes);

app.listen(process.env.PORT,(err)=>{
    if(err){
        console.error(err);
    }
    console.log(`Server running on port ${process.env.PORT}`);
})
