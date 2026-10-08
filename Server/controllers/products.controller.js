import mongoose from "mongoose";
import Product from "../models/product.model.js";
import Customer from "../models/customer.model.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";


export const createProduct = async (req, res) => {
  try {
    const customer_id=req.customer_id
    if(!customer_id){
      return res.status(400).json({message:"First Login and Try to Create The Product"})
    }
    const currentCustomer=await Customer.findById(customer_id)
    if(currentCustomer.role!="Admin"){
      return res.status(404).json({message:"Only Admin Can Add The Products"})
    }
    const { name, description, price, category, stock } = req.body;
    const image=req.file

   
    if (
      !name ||
      !description ||
      price === undefined ||
      !category ||
      !image ||
      stock === undefined
    ) {
      return res.status(400).json({
        message: "All fields are required",
        
      });
    }

    
    if (price <= 0) {
      return res.status(400).json({
        message: "Price must be greater than 0",
      });
    }

    
    if (stock < 0) {
      return res.status(400).json({
        message: "Stock cannot be negative",
      });
    }
    const uplaodedImage= await uploadToCloudinary(image.buffer)

    const product = await Product.create({
      name,
      description,
      price,
      category,
      image:uplaodedImage.secure_url,
      stock,
    });
    console.log(product);
    

    return res.status(201).json({success:true,message:"Created Product Successfully",product:product});
  } catch (error) {
    console.log(error);
    
    return res.status(501).json({
      message: error,
    });
  }
};
export const getAllProducts=async (req,res)=>{
    try {
        const { search, category } = req.query;
        const filter = {};
        if(search){
          filter.name = {
                $regex:search,
                $options:"i"
          };
        }
        if(category){
            filter.category=category

            
        }

        const products = await Product.find(filter);
        if(products.length==0){
            return res.status(400).json({message:"No Products Exist",products:products})
        }
        return res.status(200).json({success:true,message:"products fetched Successfully",products:products})

    } catch (error) {
        return res.status(500).json({message:"Internal Server Error"})
        
    }
}
export const getProduct=async (req,res)=>{
    try {
        const {id}=req.params
        if(!id || id==undefined||! mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({message:"Invalid Product ID"})
        }
        const filteredProduct=await Product.findById(id)
        if(!filteredProduct){
            return res.status(404).json({message:"Product Not Found"})
        }
        return res
          .status(200)
          .json({ success: true, message: "Product Found", product: filteredProduct });

    } catch (error) {
        return res.status(500).json({message:"Internal Server Error"})
        
    }
}


