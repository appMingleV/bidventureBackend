import userAuth from "../models/users/userAuth.model.js";
import restAuth from "../models/restaurants/restaurantAuth.model.js";
import jwt from "jsonwebtoken";
import adminModel from "../models/admin/adminModel.js";
export const userAutherization = (req, res, next) => {
  try {
      
    const authHeader = req.headers.authorization || req.headers?.authorization;
   
    if (!authHeader)
      return res.status(403).json({
        success: false,
        message: "Authorization header not found",
      });
    const token = authHeader.split(" ")[1];
    

    if (!token) {
      return res.status(403).json({ msg: "Token not provided", status: false });
    }

    const secretKey = process.env.SECRETE_KEY;
    //  console.log("secret key ---> ",secretKey)

    jwt.verify(token, secretKey, async (error, decoded) => {
      if (error) {
        return res
          .status(401)
          .json({ msg: "Invalid or expired token", status: false });
      }
      // console.log(decoded);
      const userDetails = await userAuth.findOne({ mobile: decoded?.user });

      if (!userDetails)
        return res
          .status(400)
          .json({ status: "failed", message: "Unauthorized User" });
      //  console.log("userDetails --> ",userDetails);
      if (token !== userDetails.token)
        return res
          .status(400)
          .json({
            status: "failed",
            message: "token does not match! please login again",
          });
      // Token is valid, proceed with request
      req.user = { id: userDetails._id }; // Store decoded user info in req for use in other routes
      next();
    });
    //eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjo3OTA2ODM3MDg2LCJpYXQiOjE3Mzc0NDM3NTF9.NEoEWF8qlqSWvnFHRNtMoGyUE0hDFrf8fY96qrZMW9s
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const restaurantAuthorization = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers?.authorization;
    if (!authHeader) {
      return res.status(403).json({
        success: false,
        message: "Authorization header not found",
      });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(403).json({
        msg: "Token not provided",
        status: false,
      });
    }
    // console.log(token)
    const secretKey = process.env.SECRETE_KEY;

    jwt.verify(token, secretKey, async (error, decoded) => {
      if (error) {
        return res.status(401).json({
          msg: "Invalid or expired token",
          status: false,
        });
      }
      // console.log(decoded);
      const restaurantUser = await restAuth.findOne({ mobile: decoded.user });
      if (!restaurantUser)
        return res.status(403).json({
          success: false,
          message: "Unauthorized Restaurant",
        });
      // console.log(restaurantUser._id)
      req.restaurantUser = { id: restaurantUser._id };
      next();
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const adminAuth = (req,res,next) =>{
  try {
    const authHeader = req.headers.authorization || req.headers?.authorization;
    if (!authHeader) {
      return res.status(403).json({
        success: false,
        message: "Authorization header not found",
      });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(403).json({
        msg: "Token not provided",
        status: false,
      });
    }
    // console.log(token)
    const secretKey = process.env.SECRETE_KEY;

    jwt.verify(token, secretKey, async (error, decoded) => {
      if (error) {
        return res.status(401).json({
          msg: "Invalid or expired token",
          status: false,
        });
      }
      console.log(decoded);
      const admin = await adminModel.findById(decoded.admin.id)
      if (!admin)
        return res.status(403).json({
          success: false,
          message: "Unauthorized Admin",
        });
      // console.log(admin._id)
      req.admin = { id: admin._id };
      next();
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}