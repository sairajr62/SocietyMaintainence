import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/dbConfig.js';

import authRoutes from './routes/auth.routes.js';
import societyRoutes from './routes/society.routes.js';
import documentRoutes from './routes/document.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import razorpayRoutes from './routes/razorpay.routes.js';

import path from 'path'

import errorHandler from './middlewares/errorHandler.js';


const app = express();
dotenv.config();


// Connect to MongoDB
connectDB();

app.use(cors({ origin: ["http://localhost:5173","https://maintenance-pro.netlify.app"], credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/society', societyRoutes);
app.use('/api/document', documentRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/razorpay', razorpayRoutes);

const PORT = process.env.PORT || 5000;

app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});