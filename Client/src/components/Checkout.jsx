import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, LockKeyhole, PackageCheck } from "lucide-react";
import { toast } from "react-toastify";
import { ordersInstance } from "../lib/axiosinstance";
import { useCart } from "../context/useCart.js";
import customerContext from "../context/customercontext.js";
import ProductImage from "./ProductImage.jsx";

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
});

const checkoutScriptUrl = "https://checkout.razorpay.com/v1/checkout.js";
const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;

function loadRazorpay() {
  if (window.Razorpay) return Promise.resolve();

  return new Promise((resolve, reject) => {
    const existingScript = document.querySelector(
      `script[src="${checkoutScriptUrl}"]`,
    );
    const script = existingScript || document.createElement("script");
    const handleLoad = () => (window.Razorpay ? resolve() : reject(new Error("Razorpay checkout did not load")));
    const handleError = () => {
      script.remove();
      reject(new Error("Could not load Razorpay checkout"));
    };

    script.addEventListener("load", handleLoad, { once: true });
    script.addEventListener("error", handleError, { once: true });
    if (!existingScript) {
      script.src = checkoutScriptUrl;
      script.async = true;
      document.body.appendChild(script);
    }
  });
}

function Checkout() {
  const { customer } = useContext(customerContext);
  const { cart, error: cartError, loading, refreshCart } = useCart();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    fullName: customer?.fullname || "",
    phone: customer?.phone || "",
    addressLine1: "",
    city: "",
    state: "",
    pincode: "",
  });

  const subtotal = cart.reduce((total, item) => {
    const price = Number(item.product?.price);
    return total + (Number.isFinite(price) ? price * Number(item.quantity || 0) : 0);
  }, 0);

  const updateField = (event) => {
    const { name, value } = event.target;
    setShippingAddress((current) => ({ ...current, [name]: value }));
  };

  const verifyPayment = async (orderId, paymentResponse) => {
    try {
      const response = await ordersInstance.post("/verify-payment", {
        orderId,
        razorpay_payment_id: paymentResponse.razorpay_payment_id,
        razorpay_order_id: paymentResponse.razorpay_order_id,
        razorpay_signature: paymentResponse.razorpay_signature,
      });
      try {
        await refreshCart();
      } catch {
        toast.warning("Payment confirmed. Your cart may take a moment to refresh.");
      }
      navigate(`/order-success/${response.data.order._id}`);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "We could not verify your payment. Please contact support if money was deducted.",
      );
      setIsProcessing(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isProcessing) return;

    setIsProcessing(true);
    try {
      await loadRazorpay();
      const response = await ordersInstance.post(
        "/create-payment-order",
        shippingAddress,
      );
      if (!response.data?.order) {
        if (import.meta.env.DEV && response.data?.error) {
          console.error("Order creation failed:", response.data.error);
        }
        throw new Error(
          response.data?.message || "The server could not create your order.",
        );
      }
      const order = response.data?.order;
      const payment = response.data?.payment;
      const razorpayOrderId = payment?.orderId || order?.razorpayOrderId;
      const amount = payment?.amount ?? Math.round(Number(order?.totalAmount) * 100);
      const key = payment?.key || razorpayKey;
      if (!order?._id || !razorpayOrderId || !Number.isFinite(amount) || amount <= 0) {
        throw new Error(
          response.data?.message || "The server returned incomplete order details.",
        );
      }
      if (!key) {
        throw new Error(
          "Razorpay key is not configured. Set VITE_RAZORPAY_KEY_ID in Client/.env and restart the frontend.",
        );
      }

      const checkout = new window.Razorpay({
        key,
        amount,
        currency: payment?.currency || "INR",
        name: "LabProject",
        description: `Order ${order._id}`,
        order_id: razorpayOrderId,
        prefill: {
          name: shippingAddress.fullName,
          contact: shippingAddress.phone,
          email: customer?.email || "",
        },
        notes: { orderId: order._id },
        theme: { color: "#3b82f6" },
        handler: (paymentResponse) => verifyPayment(order._id, paymentResponse),
        modal: {
          ondismiss: () => setIsProcessing(false),
        },
      });
      checkout.on("payment.failed", (paymentFailure) => {
        toast.error(
          paymentFailure.error?.description || "Payment failed. Please try again.",
        );
        setIsProcessing(false);
      });
      checkout.open();
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message || "Could not start checkout",
      );
      setIsProcessing(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0b0b0b] px-5 py-7 text-white md:px-10 md:py-10">
      <div className="mx-auto max-w-7xl">
        <header className="flex items-center justify-between border-b-4 border-white pb-5">
          <Link
            to="/cart"
            className="inline-flex min-h-11 items-center gap-3 text-xs font-black uppercase tracking-[0.18em] transition-colors hover:text-blue-500 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-500"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to cart
          </Link>
          <Link
            to="/"
            className="border-4 border-white bg-blue-500 px-3 py-2 text-sm font-black tracking-tighter text-black shadow-[4px_4px_0px_#ffffff] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-500"
          >
            LAB<span className="text-white">PROJECT</span>
          </Link>
        </header>

        <section className="py-10 md:py-14" aria-labelledby="checkout-heading">
          <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-3 text-xs font-black uppercase tracking-[0.28em] text-blue-500">
                Final step / Secure checkout
              </p>
              <h1
                id="checkout-heading"
                className="text-6xl font-black uppercase leading-[0.82] tracking-[-0.07em] sm:text-8xl"
              >
                CHECK
                <br />
                OUT<span className="text-blue-500">.</span>
              </h1>
            </div>
            <p className="max-w-xs text-sm font-medium leading-relaxed text-zinc-400">
              Add your delivery details, review your items, and pay securely to
              place your order.
            </p>
          </div>

          {loading ? (
            <div
              role="status"
              className="border-4 border-white bg-[#151515] p-6 shadow-[8px_8px_0px_#3b82f6] md:p-8"
            >
              <span className="sr-only">Loading your cart</span>
              <div className="h-5 w-40 animate-pulse bg-zinc-700" />
              <div className="mt-7 h-28 animate-pulse bg-zinc-800" />
            </div>
          ) : cartError ? (
            <div role="alert" className="border-4 border-white bg-[#151515] p-7 shadow-[8px_8px_0px_#3b82f6]">
              <h2 className="text-2xl font-black uppercase">Your cart could not be loaded.</h2>
              <p className="mt-3 text-sm text-zinc-400">{cartError}</p>
              <Link
                to="/cart"
                className="mt-6 inline-flex min-h-12 items-center gap-2 border-4 border-white bg-blue-500 px-5 font-black uppercase text-black shadow-[5px_5px_0px_#ffffff] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-500"
              >
                Return to cart
              </Link>
            </div>
          ) : cart.length === 0 ? (
            <div className="border-4 border-white bg-[#151515] p-7 shadow-[8px_8px_0px_#3b82f6] md:p-10">
              <p className="text-xs font-black uppercase tracking-[0.25em] text-blue-500">
                Nothing to check out
              </p>
              <h2 className="mt-2 text-3xl font-black uppercase">Your cart is empty.</h2>
              <Link
                to="/products"
                className="mt-6 inline-flex min-h-12 items-center gap-2 border-4 border-white bg-blue-500 px-5 font-black uppercase text-black shadow-[5px_5px_0px_#ffffff] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-500"
              >
                Explore products
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
              <form
                id="checkout-form"
                onSubmit={handleSubmit}
                className="border-4 border-white bg-[#151515] p-5 shadow-[6px_6px_0px_#3b82f6] md:p-8"
              >
                <div className="mb-7 border-b-2 border-zinc-700 pb-5">
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-500">
                    Delivery / 01
                  </p>
                  <h2 className="mt-2 text-2xl font-black uppercase">Shipping address</h2>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  {[
                    { name: "fullName", label: "Full name", autocomplete: "name" },
                    {
                      name: "phone",
                      label: "Phone number",
                      autocomplete: "tel",
                      type: "tel",
                      pattern: "[+]?[0-9]{10,15}",
                    },
                    { name: "addressLine1", label: "Street address", autocomplete: "street-address", wide: true },
                    { name: "city", label: "City", autocomplete: "address-level2" },
                    { name: "state", label: "State", autocomplete: "address-level1" },
                    {
                      name: "pincode",
                      label: "Pincode",
                      autocomplete: "postal-code",
                      inputMode: "numeric",
                      pattern: "[0-9]{6}",
                      maxLength: 6,
                    },
                  ].map((field) => (
                    <label
                      key={field.name}
                      className={`block text-xs font-black uppercase tracking-[0.12em] text-zinc-300 ${field.wide ? "sm:col-span-2" : ""}`}
                    >
                      {field.label}
                      <input
                        required
                        name={field.name}
                        type={field.type || "text"}
                        autoComplete={field.autocomplete}
                        inputMode={field.inputMode}
                        pattern={field.pattern}
                        maxLength={field.maxLength}
                        value={shippingAddress[field.name]}
                        onChange={updateField}
                        className="mt-2 h-12 w-full border-2 border-white bg-white px-3 text-sm font-bold normal-case tracking-normal text-black outline-none placeholder:text-zinc-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                      />
                    </label>
                  ))}
                </div>

                <div className="mt-8 flex items-start gap-3 border-t-2 border-zinc-700 pt-6 text-sm text-zinc-300">
                  <PackageCheck className="mt-0.5 h-5 w-5 shrink-0 text-blue-500" />
                  <p>
                    Your order total is calculated from current product prices.
                    You can review the total before opening Razorpay.
                  </p>
                </div>
              </form>

              <aside className="border-4 border-white bg-blue-500 p-6 text-black shadow-[8px_8px_0px_#ffffff] lg:sticky lg:top-8">
                <p className="text-xs font-black uppercase tracking-[0.22em]">
                  Order overview
                </p>
                <h2 className="mt-2 text-3xl font-black uppercase">Your items</h2>
                <div className="mt-6 max-h-80 space-y-4 overflow-y-auto border-y-2 border-black/40 py-5">
                  {cart.map((item, index) => {
                    const product = item.product;
                    const quantity = Number(item.quantity) || 0;
                    const price = Number(product?.price);
                    return (
                      <div
                        key={product?._id || index}
                        className="grid grid-cols-[56px_minmax(0,1fr)_auto] items-center gap-3"
                      >
                        <div className="h-14 w-14 overflow-hidden border-2 border-black bg-white">
                          <ProductImage src={product?.image} alt={product?.name || "Cart item"} />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-xs font-black uppercase">{product?.name || "Unavailable product"}</p>
                          <p className="mt-1 text-xs font-bold text-black/70">
                            Qty {quantity} · {currency.format(price || 0)}
                          </p>
                        </div>
                        <p className="text-sm font-black tabular-nums">
                          {currency.format((price || 0) * quantity)}
                        </p>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-5 flex justify-between border-b-2 border-black/40 pb-4 text-sm font-bold">
                  <span>Items ({cart.reduce((count, item) => count + (Number(item.quantity) || 0), 0)})</span>
                  <span>{currency.format(subtotal)}</span>
                </div>
                <div className="mt-4 flex justify-between text-lg font-black uppercase">
                  <span>Total</span>
                  <span className="tabular-nums">{currency.format(subtotal)}</span>
                </div>
                <p className="mt-3 text-xs font-medium leading-relaxed text-black/70">
                  Shipping is included. Payment is processed securely by Razorpay.
                </p>
                <button
                  type="submit"
                  form="checkout-form"
                  disabled={isProcessing}
                  className="mt-7 flex min-h-12 w-full items-center justify-center gap-2 border-4 border-black bg-white px-4 text-sm font-black uppercase shadow-[5px_5px_0px_#000000] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <LockKeyhole className="h-4 w-4" />
                  {isProcessing ? "Opening payment..." : "Pay securely"}
                </button>
              </aside>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default Checkout;
