import express from 'express'
import { createOrder, verifyPayment, razorpayWebhook } from '../controllers/razorpay.controllers.js'
const router = express.Router();

router.post("/create-order", createOrder);
router.post("/verify-payment", verifyPayment);
router.post("/webhook", express.json({ type: "*/*" }), razorpayWebhook);


export default router;