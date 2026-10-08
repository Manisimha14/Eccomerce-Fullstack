import express from "express"
import { isLoggedin } from './../middlewares/authmiddleware.js';
import { addToCart, getCart, removeFromCart, upadteCart } from "../controllers/cart.controller.js";
const cartRoutes=express.Router()
cartRoutes.post("/:productId",isLoggedin,addToCart);
cartRoutes.get("/getCart",isLoggedin,getCart)
cartRoutes.patch("/:productId",isLoggedin,upadteCart);
cartRoutes.delete("/:productId",isLoggedin,removeFromCart)
export default cartRoutes
