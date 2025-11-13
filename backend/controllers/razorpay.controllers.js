import { razorpayInstance } from '../utils/razorpayUtils.js'
import dotenv from 'dotenv'
import crypto from 'crypto'

import PaymentStatus from '../models/PaymentStatus.js'

dotenv.config();

export const createOrder = async (req, res) => {
    try {
        const { amount, paymentStatusId } = req.body;
        if (!amount || !paymentStatusId) return res.status(400).json({ message: "Missing fields" });
        const options = {
            amount: amount * 100, // convert to paise
            currency: "INR",
            receipt: `receipt_${paymentStatusId}`,
        };

        const order = await razorpayInstance.orders.create(options);

        return res.status(200).json({
            success: true,
            orderId: order.id,
            amount: order.amount,
            key: process.env.RAZORPAY_KEY,
        })
    } catch (error) {
        console.error("Order creation error:", error);
        res.status(500).json({ message: "Failed to create Razorpay order" });
    }
}

// ✅ Verify Payment (Frontend sends payment details here)
export const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, paymentStatusId, amount } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_SECRET)
            .update(body)
            .digest("hex");

           // console.log("Expected Signature: ", expectedSignature)

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({ message: "Invalid Signature" });
        }

        // ✅ If signature valid, update DB
        const paymentStatus = await PaymentStatus.findById(paymentStatusId);
        if (!paymentStatus) return res.status(404).json({ message: "PaymentStatus not found" });

        paymentStatus.status = "paid";
        paymentStatus.razorpayPaymentId = razorpay_payment_id;
        paymentStatus.amountPaid = amount || 0;
        paymentStatus.paidAt = new Date();
        await paymentStatus.save();

        return res.status(200).json({ message: "Payment verified successfully" });
    } catch (error) {
        console.error("Verify Payment Error:", error);
        res.status(500).json({ message: "Payment verification failed" });
    }
};


// ✅ Razorpay Webhook (optional - auto update)
export const razorpayWebhook = async (req, res) => {
    try {
        const secret = process.env.RAZORPAY_SECRET;
        const shasum = crypto.createHmac("sha256", secret);
        shasum.update(JSON.stringify(req.body));
        const digest = shasum.digest("hex");

        if (digest !== req.headers["x-razorpay-signature"]) {
            return res.status(400).json({ message: "Invalid Signature" })
        }

        const event = req.body.event;
        if (event === "payment.captured") {
            const paymentData = req.body.payload.payment.entity;

            //Extract PaymentStatusId from receipt
            const receipt = paymentData.notes?.paymentStatusId || paymentData.receipt?.split("_")[1];

            const paymentStatus = await PaymentStatus.findById(receipt);
            if (paymentStatus) {
                paymentStatus.status = 'paid';
                paymentStatus.razorpayPaymentId = paymentData.id;
                paymentStatus.amountPaid = paymentData.amount / 100;
                paymentStatus.paidAt = new Date();
                await paymentStatus.save();
            }
        }

        return res.status(200).json({ status: 'ok' })
    } catch (error) {
        console.error("Webhook Error:", error);
        res.status(500).json({ message: "Webhook error" });
    }
}