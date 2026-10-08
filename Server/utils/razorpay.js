import Razorpay from "razorpay"
const RazorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_API_SECRET
});
export default RazorpayInstance