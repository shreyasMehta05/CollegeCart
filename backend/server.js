// backend/server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import productRoutes from "./routes/productRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import authRoutes from './routes/authRoutes.js';
import cookieParser from "cookie-parser";
import supportRoutes from "./routes/supportRoutes.js";
import productUserRoutes from "./routes/productUserRoutes.js";
import { protect } from "./middleware/auth.js";
import chatbotController from "./controllers/chatbotController.js";
dotenv.config();

const app = express();

// app.use(cors({
//     origin: process.env.FRONTEND_URL,
//     credentials: true
// }));
app.use(cookieParser());
app.use(cors({
    origin: process.env.FRONTEND_URL, // Use FRONTEND_URL from .env
    credentials: true, // Allow credentials (cookies)
}));

app.use(express.json());

// Route Handlers
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/users', userRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/product', productUserRoutes);



app.post('/api/chat', protect, chatbotController);

// Route Handlers
console.log("Starting the server!");
// app.use("/api/products", productRoutes);



// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        message: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

console.log("FRONTEND_URL:", process.env.FRONTEND_URL);

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    // Start server only after successful DB connection
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
