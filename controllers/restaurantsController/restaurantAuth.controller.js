import jwt from 'jsonwebtoken';
import Restaurant from '../../models/restaurants/restaurantAuth.model.js';
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to delete files from the server
function deleteFile(fileName) {
    if (!fileName) return;
    const filePath = path.join(__dirname, "Uploads", fileName); // Adjust path as per your upload directory
    fs.unlink(filePath, (err) => {
        if (err && err.code !== "ENOENT") {
            console.error("Error deleting file:", err);
        }
    });
}

class restaurant{
    constructor() {
        this.userNumber = {};
        this.login = this.login.bind(this);
        this.verifyOtp = this.verifyOtp.bind(this);
    }
    async login(req, res) {
        try {
            const { mobile } = req.body;
            if (!mobile) {
                return res.status(403).json({
                    status: false,
                    message: 'Please provide mobile number',
                });
            }

            // Save the mobile number with dummy OTP for now
            this.userNumber[mobile] = { otp: '1234' };

            return res.status(200).json({
                status: true,
                message: 'OTP sent successfully',
            });
        } catch (err) {
            return res.status(500).json({
                status: false,
                message: err.message,
            });
        }
    }
    async verifyOtp(req, res) {
        try{
            const {mobile,otp}=req.body;
         
            if(!mobile || !otp)return res.status(400).json({
                status: false,
                message:'please provides the all details'
            })
       
            
            if(!this.userNumber[mobile])return res.status(400).json({
                status:false,
                message:'please provide the correct mobile number'
            })
           
            if(+this.userNumber[mobile].otp!=otp)return res.status(400).json({
                status:false,
                message:'please provide the correct otp'
            })
           
            const token =jwt.sign({user:mobile}, process.env.SECRETE_KEY);
           
            const restaurantUser=await Restaurant.findOne({mobile});
            if(!restaurantUser) await Restaurant.create({mobile});
            const updateRestaurant=await Restaurant.findOneAndUpdate({mobile},{token},{ new: true });
            
            return res.status(200).json({
                status:true,
                message:'user successfully login',
                updateRestaurant,
            })
        }catch(err){
            return res.status(500).json({
                status: false,
                message: err.message,
            })
        }
    }
    // async updateRestaurant(req,res){
    //     try {
    //         const restaurantId = req.restaurantUser.id; // Extract restaurant ID from the authenticated user
    //         // console.log("---> ",req.restaurantUser)
            
    //         const restaurant = await Restaurant.findById(restaurantId);
    
    //         if (!restaurant) {
    //             return res.status(400).json({ message: "Restaurant not found!", success: false });
    //         }
    
    //         // Handle uploaded files
    //         const uploadedImages = req.files?.images
    //             ? req.files?.images.map((file) => file.filename)
    //             : [];
    //         const uploadedVideo = req.files?.video ? req.files?.video[0].filename : null;
    //         const dishPhotos = req.files?.['dishes.photo']
    //             ? req.files['dishes.photo'].map((file) => file.filename)
    //             : [];
    //         const logo = req.files?.logo ? req.files?.logo.filename : null;
    //         const coverImage = req.files?.coverImage ? req.files?.coverImage : null;
    
    //         // Update restaurant fields dynamically from req.body
    //         restaurant.set(req.body);
    
    //         // Append uploaded images and video if present
    //         if (uploadedImages.length) {
    //             restaurant.images.push(...uploadedImages);
    //         }
    //         if (uploadedVideo) {
    //             restaurant.video = uploadedVideo;
    //         }
    //         if(logo){
    //             restaurant.logo = logo;
    //         }
    //         if(coverImage){
    //             restaurant.coverImage = coverImage;
    //         }
    
    //         // Handle `dishes` update if provided in req.body
    //         if (req.body.dishes) {
    //             const dishesData = JSON.parse(req.body.dishes); // Parse the `dishes` JSON string
    //             if (Array.isArray(dishesData)) {
    //                 dishesData.forEach((dish, index) => {
    //                     if (dishPhotos[index]) {
    //                         dish.photo = dishPhotos[index]; // Add corresponding photo to each dish
    //                     }
    //                 });
    //                 restaurant.dishes = dishesData; // Replace existing dishes array
    //             } else {
    //                 return res.status(400).json({ message: "Invalid dishes format", success: false });
    //             }
    //         }
    
    //         const updatedRestaurantProfile = await restaurant.save();
    
    //         if (!updatedRestaurantProfile) {
    //             return res.status(400).json({
    //                 message: "Unable to update the profile",
    //                 success: false,
    //             });
    //         }
    
    //         res.status(200).json({
    //             message: "Restaurant Profile has been updated",
    //             success: true,
    //             updatedRestaurantProfile,
    //         });
    //     } catch (error) {
    //         return res.status(500).json({
    //             status: false,
    //             message: error.message,
    //         });
    //     }
    // }

    async updateRestaurant(req, res) {
    try {
        const restaurantId = req.restaurantUser.id; // Extract restaurant ID from the authenticated user
        const restaurant = await Restaurant.findById(restaurantId);

        if (!restaurant) {
            return res.status(400).json({ message: "Restaurant not found!", success: false });
        }

        // Store previous file references
        const previousImages = [...restaurant.images];
        const previousVideo = restaurant.video;
        const previousLogo = restaurant.logo;
        const previousCoverImage = restaurant.coverImage;

        // Handle uploaded files
        const uploadedImages = req.files?.images
            ? req.files.images.map((file) => file.filename)
            : [];
        const uploadedVideo = req.files?.video ? req.files.video[0].filename : null;
        const dishPhotos = req.files?.["dishes.photo"]
            ? req.files["dishes.photo"].map((file) => file.filename)
            : [];
            console.log("files -> ", req.files)
        const logo = req.files?.logo ? req.files.logo.filename : null;
        const coverImage = req.files?.coverImage ? req.files.coverImage.filename : null;

        // Update restaurant fields dynamically from req.body
        restaurant.set(req.body);
        console.log("Updating restaurant profile ->  ",req.body);

        // Delete old images if new ones are uploaded
        if (uploadedImages.length) {
            previousImages.forEach(deleteFile); // Delete old images
            restaurant.images = uploadedImages;
        }

        // Delete old video if a new one is uploaded
        if (uploadedVideo) {
            deleteFile(previousVideo);
            restaurant.video = uploadedVideo;
        }

        // Delete old logo if a new one is uploaded
        if (logo) {
            deleteFile(previousLogo);
            restaurant.logo = logo;
        }

        // Delete old cover image if a new one is uploaded
        if (coverImage) {
            deleteFile(previousCoverImage);
            restaurant.coverImage = coverImage;
        }

        // Handle `dishes` update if provided in req.body
        if (req.body.dishes) {
            const dishesData = JSON.parse(req.body.dishes); // Parse the `dishes` JSON string
            if (Array.isArray(dishesData)) {
                dishesData.forEach((dish, index) => {
                    if (dishPhotos[index]) {
                        dish.photo = dishPhotos[index]; // Add corresponding photo to each dish
                    }
                });
                restaurant.dishes = dishesData; // Replace existing dishes array
            } else {
                return res.status(400).json({ message: "Invalid dishes format", success: false });
            }
        }

        const updatedRestaurantProfile = await restaurant.save();

        if (!updatedRestaurantProfile) {
            return res.status(400).json({
                message: "Unable to update the profile",
                success: false,
            });
        }

        res.status(200).json({
            message: "Restaurant Profile has been updated",
            success: true,
            updatedRestaurantProfile,
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message,
        });
    }
}

    async getAllRestaurants(req,res){
        try {
            const restaurant = await Restaurant.find();

            res.status(200).json({
                message: restaurant.length ? "Restaurant details fetched successfully" : "No restaurants found",
                success: restaurant.length ? true : false,
                data: restaurant.length ? restaurant : null
            })

        } catch (error) {
            return res.status(500).json({
                status: false,
                message: error.message,
            });
        }
    }

    async getSingleRestaurant(req,res){
        try {
            let restaurantId;

            if(req.query.id){
                restaurantId = req.query.id;
            }
            if(req.restaurantUser){
                restaurantId = req.restaurantUser.id;
            }
            if(req.admin){
                restaurantId = req.query.id;
            }
            // console.log("restaurant -> ",req.restaurantUser.id)

            const restaurant = await Restaurant.findById(restaurantId);

            res.status(200).json({
                message: restaurant ? "Restaurant details fetched successfully" : "No restaurants found",
                success: restaurant ? true : false,
                data: restaurant ? restaurant : null
            })

        } catch (error) {
            return res.status(500).json({
                status: false,
                message: error.message,
            });
        }
    }
}

export default new restaurant();