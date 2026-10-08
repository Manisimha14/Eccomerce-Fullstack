import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  CircleAlert,
  PackageCheck,
} from "lucide-react";
import { ordersInstance } from "../lib/axiosinstance";
import ProductImage from "./ProductImage.jsx";

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
});

function OrderDetails() {
  const { id } = useParams();
  const location = useLocation();
  const isSuccessRoute = location.pathname.startsWith("/order-success/");
  const [result, setResult] = useState({ id: null, order: null, error: "" });

  useEffect(() => {
    let isCurrent = true;
    ordersInstance
      .get(`/${id}`)
      .then((response) => {
        if (isCurrent) {
          setResult({ id, order: response.data.order, error: "" });
        }
      })
      .catch((requestError) => {
        if (isCurrent) {
          setResult({
            id,
            order: null,
            error:
              requestError.response?.data?.message || "Could not load this order",
          });
        }
      });
    return () => {
      isCurrent = false;
    };
  }, [id]);

  const loading = result.id !== id;
  const order = loading ? null : result.order;
  const error = loading ? "" : result.error;
  const isPaid = order?.paymentStatus === "PAID";
  const orderDate = order?.createdAt
    ? new Intl.DateTimeFormat("en-IN", {
        dateStyle: "long",
        timeStyle: "short",
      }).format(new Date(order.createdAt))
    : "";

  return (
    <main className="min-h-screen bg-[#0b0b0b] px-5 py-7 text-white md:px-10 md:py-10">
      <div className="mx-auto max-w-7xl">
        <header className="flex items-center justify-between border-b-4 border-white pb-5">
          <Link
            to={isSuccessRoute ? "/products" : "/orders"}
            className="inline-flex min-h-11 items-center gap-3 text-xs font-black uppercase tracking-[0.18em] transition-colors hover:text-blue-500 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-500"
          >
            <ArrowLeft className="h-5 w-5" />
            {isSuccessRoute ? "Back to store" : "All orders"}
          </Link>
          <Link
            to="/"
            className="border-4 border-white bg-blue-500 px-3 py-2 text-sm font-black tracking-tighter text-black shadow-[4px_4px_0px_#ffffff] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-500"
          >
            LAB<span className="text-white">PROJECT</span>
          </Link>
        </header>

        <section className="py-10 md:py-14" aria-labelledby="order-heading">
          {loading ? (
            <div
              role="status"
              className="border-4 border-white bg-[#151515] p-6 shadow-[8px_8px_0px_#3b82f6]"
            >
              <span className="sr-only">Loading order details</span>
              <div className="h-5 w-40 animate-pulse bg-zinc-700" />
              <div className="mt-7 h-36 animate-pulse bg-zinc-800" />
            </div>
          ) : error ? (
            <div role="alert" className="border-4 border-white bg-[#151515] p-7 shadow-[8px_8px_0px_#3b82f6]">
              <CircleAlert className="h-8 w-8 text-blue-500" />
              <h1 className="mt-4 text-3xl font-black uppercase">{error}</h1>
              <Link
                to="/orders"
                className="mt-6 inline-flex min-h-12 items-center gap-2 border-4 border-white bg-blue-500 px-5 font-black uppercase text-black shadow-[5px_5px_0px_#ffffff] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-500"
              >
                Back to orders
              </Link>
            </div>
          ) : order ? (
            <>
              {isSuccessRoute && (
                <div
                  role={isPaid ? "status" : "alert"}
                  className={`mb-8 flex items-center gap-4 border-4 border-white p-5 shadow-[6px_6px_0px_#3b82f6] ${
                    isPaid ? "bg-blue-500 text-black" : "bg-[#151515] text-white"
                  }`}
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center border-2 border-current">
                    {isPaid ? <Check className="h-7 w-7" /> : <CircleAlert className="h-7 w-7" />}
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.22em]">
                      {isPaid ? "Payment confirmed" : "Payment not confirmed"}
                    </p>
                    <h2 className="mt-1 text-2xl font-black uppercase">
                      {isPaid ? "Your order is placed." : "Your order is not complete."}
                    </h2>
                  </div>
                </div>
              )}

              <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="mb-3 text-xs font-black uppercase tracking-[0.28em] text-blue-500">
                    {isSuccessRoute ? "Order confirmation" : "Your account / Order details"}
                  </p>
                  <h1
                    id="order-heading"
                    className="text-5xl font-black uppercase leading-[0.88] tracking-[-0.07em] sm:text-7xl"
                  >
                    ORDER
                    <br />
                    DETAILS<span className="text-blue-500">.</span>
                  </h1>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500">
                    Order / {orderDate}
                  </p>
                  <p className="mt-2 break-all font-mono text-xs text-zinc-300">{order._id}</p>
                </div>
              </div>

              <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
                <div className="space-y-6">
                  <section className="border-4 border-white bg-[#151515] p-5 shadow-[5px_5px_0px_#3b82f6] md:p-7">
                    <div className="flex flex-col gap-4 border-b-2 border-zinc-700 pb-5 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-500">
                          Fulfillment
                        </p>
                        <h2 className="mt-2 text-2xl font-black uppercase">
                          {String(order.status || "PENDING").replaceAll("_", " ")}
                        </h2>
                      </div>
                      <p className="border-2 border-blue-500 px-3 py-2 text-xs font-black uppercase text-blue-400">
                        Payment {order.paymentStatus || "PENDING"}
                      </p>
                    </div>

                    <h3 className="mt-6 text-xs font-black uppercase tracking-[0.22em] text-zinc-400">
                      Items / {order.items?.length || 0}
                    </h3>
                    <div className="mt-4 space-y-4">
                      {(order.items || []).map((item, index) => (
                        <article
                          key={`${item.product || item.name}-${index}`}
                          className="grid gap-4 border-2 border-zinc-700 p-3 sm:grid-cols-[88px_minmax(0,1fr)_auto] sm:items-center sm:p-4"
                        >
                          <div className="h-[88px] w-[88px] overflow-hidden border-2 border-white bg-zinc-900">
                            <ProductImage src={item.image} alt={item.name || "Order item"} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500">
                              Item / {String(index + 1).padStart(2, "0")}
                            </p>
                            <h4 className="mt-2 break-words text-lg font-black uppercase">
                              {item.name}
                            </h4>
                            <p className="mt-1 text-sm text-zinc-400">
                              {currency.format(Number(item.price) || 0)} · Qty {item.quantity}
                            </p>
                          </div>
                          <p className="text-right text-lg font-black tabular-nums">
                            {currency.format((Number(item.price) || 0) * (Number(item.quantity) || 0))}
                          </p>
                        </article>
                      ))}
                    </div>
                  </section>

                  <section className="border-4 border-white bg-[#151515] p-5 shadow-[5px_5px_0px_#3b82f6] md:p-7">
                    <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-500">
                      Delivery / Address
                    </p>
                    <h2 className="mt-2 text-2xl font-black uppercase">
                      {order.shippingAddress?.fullName}
                    </h2>
                    <address className="mt-4 space-y-1 text-sm not-italic leading-relaxed text-zinc-300">
                      <p>{order.shippingAddress?.addressLine1}</p>
                      <p>
                        {order.shippingAddress?.city}, {order.shippingAddress?.state}{" "}
                        {order.shippingAddress?.pincode}
                      </p>
                      <p>Phone: {order.shippingAddress?.phone}</p>
                    </address>
                  </section>
                </div>

                <aside className="border-4 border-white bg-blue-500 p-6 text-black shadow-[8px_8px_0px_#ffffff] lg:sticky lg:top-8">
                  <p className="text-xs font-black uppercase tracking-[0.22em]">
                    Payment summary
                  </p>
                  <h2 className="mt-2 text-3xl font-black uppercase">Total</h2>
                  <div className="mt-7 flex justify-between border-t-2 border-black/30 pt-5 text-sm font-bold">
                    <span>Items</span>
                    <span>{order.items?.reduce((count, item) => count + (Number(item.quantity) || 0), 0) || 0}</span>
                  </div>
                  <div className="mt-4 flex justify-between border-t-2 border-black pt-5 text-lg font-black uppercase">
                    <span>Amount</span>
                    <span className="tabular-nums">{currency.format(Number(order.totalAmount) || 0)}</span>
                  </div>
                  <p className="mt-4 flex items-center gap-2 text-xs font-black uppercase">
                    <PackageCheck className="h-4 w-4" />
                    {order.paymentStatus || "PENDING"}
                  </p>
                  {order.razorpayPaymentId && (
                    <p className="mt-3 break-all border-t border-black/30 pt-3 text-[10px] font-bold">
                      Payment ID: {order.razorpayPaymentId}
                    </p>
                  )}
                  <Link
                    to="/orders"
                    className="mt-7 flex min-h-12 items-center justify-center gap-2 border-4 border-black bg-white px-4 text-sm font-black uppercase shadow-[5px_5px_0px_#000000] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                  >
                    All orders
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </aside>
              </div>
            </>
          ) : null}
        </section>
      </div>
    </main>
  );
}

export default OrderDetails;
