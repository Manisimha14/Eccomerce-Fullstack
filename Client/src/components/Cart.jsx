import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  LockKeyhole,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import { toast } from "react-toastify";
import { useCart } from "../context/useCart.js";
import ProductImage from "./ProductImage.jsx";

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

function Cart() {
  const {
    cart,
    error: cartError,
    itemCount,
    loading,
    usingProfileFallback,
    updateQuantity,
    removeFromCart,
    refreshCart,
  } = useCart();
  const [busyProductId, setBusyProductId] = useState(null);

  const subtotal = cart.reduce((total, item) => {
    const price = Number(item.product?.price);
    return total + (Number.isFinite(price) ? price * Number(item.quantity || 0) : 0);
  }, 0);

  const handleQuantity = async (productId, quantity) => {
    if (!productId || quantity < 1) return;

    try {
      setBusyProductId(productId);
      await updateQuantity(productId, quantity);
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not update the quantity");
    } finally {
      setBusyProductId(null);
    }
  };

  const handleRemove = async (productId) => {
    if (!productId) return;

    try {
      setBusyProductId(productId);
      await removeFromCart(productId);
      toast.success("Item removed from your cart");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not remove this item");
    } finally {
      setBusyProductId(null);
    }
  };

  const handleRetry = async () => {
    try {
      await refreshCart();
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not refresh your cart");
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0b0b0b] px-5 py-7 text-white md:px-10 md:py-10">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:40px_40px]"
      />

      <div className="relative z-10 mx-auto max-w-7xl">
        <header className="flex items-center justify-between border-b-4 border-white pb-5">
          <Link
            to="/products"
            className="inline-flex min-h-11 items-center gap-3 text-xs font-black uppercase tracking-[0.18em] transition-colors hover:text-blue-500 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-500"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to store
          </Link>

          <Link
            to="/"
            className="border-4 border-white bg-blue-500 px-3 py-2 text-sm font-black tracking-tighter text-black shadow-[4px_4px_0px_#ffffff] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-500"
          >
            LAB<span className="text-white">PROJECT</span>
          </Link>
        </header>

        <section className="py-10 md:py-14" aria-labelledby="cart-heading">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"
          >
            <div>
              <p className="mb-3 text-xs font-black uppercase tracking-[0.28em] text-blue-500">
                Your selection / {String(itemCount).padStart(2, "0")}
              </p>
              <h1
                id="cart-heading"
                className="text-6xl font-black uppercase leading-[0.82] tracking-[-0.07em] sm:text-8xl"
              >
                YOUR
                <br />
                CART<span className="text-blue-500">.</span>
              </h1>
            </div>
            <p className="max-w-xs text-sm font-medium leading-relaxed text-zinc-400">
              Everything you picked, all in one place. Adjust quantities or keep
              exploring the collection.
            </p>
          </motion.div>

          {loading ? (
            <div
              role="status"
              className="border-4 border-white bg-[#151515] p-6 shadow-[8px_8px_0px_#3b82f6] md:p-8"
            >
              <span className="sr-only">Loading your cart</span>
              <div className="h-5 w-40 animate-pulse bg-zinc-700" />
              <div className="mt-7 h-28 animate-pulse bg-zinc-800" />
              <div className="mt-4 h-28 animate-pulse bg-zinc-800" />
            </div>
          ) : cartError ? (
            <div
              role="alert"
              className="border-4 border-white bg-[#151515] p-7 shadow-[8px_8px_0px_#3b82f6] md:p-10"
            >
              <p className="text-xs font-black uppercase tracking-[0.25em] text-blue-500">
                Cart unavailable
              </p>
              <h2 className="mt-2 text-3xl font-black uppercase">
                We couldn&apos;t load your cart.
              </h2>
              <p className="mt-3 text-sm text-zinc-400">{cartError}</p>
              <button
                type="button"
                onClick={handleRetry}
                className="mt-6 min-h-12 border-4 border-white bg-blue-500 px-6 font-black uppercase text-black shadow-[5px_5px_0px_#ffffff] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-500"
              >
                Try again
              </button>
            </div>
          ) : cart.length === 0 ? (
            <div className="grid gap-8 border-4 border-white bg-[#151515] p-7 shadow-[8px_8px_0px_#3b82f6] md:grid-cols-[1fr_auto] md:items-center md:p-12">
              <div>
                <div className="mb-6 flex h-16 w-16 items-center justify-center border-4 border-white bg-blue-500 text-black">
                  <ShoppingBag className="h-7 w-7" />
                </div>
                <p className="text-xs font-black uppercase tracking-[0.25em] text-blue-500">
                  Nothing here yet
                </p>
                <h2 className="mt-2 text-3xl font-black uppercase sm:text-4xl">
                  Your cart is empty.
                </h2>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-zinc-400">
                  Find something you love and it will be waiting here when
                  you&apos;re ready.
                </p>
              </div>
              <Link
                to="/products"
                className="inline-flex min-h-12 items-center justify-center gap-3 border-4 border-white bg-blue-500 px-6 font-black uppercase text-black shadow-[5px_5px_0px_#ffffff] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-500"
              >
                Explore products
                <ArrowUpRight className="h-5 w-5" />
              </Link>
            </div>
          ) : (
            <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
              <div className="space-y-4">
                {usingProfileFallback && (
                  <p
                    role="status"
                    className="border-2 border-amber-400 bg-amber-300/10 px-4 py-3 text-xs font-bold leading-relaxed text-amber-200"
                  >
                    The cart service is temporarily unavailable. Your items are
                    being shown from your account.
                  </p>
                )}
                {cart.map((item, index) => {
                  const product =
                    item.product && typeof item.product === "object"
                      ? item.product
                      : null;
                  const productId = product?._id || item.product?._id || item.product;
                  const quantity = Number(item.quantity) || 1;
                  const price = Number(product?.price);
                  const isBusy = busyProductId === productId;

                  return (
                    <motion.article
                      key={productId || index}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="grid gap-5 border-4 border-white bg-[#151515] p-4 shadow-[5px_5px_0px_#3b82f6] sm:grid-cols-[132px_minmax(0,1fr)_auto] sm:items-center sm:p-5"
                    >
                      <div className="aspect-square overflow-hidden border-2 border-white bg-zinc-900 sm:h-[132px]">
                        <ProductImage
                          src={product?.image}
                          alt={product?.name || "Cart item"}
                        />
                      </div>

                      <div className="min-w-0">
                        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-blue-500">
                          Item / {String(index + 1).padStart(2, "0")}
                        </p>
                        <h2 className="mt-2 break-words text-xl font-black uppercase sm:text-2xl">
                          {product?.name || "Unavailable product"}
                        </h2>
                        <p className="mt-2 text-sm text-zinc-400">
                          {Number.isFinite(price)
                            ? currency.format(price)
                            : "Price unavailable"}
                        </p>

                        <div className="mt-5 flex flex-wrap items-center gap-3">
                          <div
                            className="inline-flex items-center border-2 border-white"
                            aria-label={`Quantity: ${quantity}`}
                          >
                            <button
                              type="button"
                              aria-label={`Decrease quantity of ${product?.name || "item"}`}
                              disabled={isBusy || quantity <= 1 || !productId}
                              onClick={() => handleQuantity(productId, quantity - 1)}
                              className="flex h-10 w-10 items-center justify-center transition-colors hover:bg-blue-500 hover:text-black focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="min-w-10 text-center font-mono text-sm font-bold tabular-nums">
                              {quantity}
                            </span>
                            <button
                              type="button"
                              aria-label={`Increase quantity of ${product?.name || "item"}`}
                              disabled={isBusy || !productId}
                              onClick={() => handleQuantity(productId, quantity + 1)}
                              className="flex h-10 w-10 items-center justify-center transition-colors hover:bg-blue-500 hover:text-black focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                          <button
                            type="button"
                            disabled={isBusy || !productId}
                            onClick={() => handleRemove(productId)}
                            className="inline-flex min-h-10 items-center gap-2 px-2 text-xs font-black uppercase tracking-wide text-zinc-400 transition-colors hover:text-red-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <Trash2 className="h-4 w-4" />
                            Remove
                          </button>
                        </div>
                      </div>

                      <p className="text-right text-xl font-black tabular-nums text-white sm:self-start">
                        {Number.isFinite(price)
                          ? currency.format(price * quantity)
                          : "—"}
                      </p>
                    </motion.article>
                  );
                })}
              </div>

              <aside className="border-4 border-white bg-blue-500 p-6 text-black shadow-[8px_8px_0px_#ffffff] lg:sticky lg:top-8">
                <p className="text-xs font-black uppercase tracking-[0.22em]">
                  Order overview
                </p>
                <h2 className="mt-2 text-3xl font-black uppercase">Summary</h2>
                <div className="mt-7 flex justify-between border-t-2 border-black/30 pt-5 text-sm font-bold">
                  <span>Items ({itemCount})</span>
                  <span>{currency.format(subtotal)}</span>
                </div>
                <div className="mt-4 flex justify-between border-t-2 border-black pt-5 text-lg font-black uppercase">
                  <span>Subtotal</span>
                  <span className="tabular-nums">{currency.format(subtotal)}</span>
                </div>
                <p className="mt-4 text-xs font-medium leading-relaxed text-black/70">
                  Shipping and any applicable taxes are calculated separately.
                </p>
                <Link
                  to="/checkout"
                  className="mt-7 flex min-h-12 items-center justify-center gap-2 border-4 border-black bg-white px-4 text-sm font-black uppercase shadow-[5px_5px_0px_#000000] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                >
                  Continue to checkout
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/products"
                  className="mt-4 flex min-h-12 items-center justify-center gap-2 border-2 border-black bg-transparent px-4 text-sm font-black uppercase transition-colors hover:bg-black hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                >
                  Continue shopping
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
                <p className="mt-5 flex items-center justify-center gap-2 text-xs font-bold uppercase">
                  <LockKeyhole className="h-4 w-4" />
                  Secure payment with Razorpay
                </p>
              </aside>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default Cart;
