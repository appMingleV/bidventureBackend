import BidForm from '../../models/users/bidForm.model.js';
import jwt from 'jsonwebtoken';
import User from '../../models/users/userAuth.model.js';
import fs from 'fs';

class UserAuthController {

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
            const otp = 1235;

            const user = await User.findOne({mobile});
            // console.log("user data -> ",user)
            if(!user){
                // console.log("new user")
                const newUser = User({
                    mobile,
                    otp
                })

                await newUser.save();
            }else{
                // console.log("old user")
                user.otp = otp;
                await user.save();
            }

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
        try {
            const { mobile, otp } = req.body;
            if (!mobile || !otp) {
                return res.status(403).json({
                    status: false,
                    message: 'Please provide mobile number and OTP',
                });
            }

            const user = await User.findOne({mobile});

            //  console.log(this.userNumber)
            if (!user) {
                return res.status(403).json({
                    status: false,
                    message: 'User not found',
                });
            }

            if (user.otp !== otp) {
                return res.status(403).json({
                    status: false,
                    message: 'Invalid OTP',
                });
            }

            const secretKey = process.env.SECRETE_KEY;
            const token = jwt.sign({ user: mobile }, secretKey);

            // const user = await userAuth.findOne({mobile});
            // console.log(user,token);
            if(!user) await userAuth.create({mobile});

            const updateUser = await User.findOneAndUpdate(
                { mobile: mobile }, // Query to find the document
                { token: token },   // Fields to update
                { new: true }       // Option to return the updated document
            );
            // console.log("user token ",updateUser,token)
            return res.status(200).json({
                status: true,
                message: 'Login successfully',
                updateUser,
            });
        } catch (err) {
            return res.status(500).json({
                status: false,
                message: err.message,
            });
        }
    }
    async bidingForm(req,res){
        try{
           const bidFormDetails={...req.body};
           const {userId}=req.params;
             
            console.log(bidFormDetails);
            if(!userId) return res.status(403).json({
                status: false,
                message: 'User ID is required',
            });
            const bidFormDetais=await BidForm.create({userId,...bidFormDetails,eventImage:req?.file?.filename});
        
            return res.status(200).json({
                status: true,
                message: 'Bid Form submitted successfully',
                bidFormDetais,
            });
        }catch(err){
            return res.status(500).json({
                status: false,
                message: err.message,
            });
        }
    }

    async profile(req,res){
    try{
        const userId = req.user.id;
        // console.log("userId --> ",userId)
        const profile = {...req.body}
        if(!userId){
            return res.status(403).json({
                status: false,
                message: 'User ID is required',
            });
        }
        
        const updatedProfile = await User.findByIdAndUpdate(userId,profile);
        if(!updatedProfile){
            return res.status(403).json({
                status: false,
                message: 'Failed to added profile',
            });
        }

         
    return res.status(200).json({
        status: true,
        message: 'User profile added successfully',
        updatedProfile,
    })
    }catch(err){
        return res.status(500).json({
            status: false,
            message: err.message,
        });
    }
    }


    async getProfile(req,res){
        try{
            const userId = req.user.id;
            if(!userId){
                return res.status(403).json({
                    status: false,
                    message: 'User ID is required',
                });
            }
            
            const userProfile = await User.findById(userId);
            if(!userProfile){
                return res.status(403).json({
                    status: false,
                    message: 'User profile not found',
                });
            }

            return res.status(200).json({
                status: true,
                message: 'User profile found successfully',
                userProfile,
            })
        }catch(err){
            return res.status(500).json({
                status: false,
                message: err.message,
            });
        }
    }

    async updateProfilePicture(req,res){
        try {
            const userId = req.user.id;

            const user = await User.findById(userId);
            const profilePicture = req.file.filename;
            if(!profilePicture){
                return res.status(400).json({message:"Profile picture not found",success:false});
            }

            if(!user){
                return res.status(400).json({message:"User Not found",success:false})
            }

            if(user.profilePicture && fs.existsSync(`Uploads/${user.profilePicture}`)){
                fs.unlinkSync(`Uploads/${user.profilePicture}`);
            }

            user.profilePicture = profilePicture;
            await user.save();

        } catch (error) {
            return res.status(500).json({
                status: false,
                message: err.message,
            });
        }
    }
}

export default new UserAuthController();
