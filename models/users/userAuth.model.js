import mongoose, { modelNames } from "mongoose";

const userSchema=new mongoose.Schema({
    mobile:{
        type:Number,
        required:[true,"mobile number is required"],
        unique:true,
        validate:[/^[0-9]{10}$/,"mobile number is not valid"]
    },
    name:{
        type:String,
    },
    email:{
        type:String,
        unique:true,
        sparse:true,
        validate:[/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email address"]
    },
    address:{
         type:String,
    },
    otp:{
        type:Number,
    },
    token:{
        type:String,
    }
})

const User=mongoose.model("User",userSchema);

export default User;