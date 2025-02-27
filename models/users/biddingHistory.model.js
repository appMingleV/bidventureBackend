import mongoose from "mongoose";

const biddingHistorySchema = new mongoose.Schema({
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "BidForm",
        required: true
    },
    restaurantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurant",
        required: true
    },
    bidBy: {
        type: String,
        enum: ['User', 'Restaurant'],
        required: true
    },
    price: {
        type: Number,
        required: [true, "Bid Price is required for event bidding"]
    },
    latestBidBy: {
        type: String,
        enum: ['User', 'Restaurant'],
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Accepted', 'Rejected', 'Completed'],
        default: 'Pending'
    },
    completedAt: {
        type: Date
    }
}, { timestamps: true });

const BiddingHistory = mongoose.model("BiddingHistory", biddingHistorySchema);
export default BiddingHistory;