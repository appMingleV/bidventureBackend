import bcrypt from "bcrypt";
import adminModel from "../../models/admin/adminModel.js";
import userModel from "../../models/users/userAuth.model.js";
import Restaurant from "../../models/restaurants/restaurantAuth.model.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const adminRegister = async (req, res) => {
  try {
    const { email, password } = req.body;

    if( !email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const existingAdmin = await adminModel.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
     
    const admin = new adminModel({ email, password : hashedPassword });
    await admin.save();
    res.status(200).json({ message: "Admin registered successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const adminLogin = async (req, res) => {
    try {
      const { email, password } = req.body;
    
      const admin = await adminModel.findOne({ email });
    
      if (!admin) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
    
      const isPasswordValid = await bcrypt.compare(password, admin.password);
    
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      const payload = {
        user: {
          id: admin._id,
          email: admin.email
        },
      }
      const token = jwt.sign(payload, process.env.SECRETE_KEY);
      res.status(200).json({ message: "Admin logged in successfully", token });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };


  export const getAllUsers = async (req, res) => {
    try {
      const users = await userModel.find();
      res.status(200).json({ users });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  export const getAllRestaurants = async (req, res) => {
    try {
      const restaurants = await Restaurant.find();
      res.status(200).json({ restaurants });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };