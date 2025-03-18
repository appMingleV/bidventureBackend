import mongoose from "mongoose";
import Restaurant from "../../models/restaurants/restaurantAuth.model.js";
import BiddingHistory from "../../models/users/biddingHistory.model.js";
import BidForm from "../../models/users/bidForm.model.js";
import { getIO } from "../../socket.js";
import User from "../../models/users/userAuth.model.js";

class bidRestarurant {
  async getAllEvents(req, res) {
    try {
      const Events = await BidForm.find().populate("bidHistory")
      if (Events.length == 0) {
        return res.status(404).json({
          status: true,
          message: "No new events found",
        });
      }
      return res.status(200).json({
        status: true,
        Events,
      });
    } catch (err) {
      return res.status(500).json({
        status: false,
        message: err.message,
      });
    }
  }
  async getBidById(req, res) {
    try {
      const { bidId } = req.params;
      if (!bidId) {
        return res.status(400).json({
          status: false,
          message: "Please provide bidId",
        });
      }
      console.log(bidId);
      const bid = await BiddingHistory.findById(bidId);
      if (!bid) {
        return res.status(404).json({
          status: false,
          message: "Bid not found",
        });
      }
      return res.status(200).json({
        status: true,
        message: "bid successfully fetched",
        bid,
      });
    } catch (err) {
      return res.status(500).json({
        status: false,
        message: err.message,
      });
    }
  }
  async bidding(req, res) {
    try {
      const restaurantId = req.restaurantUser.id;
      const { eventId, price } = req.body;
      const io = getIO();
      if (!eventId) {
        return res
          .status(400)
          .json({ success: false, message: "eventId is required!" });
      }

      const event = await BidForm.findOne({ _id: eventId });
        
      if (!event) {
        return res
          .status(404)
          .json({ success: false, message: "Event not found" });
      }

      if (event.isBiddingClosed) {
        return res.status(400).json({
          success: false,
          message: "Bidding is closed for this event",
        });
      }

      // Check if a bid was previously rejected for this restaurant and event
      const rejectedBid = await BiddingHistory.findOne({
        eventId,
        restaurantId,
        status: "Rejected",
      });

      if (rejectedBid) {
        return res.status(400).json({
          success: false,
          message:
            "You cannot bid again for this event as your previous bid was rejected by the user.",
        });
      }

      // Check the latest bid for this event & restaurant
      const latestBid = await BiddingHistory.findOne({
        eventId,
        restaurantId,
      }).sort({ createdAt: -1 });

      if (latestBid && latestBid.latestBidBy === "Restaurant") {
        return res.status(400).json({
          success: false,
          message: "You have already bid last. Wait for the user to counter.",
        });
      }

      const newBid = new BiddingHistory({
        eventId,
        restaurantId,
        price,
        bidBy: "Restaurant",
        latestBidBy: "Restaurant",
      });

      const data = await newBid.save();
      event.bidHistory.push(data._id);
      await event.save();
      console.log(event.userId)
      const user = await User.findById(event.userId);
      console.log(user)
      //socket implementation for the notification
      if (user.socketId) {
        io.to(user.socketId).emit("userBidNotification", {
          eventId,
          restaurantId,
          price,
          message: "New bid is created",
        });
      }

      res
        .status(201)
        .json({ message: "Bidding created successfully", success: true, data });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
  async getBiddingHistory(req, res) {
    try {
      const restaurantId = req.restaurantUser.id;
      const { eventId } = req.query;

      if (!eventId || !restaurantId) {
        return res.status(400).json({
          success: false,
          message: "eventId & restaurantId are required!",
        });
      }

      const event = await BidForm.findById(eventId);
      if (!event) {
        return res
          .status(404)
          .json({ success: false, message: "Event not found" });
      }

      // Find all bids between this user & restaurant for this event
      const bidHistory = await BiddingHistory.find({ eventId, restaurantId })
        .sort({ createdAt: 1 }) // Oldest to newest
        .select("bidBy price status createdAt"); // Select required fields

      if (!bidHistory.length) {
        return res.status(404).json({
          success: false,
          message: "No bids found for this event & restaurant",
        });
      }

      res.status(200).json({
        success: true,
        message: "Bidding history retrieved successfully",
        data: bidHistory,
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
  async acceptBid(req, res) {
    try {
      const restaurantId = req.restaurantUser.id;
      const { bidId } = req.body;
      const io = getIO();

      if (!bidId) {
        return res
          .status(400)
          .json({ success: false, message: "bidId is required!" });
      }

      // Find the bid
      const bid = await BiddingHistory.findOne({ _id: bidId, restaurantId });
      const event = await BidForm.findById(bid.eventId);
      const user = await User.findById(event.userId);
      if (!bid) {
        return res
          .status(404)
          .json({ success: false, message: "Bid not found!" });
      }

      // Make sure sure Bidding is not closed
      if (event.isBiddingClosed) {
        return res.status(400).json({
          success: false,
          message: "Bidding is already closed",
        });
      }

      if (bid.status === "Accepted" && !event.isBiddingClosed) {
        event.isBiddingClosed = true;
        event.eventStatus = "Accepted";
        await event.save();
        if (user.socketId) {
          io.to(user.socketId).emit("BidAcceptanceNotify", {
            bidId,
            restaurantId,
            message: "Bid Accepted Successfully by the Restaurant",
          });
        }

        return res
          .status(200)
          .json({ success: true, message: "Event Accepted successfully" });
      }
      // Check if the bid is already accepted
      if (bid.status === "Accepted") {
        return res
          .status(400)
          .json({ success: false, message: "Bid is already accepted!" });
      }
      // Check for the bid  Rejection
      if (bid.status === "Rejected") {
        return res
          .status(400)
          .json({ success: false, message: "bid is already Rejected" });
      }

      // Update bid status to "Accepted"
      bid.status = "Accepted";
      bid.completedAt = new Date();
      await bid.save();

      // Close bidding for this event
      await BidForm.findByIdAndUpdate(
        bid.eventId,
        {
          $set: { eventStatus: "Accepted", isBiddingClosed: true },
        },
        { new: true }
      );

      //socket implementation for user's notification

      if (user.socketId) {
        io.to(user.socketId).emit("BidAcceptanceNotify", {
          bidId,
          restaurantId,
          message: "Bid Accepted Successfully by the Restaurant",
        });
      }

      res
        .status(200)
        .json({ success: true, message: "Bid accepted successfully!" });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
  async rejectBid(req, res) {
    try {
      const restaurantId = req.restaurantUser.id;
      const { bidId } = req.body;
      const io = getIO();

      if (!bidId) {
        return res
          .status(400)
          .json({ success: false, message: "bidId is required!" });
      }

      // Find the bid
      const bid = await BiddingHistory.findOne({ _id: bidId, restaurantId });

      if (!bid) {
        return res
          .status(404)
          .json({ success: false, message: "Bid not found!" });
      }

      // Check if the bid is already rejected
      if (bid.status === "Rejected") {
        return res
          .status(400)
          .json({ success: false, message: "Bid is already rejected!" });
      }

      // Update bid status to "Rejected"
      bid.status = "Rejected";
      await bid.save();

      //socket implementation for rejection notification
      const event = await BidForm.findById(bid.eventId);
      const user = await User.findById(event.userId);
      if (user.socketId) {
        console.log("hello");
        io.to(user.socketId).emit("rejectedBidNotify", {
          bidId,
          restaurantId,
          message: "Bid Rejected Successfully",
        });
      }

      res
        .status(200)
        .json({ success: true, message: "Bid rejected successfully!" });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
  async acceptEvent(req,res){
    const io = getIO();
    try {

      const { status,eventId } = req.body;

      if(status!=="Accepted"){
        return res.status(422).json({
          message:"Wrong status",
          success:false
        })
      }

      const event = await BidForm.findById(eventId);

      if(!event){
        return res.status(404).json({
          message:"Wrong event id",
          success:false
        })
      }
      const userId = event.userId;

      const user = await User.findById(userId);

      const bidHistory = await BiddingHistory.findOne({eventId})
      // console.log(`accept event bid history-> ${bidHistory}`)
      // bidHistory.status = status;
      // await bidHistory.save();

      event.eventStatus = status;
      const result = await event.save();
      console.log("user details => ",user)
      if (user.socketId) {
        console.log("event acceptance by restaurant ============== ");
        io.to(user.socketId).emit("eventAcceptanceNotification", {
          message: "Your event has been accepted",
        });
      }

      res.status(200).json({
        message:"Event Accepted",
        success:true,
        result
      })


    } catch (error) {
      return res.status(500).json({
        success:false,
        message:error.message
      })
    }
  }

  async rejectEvent(req,res){
    const io = getIO();
    try {
      const { status,eventId } = req.body;

      if(status!=="Canceled"){
        return res.status(422).json({
          message:"Wrong status",
          success:false
        })
      }

      const event = await BidForm.findById(eventId);

      if(!event){
        return res.status(404).json({
          message:"Wrong event id",
          success:false
        })
      }
      const userId = event.userId;

      const user = await User.findById(userId);

      const bidHistory = await BiddingHistory.findOne({eventId})
      console.log(`reject event bid history-> ${bidHistory}`)

      // bidHistory.status = "Rejected";
      // await bidHistory.save();

      event.eventStatus = status;
      const result = await event.save();

      if (user.socketId) {
        // console.log("hello");
        io.to(user.socketId).emit("eventRejectionNotification", {
          message: "Your event has been rejected",
        });
      }

      res.status(200).json({
        message:"Event rejected",
        success:true,
        result
      })
    } catch (error) {
      return res.status(500).json({
        success:false,
        message:error.message
      })
    }
  }

}

export default new bidRestarurant();
