import mongoose from "mongoose";

const biddingHistorySchema = new mongoose.Schema({
    restaurantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurant",
        required: true
    },
    bidTime: {
        type: Date,
        default: Date.now
    },
    bidBy: {
        type: String,
        enum: ['User', 'Restaurant'],
        required: true
    },
    price: {
        type: Number,
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