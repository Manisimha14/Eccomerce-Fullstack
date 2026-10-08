import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, PackageCheck, ShoppingBag } from "lucide-react";
import { ordersInstance } from "../lib/axiosinstance";

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
});

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isCurrent = true;
    ordersInstance
      .get("/")
      .then((response) => {
        if (isCurrent) setOrders(response.data.orders || []);
      })
      .catch((requestError) => {
        if (isCurrent) {
          setError(
            requestError.response?.data?.message || "Could not load your orders",
          );
        }
      })
      .finally(() => {
        if (isCurrent) setLoading(false);
      });
    return () => {
      isCurrent = false;
    };
  }, []);

  return (
    <main className="min-h-screen bg-[#0b0b0b] px-5 py-7 text-white md:px-10 md:py-10">
      <div className="mx-auto max-w-7xl">
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

        <section className="py-10 md:py-14" aria-labelledby="orders-heading">
          <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-3 text-xs font-black uppercase tracking-[0.28em] text-blue-500">
                Your account / {String(orders.length).padStart(2, "0")}
              </p>
              <h1
                id="orders-heading"
                className="text-6xl font-black uppercase leading-[0.82] tracking-[-0.07em] sm:text-8xl"
              >
                YOUR
                <br />
                ORDERS<span className="text-blue-500">.</span>
              </h1>
            </div>
            <p className="max-w-xs text-sm font-medium leading-relaxed text-zinc-400">
              View the items, delivery details, and payment status for your
              purchases.
            </p>
          </div>

          {loading ? (
            <div
              role="status"
              className="border-4 border-white bg-[#151515] p-6 shadow-[8px_8px_0px_#3b82f6]"
            >
              <span className="sr-only">Loading your orders</span>
              <div className="h-5 w-40 animate-pulse bg-zinc-700" />
              <div className="mt-7 h-32 animate-pulse bg-zinc-800" />
            </div>
          ) : error ? (
            <div role="alert" className="border-4 border-white bg-[#151515] p-7 shadow-[8px_8px_0px_#3b82f6]">
              <p className="text-xs font-black uppercase tracking-[0.25em] text-blue-500">
                Orders unavailable
              </p>
              <h2 className="mt-2 text-3xl font-black uppercase">We couldn&apos;t load your orders.</h2>
              <p className="mt-3 text-sm text-zinc-400">{error}</p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-6 min-h-12 border-4 border-white bg-blue-500 px-6 font-black uppercase text-black shadow-[5px_5px_0px_#ffffff] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-500"
              >
                Try again
              </button>
            </div>
          ) : orders.length === 0 ? (
            <div className="grid gap-8 border-4 border-white bg-[#151515] p-7 shadow-[8px_8px_0px_#3b82f6] md:grid-cols-[1fr_auto] md:items-center md:p-12">
              <div>
                <div className="mb-6 flex h-16 w-16 items-center justify-center border-4 border-white bg-blue-500 text-black">
                  <ShoppingBag className="h-7 w-7" />
                </div>
                <p className="text-xs font-black uppercase tracking-[0.25em] text-blue-500">
                  No orders yet
                </p>
                <h2 className="mt-2 text-3xl font-black uppercase sm:text-4xl">
                  Your purchases will show up here.
                </h2>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-zinc-400">
                  Browse the store and place an order to see its progress here.
                </p>
              </div>
              <Link
                to="/products"
                className="inline-flex min-h-12 items-center justify-center gap-3 border-4 border-white bg-blue-500 px-6 font-black uppercase text-black shadow-[5px_5px_0px_#ffffff] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-500"
              >
                Explore products
                <ArrowUpRight className="h-5 w-5" />
              </Link>
            </div>
          ) : (
            <div className="space-y-5">
              {orders.map((order, index) => (
                <article
                  key={order._id}
                  className="border-4 border-white bg-[#151515] p-5 shadow-[5px_5px_0px_#3b82f6] md:p-7"
                >
                  <div className="flex flex-col gap-4 border-b-2 border-zinc-700 pb-5 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-blue-500">
                        Order / {String(index + 1).padStart(2, "0")}
                      </p>
                      <h2 className="mt-2 break-all text-lg font-black uppercase sm:text-xl">
                        {order._id}
                      </h2>
                      <p className="mt-2 text-xs font-bold text-zinc-400">
                        Placed{" "}
                        {new Intl.DateTimeFormat("en-IN", {
                          dateStyle: "medium",
                        }).format(new Date(order.createdAt))}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2 text-[10px] font-black uppercase tracking-wider">
                      <span className="border-2 border-white px-3 py-2">
                        {String(order.status || "PENDING").replaceAll("_", " ")}
                      </span>
                      <span className="border-2 border-blue-500 bg-blue-500 px-3 py-2 text-black">
                        Payment {order.paymentStatus || "PENDING"}
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3 text-sm font-bold text-zinc-300">
                      <PackageCheck className="h-5 w-5 shrink-0 text-blue-500" />
                      {order.items?.length || 0}{" "}
                      {(order.items?.length || 0) === 1 ? "product" : "products"}
                      <span className="text-zinc-600">/</span>
                      <span className="font-black text-white">
                        {currency.format(Number(order.totalAmount) || 0)}
                      </span>
                    </div>
                    <Link
                      to={`/orders/${order._id}`}
                      className="inline-flex min-h-11 items-center justify-center gap-2 border-2 border-white px-4 text-xs font-black uppercase transition-colors hover:bg-blue-500 hover:text-black focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-500"
                    >
                      View order
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default Orders;
