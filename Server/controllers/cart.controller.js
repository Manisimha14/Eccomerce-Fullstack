import Customer from "../models/customer.model.js";
import Product from "../models/product.model.js";

export const addToCart = async (req, res) => {
  try {
    const customer_id = req.customer_id;
    if (!customer_id) {
      return res
        .status(400)
        .json({ message: "First Login and Try to Create The Product" });
    }
    const { productId } = req.params;
    const currentproduct = await Product.findById(productId);
    if (!currentproduct) {
      return res.status(404).json({
        message: "Product not found",
      });
    }
    if (currentproduct.stock <= 0) {
      return res.status(400).json({ message: "Sorry The Stock Is Unaviable" });
    }
    const currentcustomer = await Customer.findById(customer_id);
    const currentCart = currentcustomer.cart;
    const product = currentCart.find((p) => {
      return p.product._id.toString() == productId;
    });
    if (product) {
      product.quantity = product.quantity + 1;
    } else {
      currentCart.push({ product: productId, quantity: 1 });
    }
    await currentcustomer.save();
    return res
      .status(200)
      .json({ message: "Cart Updated Successfully", cart: currentCart });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error });
  }
};
export const getCart = async (req, res) => {
  try {
    const customer_id = req.customer_id;
    if (!customer_id) {
      return res
        .status(400)
        .json({ message: "First Login and Try to Create The Product" });
    }
    const currentcustomer = await Customer.findById(customer_id);
    if (!currentcustomer) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }
    await currentcustomer.populate("cart.product", "name price image");
    return res.status(201).json({
      message: "Fetched Cart Successfully",
      cart: currentcustomer.cart,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error });
  }
};
export const upadteCart = async (req, res) => {
  try {
    const customer_id = req.customer_id;
    const { quantity } = req.body;
    if (quantity <= 0) {
      return res
        .status(400)
        .json({ message: "The quantity Must Be greater Than 0" });
    }

    if (!customer_id) {
      return res
        .status(400)
        .json({ message: "First Login and Try to Create The Product" });
    }
    const { productId } = req.params;
    const currentproduct = await Product.findById(productId);
    if (!currentproduct) {
      return res.status(404).json({ message: "No Product Found" });
    }
    const currentcustomer = await Customer.findById(customer_id);
    if (!currentcustomer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    const currentCart = currentcustomer.cart;
    const product = currentCart.find((p) => {
      return p.product.toString() === productId;
    });
    if (!product) {
      return res
        .status(404)
        .json({ message: "The Product Is Not in The cart" });
    }
    if (quantity > currentproduct.stock) {
      return res.status(400).json({ message: "Sorry The Stock Is Unaviable" });
    }
    product.quantity = quantity;
    await currentcustomer.save();
    await currentcustomer.populate("cart.product", "name price image");
    return res
      .status(201)
      .json({ message: "Updated SuccessFuly", cart: currentcustomer.cart });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error });
  }
};
export const removeFromCart = async (req, res) => {
  try {
    const customer_id = req.customer_id;

    if (!customer_id) {
      return res.status(400).json({
        message: "First Login and Try to Remove The Product",
      });
    }

    const { productId } = req.params;

    const currentcustomer = await Customer.findById(customer_id);

    if (!currentcustomer) {
      return res.status(404).json({
        message: "Customer Not Found",
      });
    }

    const currentCart = currentcustomer.cart;

    const product = currentCart.find((p) => p.product.toString() === productId);

    if (!product) {
      return res.status(404).json({
        message: "The Product Is Not in The Cart",
      });
    }

    currentcustomer.cart = currentCart.filter(
      (p) => p.product.toString() !== productId,
    );

    await currentcustomer.save();

    return res.status(200).json({
      message: "Product Removed From Cart Successfully",
      cart: currentcustomer.cart,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error,
    });
  }
};