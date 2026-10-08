import express from "express"
import {
  createOrder,
  getOrderById,
  getOrders,
  verifyPayment,
} from "../controllers/order.controller.js";
import { isLoggedin } from "../middlewares/authmiddleware.js";

const orderRoutes = express.Router();

orderRoutes.post("/create-payment-order", isLoggedin, createOrder);
orderRoutes.post("/verify-payment", isLoggedin, verifyPayment);
orderRoutes.get("/", isLoggedin, getOrders);
orderRoutes.get("/:id", isLoggedin, getOrderById);

export default orderRoutes