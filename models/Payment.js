// models/Payment.js
const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  rideId: { type: mongoose.Schema.Types.ObjectId, ref: "Ride", required: true },
  amount: Number,
  razorpayOrderId: String,
  razorpayPaymentId: String,
  status: { type: String, default: "success" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Payment", paymentSchema);
