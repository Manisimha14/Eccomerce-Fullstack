import Customer from "../models/customer.model.js";
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import RazorpayInstance from "../utils/razorpay.js";
import generateUniqueId from "generate-unique-id"
import crypto from "crypto"
export const createOrder = async (req, res) => {
  try {
    const customer_id = req.customer_id;
    if (!customer_id) {
      return res
        .status(400)
        .json({ message: "First Login and Try to Order The Product" });
    }
    const currentcustomer = await Customer.findById(customer_id);
    if (!currentcustomer) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }
    const { fullName, phone, addressLine1, city, state, pincode } = req.body;
    if (!fullName) {
      return res.status(400).json({
        success: false,
        message: "Full name is required",
      });
    }

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required",
      });
    }

    if (!addressLine1) {
      return res.status(400).json({
        success: false,
        message: "Address is required",
      });
    }

    if (!city) {
      return res.status(400).json({
        success: false,
        message: "City is required",
      });
    }

    if (!state) {
      return res.status(400).json({
        success: false,
        message: "State is required",
      });
    }

    if (!pincode) {
      return res.status(400).json({
        success: false,
        message: "Pincode is required",
      });
    }
    const customerCart = currentcustomer.cart;
    if (customerCart.length == 0) {
      return res.status(400).json({ message: "No Items in The Cart" });
    }
    const orderItems = [];
    let totalAmount = 0;
    for (const p of customerCart) {
      const product = await Product.findById(p.product);
      const availablestock = product.stock;
      if (!product) {
        return res
          .status(400)
          .json({ message: `The ProductId ${p.product} does not exist` });
      }
      if (availablestock < p.quantity) {
        return res.status(400).json({
          message: "The Stock is not sufficient please adjucst the qunatity",
        });
      }
      const { name, price, image } = product;
      totalAmount = totalAmount + product.price * p.quantity;
      orderItems.push({
        product: product._id,
        name: name,
        price: price,
        quantity: p.quantity,
        image: image,
      });
    }
    const recieptId=generateUniqueId()
    const razorpayOrder = await RazorpayInstance.orders.create({
      amount: totalAmount * 100,
      currency: "INR",
      receipt: recieptId,
    });


    const order = await Order.create({
      user: customer_id,
      items: orderItems,
      shippingAddress: {
        fullName: fullName,
        phone: phone,
        addressLine1: addressLine1,
        city: city,
        state: state,
        pincode: pincode,
      },
      totalAmount: totalAmount,
      paymentStatus: "PENDING",
      status: "PENDING_PAYMENT",
      razorpayOrderId:razorpayOrder.id
    });
    return res.status(200).json({message:"Order Created successfully",order:order})
  } catch (error) {
    console.log(error);
    return res.status(200).json({message:"Internal Server Error",error:error})
  }
};
export const verifyPayment = async (req,res)=>{
  try {
    const customer_id = req.customer_id;
    if (!customer_id) {
      return res
        .status(400)
        .json({ message: "First Login and Try to Order The Product" });
    }
    const currentcustomer = await Customer.findById(customer_id);
    if (!currentcustomer) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }
    let customerCart = currentcustomer.cart;
    const {
      orderId,
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
    } = req.body;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }
    const generatedSign = crypto.createHmac(
      "sha256",
      process.env.RAZORPAY_API_SECRET,
    ).update(`${order.razorpayOrderId}|${razorpay_payment_id}`).digest("hex")
    if(generatedSign !==razorpay_signature){
      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    };
    order.razorpayPaymentId = razorpay_payment_id;
    order.paymentStatus = "PAID";
    order.status = "PLACED";
    for(const p of order.items){
      await Product.findByIdAndUpdate(p.product,{$inc:{
        stock:-p.quantity
      }})
    }

    await order.save();
    currentcustomer.cart = [];
    await currentcustomer.save()
    
    return res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      order,
    });

    

  } catch (error) {
    console.log(error)
    return res.status(500).json({message:"Internal Server Error",error:error})
    
  }
}
export const getOrders= async (req,res)=>{
  try {
    const customer_id = req.customer_id;

    if (!customer_id) {
      return res.status(401).json({
        success: false,
        message: "Please login first",
      });
    }
    const orders = await Order.find({ user: customer_id }).sort({
      createdAt: -1,
    });
    return res.status(200).json({
      success: true,
      orders:orders
    });
    
    
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error });
    
  }
}
export const getOrderById = async (req,res)=>{
  try {
    const customer_id = req.customer_id;
    const order_id = req.params.id;
    if (!customer_id) {
      return res.status(401).json({
        success: false,
        message: "Please login first",
      });
    }
    const order = await Order.findOne({
      _id: order_id,
      user: customer_id,
    });
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }
    return res.status(200).json({
      success: true,
      order:order
    });
    
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error });
    
  }

}
