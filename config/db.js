import mongoose from "mongoose";

const DB_URI = process.env.DB_URI;
// ANSI escape code for red text
const red = '\x1b[31m%s\x1b[0m';

export const connectDB = async ()=>{
    try {
        const result = await mongoose.connect("mongodb+srv://vanshdeep703:ArrXOjO0nJD3ag43@cluster0.vkwi3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
       
        if(result){
            console.log("connected to the database")
        }else{
            throw new Error("Problem connecting to the database");
        }
    } catch (error) {
        console.error(red,`Error: ${error.message}`)
    }
}
