import express from "express"
import { addTowhishlist, customerProfile, getWishList, loginCustomer, logoutCustomer, registerCustomer, wishlishDelete } from "../controllers/customer.controller.js"
import { isLoggedin } from "../middlewares/authmiddleware.js"
const customerRoutes=express.Router()
customerRoutes.post("/register",registerCustomer)
customerRoutes.post("/login",loginCustomer)
customerRoutes.post("/logout",logoutCustomer)
customerRoutes.get("/me",isLoggedin,customerProfile)
customerRoutes.post("/wishlist/:productId",isLoggedin,addTowhishlist)
customerRoutes.get("/wishlist",isLoggedin,getWishList)
customerRoutes.delete("/wishlist/:productId",isLoggedin,wishlishDelete)
export default customerRoutes;
