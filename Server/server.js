import express from "express"
import cors from"cors"
import cookieParser from "cookie-parser"
import mongoose from "mongoose"
import "dotenv/config";
import customerRoutes from "./routes/customer.routes.js";
import productRoutes from "./routes/products.routes.js";
import cartRoutes from "./routes/cart.routes.js";

import orderRoutes from "./routes/order.routes.js";
const app=express()
app.use(express.json())
app.use(cookieParser())
app.use(cors())
app.use("/api", productRoutes);
app.use("/api/customer", customerRoutes);
app.use("/api/cart",cartRoutes)
app.use("/api/orders",orderRoutes)
const port=process.env.PORT || 9000
app.listen(port,()=>{
    console.log("Server is listening on the port"+port);
    
})
mongoose.connect(process.env.MONGODB_URI).then(()=>{
    console.log("DB Connected");
    
}).catch((e)=>{
    console.log(e);
    
})
app.get("/",(req,res)=>{
    res.send("Server is ready")
})
