const Razorpay = require("razorpay");
const crypto = require("crypto");
const Payment = require("../models/Payment");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

exports.createOrder = async ({ amount }) => {
  const order = await razorpay.orders.create({
    amount: amount * 100,
    currency: "INR",
    receipt: `receipt_${Date.now()}`
  });

  return {
    orderId: order.id,
    amount: order.amount,
    currency: order.currency
  };
};

exports.verifyAndStorePayment = async ({
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,
  userId,
  rideId,
  amount
}) => {
  // ✅ Log received data for debugging
  console.log("🔁 Received data in verifyAndStorePayment:", {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    userId,
    rideId,
    amount
  });

  // ✅ Check if any required field is missing
  if (
    !razorpay_order_id ||
    !razorpay_payment_id ||
    !razorpay_signature ||
    !userId ||
    !rideId ||
    !amount
  ) {
    throw new Error("Missing required fields in verification request");
  }

  // ✅ Signature check
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  // ✅ Log signature comparison
  console.log("🧾 Expected Signature:", expectedSignature);
  console.log("🧾 Received Signature:", razorpay_signature);

  if (expectedSignature !== razorpay_signature) {
    throw new Error("Invalid payment signature");
  }

  // ✅ Save payment to DB
  const payment = new Payment({
    userId,
    rideId,
    amount,
    razorpayOrderId: razorpay_order_id,
    razorpayPaymentId: razorpay_payment_id
  });

  await payment.save();

  return { success: true, message: "✅ Payment verified & stored" };
};
