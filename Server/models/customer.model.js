
import mongoose from "mongoose";
import Product from "./product.model.js";
const customerSchema= new mongoose.Schema({
    fullname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    wishlist:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:Product
    }

    ],
    cart:[{
        product:{
            type:mongoose.Schema.Types.ObjectId,
            ref:Product,
            required:true
        },
        quantity:{
            type:Number,
            default:1,
            min:1
        }
    }],
    role:{
        type:String,
        default:"Admin"

    }

},{timestamps:true})
const Customer= mongoose.model("Customer",customerSchema)
export default Customer