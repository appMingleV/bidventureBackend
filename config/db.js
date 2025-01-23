import mongoose from "mongoose";

const DB_URI = process.env.DB_URI;
// ANSI escape code for red text
const red = '\x1b[31m%s\x1b[0m';

export const connectDB = async ()=>{
    try {
        const result = await mongoose.connect(DB_URI);
       
        if(result){
            console.log("connected to the database")
        }else{
            throw new Error("Problem connecting to the database");
        }
    } catch (error) {
        console.error(red,`Error: ${error.message}`)
    }
}
