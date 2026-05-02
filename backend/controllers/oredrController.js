import userModel from "../models/userModel.js";
import orderModel from "../models/orderModel.js";
import Stripe from "stripe"
import razorpay from "razorpay"
import crypto from "crypto"

// global variable
const currency = "inr"
const deliveryCharge = 10

// Placing order using COD method
const placeOrderCodControllers = async (req, res) => { 
    try {
        const userId = req.user.id; // Get userId from token
        const { items, amount, address } = req.body;

        const orderData = {
            userId,
            items,
            amount,
            address,
            paymentMethod: "COD",
            payment: false,
            date: Date.now()
        }

        const newOrder = new orderModel(orderData);

        await newOrder.save();

        await userModel.findByIdAndUpdate(userId, { cartData: {} })

        res.status(201).json({
            success: true,
            message: "Order placed successfully",
            order: newOrder
        });

    } catch (error) {
        console.error("Error placing order with COD:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// Placing order using Stripe Method
const placeOrderStripeControllers = async (req, res) => { 
    try {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

        const userId = req.user.id; // Get userId from token
        const { items, amount, address } = req.body;
        const {origin} = req.headers

        const orderData = {
            userId,
            items,
            amount,
            address,
            paymentMethod: "Stripe",
            payment: false,
            date: Date.now()
        } 

        const newOrder = new orderModel(orderData);
        await newOrder.save();

        const line_items = items.map((item) => ({
            price_data: {
                currency: currency,
                product_data: {
                    name: item.name
                },
                unit_amount: item.price * 100
            },
            quantity: item.quantity
        }))

        line_items.push({
            price_data: {
                currency: currency,
                product_data: {
                    name: "Delivery Charges"
                },
                unit_amount: deliveryCharge
            },
            quantity: 1
        })

        const session = await stripe.checkout.sessions.create({
            success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
            line_items,
            mode: "payment"
        })

        res.status(200).json({
            success: true,
            session_url: session.url
        })
        
    } catch (error) {
        console.error("Error placing order with Stripe:", error);
        res.status(500).json({ message: "Internal server error" });
        
    }
}

// verify stripe order
const verifyStripeController = async (req, res) => {
    try {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

        const userId = req.user.id; // Get userId from token
        const {orderId, success} = req.body

        if (success === "true") {
            await orderModel.findByIdAndUpdate(orderId, {payment: true})
            await userModel.findByIdAndUpdate(userId, {cartData: {}})
            res.status(200).json({
                success: true
            })
        } else {
            await orderModel.findByIdAndDelete(orderId)
            res.status(401).json({
                success: false
            })
        }
        
    } catch (error) {
        console.error("Error placing order with Stripe verify:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// Placing order using Razorpay Method
const placeOrderRazorpayControllers = async (req, res) => {
    try {
        // Initialize Razorpay here, after dotenv.config() has run
        const razorpayInstance = new razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });

        const userId = req.user.id; // Get userId from token
        const { items, amount, address } = req.body;

        const orderData = {
            userId,
            items,
            amount,
            address,
            paymentMethod: "Razorpay",
            payment: false,
            date: Date.now()
        }

        const newOrder = new orderModel(orderData);
        await newOrder.save();

        const numericAmount = Number(amount)
        if (Number.isNaN(numericAmount) || numericAmount <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid order amount for Razorpay payment."
            })
        }

        const options = {
            amount: Math.round(numericAmount * 100),
            currency: currency.toUpperCase(),
            receipt: newOrder._id.toString(),
            payment_capture: 1
        }

        console.log("Creating Razorpay order with options:", options)
        const order = await razorpayInstance.orders.create(options)
        console.log("Razorpay order created", order)
        return res.status(200).json({
            success: true,
            message: "Payment order created successfully",
            order
        })

        
    } catch (error) {
        console.error("Error placing order with Razorpay:", error);
        res.status(500).json({ message: "Internal server error" });
        
    }
}

// verify razorpay order id
const verifyRazorpayController = async (req, res) => {
    try {
        // Initialize Razorpay here
        const razorpayInstance = new razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });

            const userId = req.user.id; // Get userId from token
        const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

        if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
            return res.status(400).json({
                success: false,
                message: "Missing Razorpay verification fields."
            })
        }

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex")

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({
                success: false,
                message: "Razorpay signature verification failed."
            })
        }

        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)
        console.log(orderInfo)

        if (orderInfo.status === "paid") {
            await orderModel.findByIdAndUpdate(orderInfo.receipt, {payment: true})
            await userModel.findByIdAndUpdate(userId, { cartData: {} })
            res.status(200).json({
                success: true,
                message: "Payment successful"
            })
        } else {
            res.status(400).json({
                success: false,
                message: "Payment failed"
            })
        }
        
    } catch (error) {
        console.error("Error placing order with Razorpay verify:", error);
        res.status(500).json({ message: "Internal server error" });
        
    }
}

// All orders data for admin panel
const allOrdersControllers = async (req, res) => {
    try {
        const orders = await orderModel.find({})
        res.status(200).json({
            success: true,
            message: "All orders data",
            orders
        })
        
    } catch (error) {
        console.error("Error fetching user orders data for admin panel:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }

}

// User order data for frontend
const userOrdersControllers = async (req, res) => {
    try {
        const userId = req.user.id; // Get userId from token

        const orders = await orderModel.find({ userId }).sort({ createdAt: -1 });

        if (!orders || orders.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No orders found for this user"
            });
        }

        res.status(200).json({
            success: true,
            orders
        });
        
    } catch (error) {
        console.error("Error fetching user orders:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
        
    }

}

// update order status by admin
const updateOrderStatusControllers = async (req, res) => {
    try {
        const { orderId, status } = req.body
        
        await orderModel.findByIdAndUpdate(orderId, {status})

        res.status(200).json({
            success: true,
            message: "Status updated successfully",
            status
        })
        
    } catch (error) {
        console.log(error)
    }

}

export { verifyRazorpayController, verifyStripeController, placeOrderCodControllers, placeOrderStripeControllers, placeOrderRazorpayControllers, allOrdersControllers, userOrdersControllers, updateOrderStatusControllers };