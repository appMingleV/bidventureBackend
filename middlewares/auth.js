import userAuth from "../models/users/userAuth.model.js";
import jwt from 'jsonwebtoken'
export const userAutherization=(req,res,next)=>{
    try{
        const authHeader=req.headers.authorization || req.headers?.authorization;
        if(!authHeader) return res.status(403).json({
            success:false,
            message:"Authorization header not found"
        });
        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(403).json({ msg: "Token not provided", status: false });
          }

         const secretKey = process.env.JWT_SECRET;
        
          jwt.verify(token, "dasfa123143", async(error, decoded) => {
            if (error) {
              return res.status(401).json({ msg: "Invalid or expired token", status: false });
            }
            console.log(decoded);
            const userDetails=await userAuth.findOne({mobile:decoded?.user});
      
            if(!userDetails)return res.status(400).json({ status:"failed",message:"user not found" });
        
            if(token!=userDetails.token)return res.status(400).json({ status:"failed",message:"token does not match! please login again"});
            // Token is valid, proceed with request
            req.user = {id:userDetails.id,...decoded};  // Store decoded user info in req for use in other routes
            next();
          });
    }catch(err){
        return res.status(500).json({
            success:false,
            message:err.message
        })
    }
}