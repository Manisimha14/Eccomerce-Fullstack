
import {  Router } from 'express';
import {createProduct, getAllProducts, getProduct} from "../controllers/products.controller.js"
import { isLoggedin } from '../middlewares/authmiddleware.js';
import upload from './../utils/multer.js';

const productRoutes=Router()
productRoutes.post("/products",isLoggedin, upload.single("image"),createProduct);
productRoutes.get("/products",getAllProducts);
productRoutes.get("/products/:id",getProduct);
export default productRoutes
