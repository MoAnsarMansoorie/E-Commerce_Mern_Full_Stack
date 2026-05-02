import dotenv from 'dotenv';
dotenv.config();
import Razorpay from 'razorpay';
const razorpayInstance = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });
try {
  const order = await razorpayInstance.orders.create({ amount: 100, currency: 'INR', receipt: 'test_receipt' });
  console.log('OK', order);
} catch (err) {
  console.error('ERR', err);
  process.exit(1);
}
