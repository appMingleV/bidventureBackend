import mongoose from "mongoose";
import Restaurant from "../../models/restaurants/restaurantAuth.model.js";
import BiddingHistory from "../../models/users/biddingHistory.model.js";
import BidForm from "../../models/users/bidForm.model.js";

class bidRestarurant{
   async getAllEvents(req,res){
     try{
        const Events = await BidForm.find({eventStatus:"Pending"});
        if(Events.length==0){
            return res.status(404).json({
                status:true,
                message:'No new events found',
            })
        }
        return res.status(200).json({
            status:true,
            Events
        });
     }catch(err){
        return res.status(500).json({
            status:false,
            message:err.message
        });
     }
   }
   async getBidById(req,res){
    try{
        const {bidId}=req.params;
        if(!bidId){
            return res.status(400).json({
                status:false,
                message:'Please provide bidId'
            })
        }
        console.log(bidId)
        const bid=await BidForm.findById(bidId);
        if(!bid){
            return res.status(404).json({
                status:false,
                message:'Bid not found'
            })
        }
        return res.status(200).json({
            status:true,
            message:"bid successfully fetched",
            bid
        })

    }catch(err){
        return res.status(500).json({
            status:false,
            message:err.message
        });
    }
   }
   async bidding(req, res) {
    try {
        const restaurantId = req.restaurantUser.id;
        const { eventId, price } = req.body;

        if (!eventId) {
            return res.status(400).json({ success: false, message: "eventId is required!" });
        }

        const event = await BidForm.findOne({ _id: eventId });

        if (!event) {
            return res.status(404).json({ success: false, message: "Event not found" });
        }

        if (event.isBiddingClosed) {
            return res.status(400).json({ success: false, message: "Bidding is closed for this event" });
        }

        // Check if a bid was previously rejected for this restaurant and event
        const rejectedBid = await BiddingHistory.findOne({ 
            eventId, 
            restaurantId, 
            status: "Rejected" 
        });

        if (rejectedBid) {
            return res.status(400).json({
                success: false,
                message: "You cannot bid again for this event as your previous bid was rejected by the user."
            });
        }

        // Check the latest bid for this event & restaurant
        const latestBid = await BiddingHistory.findOne({ eventId, restaurantId }).sort({ createdAt: -1 });

        if (latestBid && latestBid.latestBidBy === "Restaurant") {
            return res.status(400).json({
                success: false,
                message: "You have already bid last. Wait for the user to counter."
            });
        }

        const newBid = new BiddingHistory({
            eventId,
            restaurantId,
            price,
            bidBy: "Restaurant",
            latestBidBy: "Restaurant"
        });

        const data = await newBid.save();
        event.bidHistory.push(data._id);
        await event.save();

        res.status(201).json({ message: "Bidding created successfully", success: true, data });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}
 async getBiddingHistory(req, res) {
    try {
        const restaurantId = req.restaurantUser.id;
        const { eventId } = req.query;

        if (!eventId || !restaurantId) {
            return res.status(400).json({ success: false, message: "eventId & restaurantId are required!" });
        }

        const event = await BidForm.findById(eventId);
        if (!event) {
            return res.status(404).json({ success: false, message: "Event not found" });
        }

        // Find all bids between this user & restaurant for this event
        const bidHistory = await BiddingHistory.find({ eventId, restaurantId })
            .sort({ createdAt: 1 }) // Oldest to newest
            .select("bidBy price status createdAt"); // Select required fields

        if (!bidHistory.length) {
            return res.status(404).json({ success: false, message: "No bids found for this event & restaurant" });
        }

        res.status(200).json({
            success: true,
            message: "Bidding history retrieved successfully",
            data: bidHistory
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
 }
 async acceptBid(req, res) {
    try {
        const restaurantId = req.restaurantUser.id;
        const { bidId } = req.body;

        if (!bidId) {
            return res.status(400).json({ success: false, message: "bidId is required!" });
        }

        // Find the bid
        const bid = await BiddingHistory.findOne({ _id: bidId, restaurantId });

        if (!bid) {
            return res.status(404).json({ success: false, message: "Bid not found!" });
        }

        // Check if the bid is already accepted
        if (bid.status === "Accepted") {
            return res.status(400).json({ success: false, message: "Bid is already accepted!" });
        }

        // Update bid status to "Accepted"
        bid.status = "Accepted";
        bid.completedAt = new Date();
        await bid.save();

        // Close bidding for this event
        await BidForm.findByIdAndUpdate(bid.eventId, { isBiddingClosed: true });

        res.status(200).json({ success: true, message: "Bid accepted successfully!" });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
    }
    async rejectBid(req, res) {
        try {
            const restaurantId = req.restaurantUser.id;
            const { bidId } = req.body;
    
            if (!bidId) {
                return res.status(400).json({ success: false, message: "bidId is required!" });
            }
    
            // Find the bid
            const bid = await BiddingHistory.findOne({ _id: bidId, restaurantId });
    
            if (!bid) {
                return res.status(404).json({ success: false, message: "Bid not found!" });
            }
    
            // Check if the bid is already rejected
            if (bid.status === "Rejected") {
                return res.status(400).json({ success: false, message: "Bid is already rejected!" });
            }
    
            // Update bid status to "Rejected"
            bid.status = "Rejected";
            await bid.save();
    
            res.status(200).json({ success: true, message: "Bid rejected successfully!" });
    
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }    
}

export default new bidRestarurant();
