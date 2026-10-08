import { useContext } from "react";
import cartContext from "./cartcontext.js";

export function useCart() {
  const context = useContext(cartContext);
  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return context;
}
