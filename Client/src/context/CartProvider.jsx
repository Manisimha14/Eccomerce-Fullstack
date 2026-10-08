import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import customerContext from "./customercontext.js";
import cartContext from "./cartcontext.js";
import {
  authinstance,
  cartInstance,
  productsinstance,
} from "../lib/axiosinstance";

async function getCartFromCustomerProfile() {
  const response = await authinstance.get("/me");
  const customerCart = response.data.Customer?.cart;

  if (!Array.isArray(customerCart)) {
    throw new Error("Your account did not return a valid cart");
  }

  return Promise.all(
    customerCart.map(async (item) => {
      const product =
        item.product && typeof item.product === "object" && item.product.name
          ? item.product
          : null;

      if (product) return { ...item, product };

      const productId =
        typeof item.product === "string" ? item.product : item.product?._id;

      if (!productId) {
        throw new Error("A cart item is missing its product information");
      }

      const productResponse = await productsinstance.get(
        `/products/${productId}`,
      );

      return { ...item, product: productResponse.data.product };
    }),
  );
}

function CartProvider({ children }) {
  const { customer, loading: customerLoading } = useContext(customerContext);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cartCustomerId, setCartCustomerId] = useState(null);
  const [usingProfileFallback, setUsingProfileFallback] = useState(false);
  const customerId = customer?._id;

  const refreshCart = useCallback(async () => {
    try {
      const response = await cartInstance.get("/getCart");
      if (!Array.isArray(response.data.cart)) {
        throw new Error("The cart service returned an invalid response");
      }
      setCart(response.data.cart);
      setCartCustomerId(customerId);
      setUsingProfileFallback(false);
      setError("");
      return response.data.cart;
    } catch (requestError) {
      console.warn(
        "Cart service request failed; loading the cart from the customer profile instead.",
        requestError,
      );

      try {
        const profileCart = await getCartFromCustomerProfile();
        setCart(profileCart);
        setCartCustomerId(customerId);
        setUsingProfileFallback(true);
        setError("");
        return profileCart;
      } catch (fallbackError) {
        setUsingProfileFallback(false);
        setError(
          fallbackError.response?.data?.message ||
            fallbackError.message ||
            requestError.response?.data?.message ||
            "Failed to load your cart",
        );
        throw fallbackError;
      }
    }
  }, [customerId]);

  useEffect(() => {
    if (customerLoading || !customerId) return;

    let isCurrent = true;

    const loadCart = async () => {
      try {
        await refreshCart();
      } catch {
        if (isCurrent) setCartCustomerId(customerId);
      } finally {
        if (isCurrent) setLoading(false);
      }
    };

    loadCart();
    return () => {
      isCurrent = false;
    };
  }, [customerId, customerLoading, refreshCart]);

  const addToCart = useCallback(
    async (productId) => {
      const response = await cartInstance.post(`/${productId}`);
      await refreshCart();
      return response.data;
    },
    [refreshCart],
  );

  const updateQuantity = useCallback(
    async (productId, quantity) => {
      const response = await cartInstance.patch(`/${productId}`, { quantity });
      await refreshCart();
      return response.data;
    },
    [refreshCart],
  );

  const removeFromCart = useCallback(
    async (productId) => {
      const response = await cartInstance.delete(`/${productId}`);
      await refreshCart();
      return response.data;
    },
    [refreshCart],
  );

  const itemCount = useMemo(
    () =>
      cartCustomerId === customerId
        ? cart.reduce((count, item) => count + (Number(item.quantity) || 0), 0)
        : 0,
    [cart, cartCustomerId, customerId],
  );

  const value = useMemo(
    () => ({
      cart: cartCustomerId === customerId ? cart : [],
      error: cartCustomerId === customerId ? error : "",
      usingProfileFallback:
        cartCustomerId === customerId && usingProfileFallback,
      itemCount,
      loading: customerLoading || (Boolean(customerId) && (loading || cartCustomerId !== customerId)),
      refreshCart,
      addToCart,
      updateQuantity,
      removeFromCart,
    }),
    [
      cart,
      cartCustomerId,
      customerId,
      error,
      usingProfileFallback,
      itemCount,
      customerLoading,
      loading,
      refreshCart,
      addToCart,
      updateQuantity,
      removeFromCart,
    ],
  );

  return <cartContext.Provider value={value}>{children}</cartContext.Provider>;
}

export default CartProvider;
