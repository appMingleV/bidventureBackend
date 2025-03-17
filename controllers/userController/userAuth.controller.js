import BidForm from "../../models/users/bidForm.model.js";
import jwt from "jsonwebtoken";
import User from "../../models/users/userAuth.model.js";
import fs from "fs";
import BiddingHistory from "../../models/users/biddingHistory.model.js";
import { getIO } from "../../socket.js";
import Restaurant from "../../models/restaurants/restaurantAuth.model.js";

class UserAuthController {
  async login(req, res) {
    try {
      const { mobile } = req.body;
      if (!mobile) {
        return res.status(403).json({
          status: false,
          message: "Please provide mobile number",
        });
      }

      // Save the mobile number with dummy OTP for now
      const otp = 1235;

      const user = await User.findOne({ mobile });
      // console.log("user data -> ",user)
      if (!user) {
        // console.log("new user")
        const newUser = User({
          mobile,
          otp,
        });
        await newUser.save();
      } else {
        // console.log("old user")
        user.otp = otp;
        await user.save();
      }

      return res.status(200).json({
        status: true,
        message: "OTP sent successfully",
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
          message: "Please provide mobile number and OTP",
        });
      }

      const user = await User.findOne({ mobile });

      //  console.log(this.userNumber)
      if (!user) {
        return res.status(403).json({
          status: false,
          message: "User not found",
        });
      }

      if (user.otp !== otp) {
        return res.status(403).json({
          status: false,
          message: "Invalid OTP",
        });
      }

      const secretKey = process.env.SECRETE_KEY;
      console.log(secretKey);
      const token = jwt.sign({ user: mobile }, secretKey);

      // const user = await userAuth.findOne({mobile});
      // console.log(user,token);
      console.log(user);
      if (!user) await userAuth.create({ mobile });

      const userProfile = await User.findOneAndUpdate(
        { mobile: mobile }, // Query to find the document
        { token: token }, // Fields to update
        { new: true } // Option to return the updated document
      );
      // console.log("user token ",updateUser,token)
      return res.status(200).json({
        status: true,
        message: "Login successfully",
        userProfile,
      });
    } catch (err) {
      return res.status(500).json({
        status: false,
        message: err.message,
      });
    }
  }
  async bidingForm(req, res) {
    try {
      const bidFormDetails = { ...req.body };
      const { userId } = req.params;

      console.log(bidFormDetails);
      if (!userId)
        return res.status(403).json({
          status: false,
          message: "User ID is required",
        });
      const bidFormDetais = await BidForm.create({
        userId,
        ...bidFormDetails,
        eventImage: req?.file?.filename,
      });

      return res.status(200).json({
        status: true,
        message: "Bid Form submitted successfully",
        bidFormDetais,
      });
    } catch (err) {
      return res.status(500).json({
        status: false,
        message: err.message,
      });
    }
  }

  async profile(req, res) {
    try {
      const userId = req.user.id;
      // console.log(userId)
      // console.log("userId --> ",userId)
      const profile = { ...req.body };
      console.log(profile);
      if (!userId) {
        return res.status(403).json({
          status: false,
          message: "User ID is required",
        });
      }

      const updatedProfile = await User.findByIdAndUpdate(userId, profile, {
        new: true,
      });
      if (!updatedProfile) {
        return res.status(403).json({
          status: false,
          message: "Failed to added profile",
        });
      }

      return res.status(200).json({
        status: true,
        message: "User profile added successfully",
        updatedProfile,
      });
    } catch (err) {
      return res.status(500).json({
        status: false,
        message: err.message,
      });
    }
  }

  async getProfile(req, res) {
    try {
      const userId = req.user.id;
      if (!userId) {
        return res.status(403).json({
          status: false,
          message: "User ID is required",
        });
      }

      const userProfile = await User.findById(userId);
      if (!userProfile) {
        return res.status(403).json({
          status: false,
          message: "User profile not found",
        });
      }

      return res.status(200).json({
        status: true,
        message: "User profile found successfully",
        userProfile,
      });
    } catch (err) {
      return res.status(500).json({
        status: false,
        message: err.message,
      });
    }
  }

  async updateProfilePicture(req, res) {
    try {
      const userId = req.user.id;

      const user = await User.findById(userId);
      const profilePicture = req.file.filename;
      if (!profilePicture) {
        return res
          .status(400)
          .json({ message: "Profile picture not found", success: false });
      }

      if (!user) {
        return res
          .status(400)
          .json({ message: "User Not found", success: false });
      }

      if (
        user.profilePicture &&
        fs.existsSync(`Uploads/${user.profilePicture}`)
      ) {
        fs.unlinkSync(`Uploads/${user.profilePicture}`);
      }

      user.profilePicture = profilePicture;
      await user.save();

      res.status(200).json({
        message: "Profile Picture Updated Successfully",
        success: true,
        user,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: err.message,
      });
    }
  }

  async updateEventStatus(req, res) {
    try {
      const bidId = req.params.id;
      const { status } = req.body;
      const event = await BidForm.findById(bidId);

      if (!event) {
        return res
          .status(400)
          .json({ message: "Event not found", success: false });
      }
      if (status !== "Canceled") {
        return res.status(400).json({
          message: "Invalid request, status must be 'Canceled' ",
          success: false,
        });
      }

      if (
        event.eventStatus !== "Canceled" ||
        event.eventStatus !== "Completed"
      ) {
        event.eventStatus = status;
        await event.save();
        res
          .status(200)
          .json({ message: `Event has been ${status}`, success: true });
      } else {
        return res
          .status(400)
          .json({ message: "Can't update the event status", success: false });
      }
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: error.message,
      });
    }
  }

  async updateEventDetails(req, res) {
    try {
      const bidId = req.params.id;

      if (!bidId) {
        return res.status(400).json({ message: "Invalid bid", success: false });
      }

      // Find the event by its ID
      const event = await BidForm.findById(bidId);

      if (!event) {
        return res
          .status(404)
          .json({ message: "Event not found", success: false });
      }

      // Update the fields using req.body
      event.set(req.body);
      event.eventStatus = "Pending"; // Ensure eventStatus is always set to "Pending"

      // Save the updated document
      const updatedEventDetails = await event.save();

      res.status(200).json({
        message: "Updated the Event details successfully",
        success: true,
        updatedEventDetails,
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message || "Internal Server Error",
        success: false,
      });
    }
  }
  async getAllBids(req, res) {
    try {
      const { userId } = req.params;
      const bids = await BidForm.find({ userId }).populate("bidHistory").exec();
      const user = await User.findById(userId);
      if (!user)
        return res.status(404).json({
          status: false,
          message: "User not found",
        });
      if (userId != req.user.id)
        return res.status(403).json({
          status: false,
          message: "wrong user to try access data ",
        });
      if (bids.length == 0) {
        return res.status(404).json({
          status: true,
          message: "No bids found for this user",
        });
      }
      return res.status(200).json({
        status: true,
        bids,
      });
    } catch (err) {
      return res.status(500).json({
        status: false,
        message: err.message,
      });
    }
  }
  async counterBid(req, res) {
    try {
      const userId = req.user.id;
      const { eventId, restaurantId, price } = req.body;
      console.log(req.body)
      console.log(userId)
      const io=getIO()

      if (!eventId || !restaurantId) {
        return res.status(400).json({
          success: false,
          message: "eventId & restaurantId are required!",
        });
      }

      const event = await BidForm.findOne({ _id: eventId, userId });
      console.log(event)
      if (!event) {
        return res.status(404).json({
          success: false,
          message: "Event not found or you are not authorized",
        });
      }

      if (event.isBiddingClosed) {
        return res.status(400).json({
          success: false,
          message: "Bidding is closed for this event",
        });
      }

      // Get the latest bid for this event & restaurant
      const latestBid = await BiddingHistory.findOne({
        eventId,
        restaurantId,
      }).sort({ createdAt: -1 });

      if (!latestBid) {
        return res.status(400).json({
          success: false,
          message: "No bid exists from this restaurant to counter.",
        });
      }

      // If the latest bid was rejected by the restaurant, user can't counter it
      if (latestBid.status === "Rejected") {
        return res.status(400).json({
          success: false,
          message:
            "You cannot counter this bid as it was rejected by the restaurant.",
        });
      }

      // Ensure user cannot place consecutive counter bids
      if (latestBid.latestBidBy === "User") {
        return res.status(400).json({
          success: false,
          message:
            "You have already countered last. Wait for the restaurant to bid.",
        });
      }

      const newBid = new BiddingHistory({
        eventId,
        restaurantId,
        price,
        bidBy: "User",
        latestBidBy: "User",
      });

      const data = await newBid.save();
      event.bidHistory.push(data._id);
      await event.save();

      
      const restaurant=await Restaurant.findById(restaurantId)
      console.log(restaurant)
      if (restaurant.socketId) {
        console.log("hello")
        io.to(restaurant.socketId).emit("newBidNotification", {
          eventId,
          restaurantId,
          price,
        });
      }

      res.status(201).json({
        message: "Counter bid placed successfully",
        success: true,
        data,
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async acceptBid(req, res) {
    try {
      const userId = req.user.id;
      const { eventId, restaurantId } = req.body;
       const io=getIO()

      if (!eventId || !restaurantId) {
        return res.status(400).json({
          success: false,
          message: "eventId & restaurantId are required!",
        });
      }

      const event = await BidForm.findOne({ _id: eventId, userId });

      if (!event) {
        return res.status(404).json({
          success: false,
          message: "Event not found or you are not authorized",
        });
      }

      if (event.isBiddingClosed) {
        return res.status(400).json({
          success: false,
          message: "Bidding is already closed for this event",
        });
      }

      // Find latest accepted bid
      const acceptedBid = await BiddingHistory.findOne({
        eventId,
        restaurantId,
      }).sort({ createdAt: -1 });

      if (!acceptedBid) {
        return res.status(400).json({
          success: false,
          message: "No bid found to accept from this restaurant.",
        });
      }

      acceptedBid.status = "Accepted";
      await acceptedBid.save();

      // Close bidding for this event
      // event.isBiddingClosed = true;
      // event.eventStatus = "Accepted";
      // await event.save();

      // Socket implementation
      
      const restaurant=await Restaurant.findById(restaurantId)
      if (restaurant.socketId) {
        console.log("bid accepted by user")
        io.to(restaurant.socketId).emit("acceptedNotification", {
          userId,
          eventId,
          acceptedBid,
          message: "Bid Accepted successfully By the User",
        });
      }

      res
        .status(200)
        .json({ message: "Bid accepted successfully!", success: true });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
  async rejectBid(req, res) {
    try {
      const { bidId } = req.body;
      const userId = req.user.id;

      const io=getIO();

      if (!bidId) {
        return res
          .status(400)
          .json({ success: false, message: "bidId is required!" });
      }

      const bid = await BiddingHistory.findById(bidId).populate("eventId");
      if (!bid) {
        return res
          .status(404)
          .json({ success: false, message: "Bid not found" });
      }

      if (!bid.eventId.userId.equals(userId)) {
        return res.status(403).json({
          success: false,
          message: "Unauthorized! You can only reject bids for your events",
        });
      }

      //check for bid is already accepted
      if (bid.status === "Accepted") {
        return res
          .status(400)
          .json({ success: false, message: "bid Already Accepted" });
      }

      if (bid.status == "Rejected") {
        return res.status(400).json({
          success: false,
          message: "Bid already Rejected",
        });
      }

      // Update bid status to "Rejected"
      bid.status = "Rejected";
      await bid.save();
  
     // Socket implementation
     const restaurant=await Restaurant.findById(bid.restaurantId)
      if(restaurant.socketId)
      {
        console.log("bid rejected by user")
           io.to(restaurant.socketId).emit('rejectedNotification',{
            bidId,
            userId,
            message:"Bid rejected successfully" 
           })
      }
      res.status(200).json({
        success: true,
        message: "Bid rejected successfully",
        data: {
          bidId: bid._id,
          status: bid.status,
        },
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
  async getAllBidsForEvent(req, res) {
    try {
      const { eventId } = req.query;

      if (!eventId) {
        return res
          .status(400)
          .json({ success: false, message: "eventId is required!" });
      }

      const event = await BidForm.findById(eventId);
      if (!event) {
        return res
          .status(404)
          .json({ success: false, message: "Event not found" });
      }

      // Fetch all bids for the event
      const bidHistory = await BiddingHistory.find({ eventId })
        .populate("restaurantId", "name") // Fetch restaurant name
        .sort({ createdAt: 1 }) // Oldest to newest
        .select("restaurantId bidBy price status createdAt"); // Select required fields

      if (!bidHistory.length) {
        return res
          .status(404)
          .json({ success: false, message: "No bids found for this event" });
      }

      // Group bids by restaurantId
      const groupedBids = bidHistory.reduce((acc, bid) => {
        const restaurantName = bid.restaurantId.name;
        if (!acc[restaurantName]) {
          acc[restaurantName] = [];
        }
        acc[restaurantName].push({
          bidBy: bid.bidBy,
          price: bid.price,
          status: bid.status,
          createdAt: bid.createdAt,
        });
        return acc;
      }, {});

      res.status(200).json({
        success: true,
        message: "Bidding history retrieved successfully",
        data: groupedBids,
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}

export default new UserAuthController();
