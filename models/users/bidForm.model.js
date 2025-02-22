import mongoose from "mongoose";

const bidFormSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User ID is required"]
    },
    eventType: {
        type: String,
        required: [true, "Event Type is required"]
    },
    eventDate: {
        type: String,
        required: [true, "Event Date is required"]
    },
    eventTime: {
        type: String,
        required: [true, "Event Time is required"]
    },
    numberAdults: {
        type: Number,
        required: [true, "Number of Adults is required"],
        min: [1, "Number of Adults can't be smaller than 1"]
    },
    numberKids: {
        type: Number,
        required: [true, "Number of Kids is required"],
        min: [0, "Number of Kids can't be smaller than 0"]
    },
    budget: {
        type: Number,
        required: [true, "Budget is required"]
    },
    city: {
        type: String,
        required: [true, "City is required"]
    },
    state: {
        type: String,
        required: [true, "State is required"]
    },
    pincode: {
        type: Number,
        required: [true, "Pincode is required"],
        validate: [/^[0-9]{1,6}$/, "Pincode is invalid"]
    },
    fullAddress: {
        type: String,
    },
    foodType: {
        type: String,
        enum: ["veg", "non-veg", "both"],
        required: [true, "Food Type is required"]
    },
    eventDescription: {
        type: String,
    },
    eventStatus: {
        type: String,
        enum: ['Pending', 'Accepted', 'Completed', 'Canceled'],
        default: "Pending"
    },
    bidHistory: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BiddingHistory'
    }]
}, { timestamps: true });

const BidForm = mongoose.model("BidForm", bidFormSchema);
export default BidForm;