import { Server } from "socket.io";
import User from "./models/users/userAuth.model.js";
import Restaurant from "./models/restaurants/restaurantAuth.model.js";

let io;
export const initiateSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", async (socket) => {
    console.log("A user connected:", socket.id);

    // Store socket ID for Users
    socket.on("userJoin", async ({ userId }) => {
      const savedUser = await User.findByIdAndUpdate(
        userId, 
        { socketId: socket.id }, 
        { new: true }
      );
      
      console.log("User joined:", userId);
      console.log(`Saved User details => ${savedUser}`)
    });

    // Store socket ID for Restaurants
    socket.on("restaurantJoin", async ({ restaurantId }) => {
      const savedRestaurant = await Restaurant.findByIdAndUpdate(
        restaurantId, 
        { socketId: socket.id }, 
        { new: true }
    );
    
      console.log("Restaurant joined:", restaurantId);
      console.log(`Saved Restaurant details => ${savedRestaurant}`)
    });

    // Handle Disconnection
    socket.on("disconnect", async () => {
      console.log("User disconnected:", socket.id);

      // Find the user or restaurant by socket ID
      // const user = await User.findOne({ socketId: socket.id });
      // const restaurant = await Restaurant.findOne({ socketId: socket.id });

      // if (user) {
      //   await User.findByIdAndUpdate(user._id, { socketId: null });
      //   console.log(`User ${user._id} disconnected`);
      // }

      // if (restaurant) {
      //   await Restaurant.findByIdAndUpdate(restaurant._id, { socketId: null });
      //   console.log(`Restaurant ${restaurant._id} disconnected`);
      // }
    });
  });

  return io;
};

// Function to get the io instance
export const getIO = () => {
  if (!io) {
    throw new Error("Socket.IO is not initialized!");
  }
  return io;
};
