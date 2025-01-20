import jwt from 'jsonwebtoken';
import Restaurant from '../../models/restaurants/restaurantAuth.model.js';
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
}

export default new restaurant();