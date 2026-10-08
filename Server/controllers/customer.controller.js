import genToken from "../middlewares/genToken.js";
import Customer from "../models/customer.model.js";
import bcrypt from "bcrypt";
import Product from "../models/product.model.js";
import mongoose from "mongoose";
const cookieOptions = {
  httpOnly: true,
};
export const registerCustomer = async (req, res) => {
  try {
    const { fullname, email, password, phone } = req.body;
    if (!fullname || !email || !password || !phone) {
      return res.status(400).json({ message: "All fields are mandatory" });
    }
    const customerExist = await Customer.findOne({ email });
    if (customerExist) {
      return res.status(409).json({ message: "Email already exists" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password too short" });
    }
    const hashedpass = bcrypt.hashSync(password, 10);
    const newCustomer = await Customer.create({
      fullname,
      email,
      password: hashedpass,
      phone,
    });

    const token = genToken(newCustomer._id);
    res.cookie("jwttoken", token, cookieOptions);
    res.status(200).json({
      sucess: true,
      message: "Customer Registered Successfully",
      customer: newCustomer,
    });
  } catch (error) {
    res.status(501).json({ message: "Internal server error" });
  }
};
export const loginCustomer = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "No email or Password" });
    }
    const customerExists = await Customer.findOne({ email });
    if (!customerExists) {
      return res.status(409).json({ message: "No Customer Exists" });
    }
    const correctpass = bcrypt.compareSync(password, customerExists.password);
    if (correctpass) {
      const token = genToken(customerExists._id);
      res.cookie("jwttoken", token, cookieOptions);
      return res
        .status(200)
        .json({ success: true, message: "Login Successful" });
    } else if (!correctpass) {
      return res.status(401).json({ message: "Incorrect Credentials" });
    }
  } catch (error) {
    res.status(501).json({ message: "Internal server Error" });
  }
};
export const logoutCustomer = async (req, res) => {
  try {
    res.clearCookie("jwttoken");
    res.status(200).json({ success: true, message: "Logged out Successfully" });
  } catch (error) {
    res.status(501).json({ message: "Internal Server error" });
  }
};
export const customerProfile = async (req, res) => {
  try {
    const customer_id = req.customer_id;
    const customerExists = await Customer.findById(customer_id);
    if (!customerExists) {
      return res.status(404).json({ message: "Customer Not Found" });
    }
    res.json({
      success: true,
      message: "User Found",
      Customer: customerExists,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const addTowhishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    const customer_id = req.customer_id;
    if (!customer_id) {
      return res
        .status(404)
        .json({ message: "Not Authenticated Please Login" });
    }
    if (!mongoose.isValidObjectId(productId)) {
      return res.status(400).json({ message: "Invalid ProductId" });
    }
    const whishlistedProduct = await Product.findById(productId);
    if (!whishlistedProduct) {
      return res.status(400).json({ message: "No Such Product Exist" });
    }
    const currentUser = await Customer.findById(customer_id);
    if (
      currentUser.wishlist.some((product_ids) => {
        return product_ids.equals(productId);
      })
    ) {
      return res
        .status(409)
        .json({ message: "The Product Already Exists in the Whishlist" });
    } else {
      currentUser.wishlist.addToSet(whishlistedProduct);
      await currentUser.save();
      return res.status(201).json({
        success: true,
        message: "Item Added To WishList Successfully",
        wishlist: currentUser.wishlist,
      });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error });
  }
};
export const getWishList = async (req, res) => {
  try {
    const customer_id = req.customer_id;
    const { search, sort } = req.query;

    if (!customer_id) {
      return res
        .status(404)
        .json({ message: "Not Authenticated Please Login" });
    }
    const current_customer = await Customer.findById(customer_id);
    if (!current_customer) {
      return res.status(400).json({ message: "No Customer Exists" });
    }
    if (current_customer.wishlist.length == 0) {
      return res.status(404).json({ message: "No Products in Wishlist" });
    }

    if (search != undefined) {
      let customer_wishlist = await Customer.findById(customer_id).populate({
        path: "wishlist",
        match: { name: { $regex: search } },
      });
      return res.status(200).json({
        success: true,
        message: "Fetched Wishlist Success",
        wishlist: customer_wishlist.wishlist,
      });
    }
    if (sort != undefined && sort == "asc") {
      let customer_wishlist = await Customer.findById(customer_id).populate({
        path: "wishlist",
        options: { sort: { price: 1 } },
      });
      return res.status(200).json({
        success: true,
        message: "Fetched Wishlist Success",
        wishlist: customer_wishlist.wishlist,
      });
    }
    if (sort != undefined && sort == "desc") {
      let customer_wishlist = await Customer.findById(customer_id).populate({
        path: "wishlist",
        options: { sort: { price: -1 } },
      });
      return res.status(200).json({
        success: true,
        message: "Fetched Wishlist Success",
        wishlist: customer_wishlist.wishlist,
      });
    }

    if (search == undefined && sort == undefined) {
      let customer_wishlist = await Customer.findById(customer_id).populate({
        path: "wishlist",
      });
      return res.status(200).json({
        success: true,
        message: "Fetched Wishlist Success",
        wishlist: customer_wishlist.wishlist,
      });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error });
  }
};
export const wishlishDelete = async (req, res) => {
  try {
    const { productId } = req.params;

    const customer_id = req.customer_id;
    if (!customer_id) {
      return res
        .status(404)
        .json({ message: "Not Authenticated Please Login" });
    }
    if (!mongoose.isValidObjectId(productId)) {
      return res.status(400).json({ message: "Invalid ProductId" });
    }
    const whishlistedProduct = await Product.findById(productId);
    if (!whishlistedProduct) {
      return res.status(400).json({ message: "No Such Product Exist" });
    }
    const currentUser = await Customer.findById(customer_id);
    if (
      !currentUser.wishlist.some((product_ids) => {
        return product_ids.equals(productId);
      })
    ) {
      return res
        .status(409)
        .json({ message: "The Product Does Not Exist in the wishlist" });
    }
    await currentUser.wishlist.pull(productId);
    currentUser.save();
    return res
      .status(200)
      .json({
        message: "Deleted Successfully",
        wishlist: currentUser.wishlist,
      });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error });
  }
};
