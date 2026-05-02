import express from "express"
import { allOrdersControllers, placeOrderCodControllers, placeOrderRazorpayControllers, placeOrderStripeControllers, updateOrderStatusControllers, userOrdersControllers, verifyRazorpayController, verifyStripeController } from "../controllers/oredrController.js"
import adminAuth from "../middlewares/adminAuth.js"
import authUser from "../middlewares/authUser.js"

const orderRoute = express.Router()

// Admin features
orderRoute.post("/list", adminAuth, allOrdersControllers)
orderRoute.post("/status", updateOrderStatusControllers)

// Payment features
orderRoute.post("/placeorder", authUser, placeOrderCodControllers)
orderRoute.post("/stripe", authUser, placeOrderStripeControllers)
orderRoute.post("/razorpay", authUser, placeOrderRazorpayControllers)

// User features
orderRoute.post("/userorders", authUser, userOrdersControllers)

// verify payment
orderRoute.post("/verifystripe", authUser, verifyStripeController)
orderRoute.post("/verifyrazorpay", authUser, verifyRazorpayController)

export default orderRoute