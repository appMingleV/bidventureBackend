import mongoose from "mongoose";

const restaurantSchema=new mongoose.Schema({
    mobile:{
        type:Number,
        required:[true,"mobile number is required"],
        unique:true,
        validate:[/^[0-9]{10}$/,"mobile number is not valid"]
    },
    restaurantName:{
        type:String,
    },
    ownerName:{
        type:String,
    },
    email:{
        type:String,
        unique:true,
        sparse:true,
        validate:[/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email address"]
    },
    businessTagLine:{
        type:String,
    },
    street:{
         type:String,
    },
    city:{
        type:String,
    },
    district:{
        type:String,
    },
    otp:{
        type:Number,
    },
    token:{
        type:String,
    },
    cuisineTypes:{
        type:[String]
    },
    seatingCapacity:{
        type:String
    },
    eventType:{
        type:[String]
    },
    services:{
        type:[String]
    },
    images:{
        type:[String]
    },
    video:{
        type:String
    },
    dishes:[{
        photo:{
            type:String,
        },
        dishTitle:{
            type:String,
        },
        dishDescription:{
            type:String
        },
        dishTag:{
            type:String
        },
        price:{
            type:Number
        }
    }]
})

const Restaurant=mongoose.model("Restaurant",restaurantSchema);

export default Restaurant;