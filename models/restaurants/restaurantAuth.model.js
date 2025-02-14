import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema({
    mobile: {
        type: Number,
        required: [true, "Mobile number is required"],
        unique: true,
        validate: {
            validator: (value) => /^[0-9]{10}$/.test(value),
            message: "Mobile number is not valid",
        },
    },
    restaurantName: {
        type: String,
        required: false,
        minlength: [3, "Restaurant name must be at least 3 characters long"],
        maxlength: [100, "Restaurant name cannot exceed 100 characters"],
    },
    ownerName: {
        type: String,
        required: false,
        minlength: [3, "Owner name must be at least 3 characters long"],
        maxlength: [100, "Owner name cannot exceed 100 characters"],
    },
    email: {
        type: String,
        unique: true,
        sparse: true,
        validate: {
            validator: (value) =>
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value),
            message: "Please enter a valid email address",
        },
    },
    businessTagLine: {
        type: String,
        required: false,
        maxlength: [200, "Business tagline cannot exceed 200 characters"],
    },
    street: {
        type: String,
        required: false,
        maxlength: [150, "Street address cannot exceed 150 characters"],
    },
    city: {
        type: String,
        required: false,
        maxlength: [50, "City name cannot exceed 50 characters"],
    },
    district: {
        type: String,
        required: false,
        maxlength: [50, "District name cannot exceed 50 characters"],
    },
    otp: {
        type: Number,
        min: [1000, "OTP must be at least 4 digits"],
        max: [9999, "OTP cannot exceed 4 digits"],
    },
    token: {
        type: String,
        required: false,
    },
    cuisineTypes: {
        type: [String], // Allows an empty array by default
        default: [], // Default value is an empty array
    },
    seatingCapacity: {
        type: String,
        required: false,
    },
    eventType: {
        type: [String],
        required: false,
    },
    services: {
        type: [String],
        required: false,
    },
    images: {
        type: [String], // Stores filenames of images
        required: false,
        validate: {
            validator: (value) =>
                Array.isArray(value) &&
                value.every((filename) => /^[a-zA-Z0-9-_]+\.(jpg|jpeg|png|gif)$/.test(filename)),
            message: "Images must be valid filenames with extensions: .jpg, .jpeg, .png, or .gif",
        },
    },
    video: {
        type: String, // Stores filename of a video
        required: false,
        validate: {
            validator: (filename) =>
                /^[a-zA-Z0-9-_]+\.(mp4|mov|avi|mkv)$/.test(filename),
            message: "Video must be a valid filename with extensions: .mp4, .mov, .avi, or .mkv",
        },
    },
    dishes: [
        {
            photo: {
                type: String, // Stores filename of dish photo
                required: false,
                validate: {
                    validator: (filename) =>
                        /^[a-zA-Z0-9-_]+\.(jpg|jpeg|png|gif)$/.test(filename),
                    message: "Dish photo must be a valid filename with extensions: .jpg, .jpeg, .png, or .gif",
                },
            },
            dishTitle: {
                type: String,
                required: false,
                maxlength: [50, "Dish title cannot exceed 50 characters"],
            },
            dishDescription: {
                type: String,
                required: false,
                maxlength: [200, "Dish description cannot exceed 200 characters"],
            },
            dishTag: {
                type: String,
                required: false,
                maxlength: [50, "Dish tag cannot exceed 50 characters"],
            },
            price: {
                type: Number,
                required: false,
                min: [0, "Price must be at least 0"], // Allows free dishes
                max: [100000, "Price cannot exceed 100,000"],
            },
        },
    ],
    socialLinks: {
        type: [String], // Array of strings for storing social media links
        validate: {
            validator: (value) => 
                Array.isArray(value) &&
                value.every((link) =>
                    /^(https?:\/\/)?([\w-]+)+([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/.test(link)
                ),
            message: "Each social link must be a valid URL",
        },
        required: false, // Social links are optional
        default: [], // Default to an empty array
    },
    logo:{
        type:String,
        required:false
    },
    coverImage:{
        type:String,
        required:false
    }    
});

// Create the model
const Restaurant = mongoose.model("Restaurant", restaurantSchema);

export default Restaurant;