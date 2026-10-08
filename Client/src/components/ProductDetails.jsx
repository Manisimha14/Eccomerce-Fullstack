import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "motion/react";
import {
  ArrowLeft,
  ArrowUpRight,
  Package,
  ShoppingBag,
  ShieldCheck,
  Truck,
  AlertCircle,
  ShoppingCart,
} from "lucide-react";

import { productsinstance } from "../lib/axiosinstance";
import { useCart } from "../context/useCart.js";
import { toast } from "react-toastify";
import ProductImage from "./ProductImage.jsx";

function ProductDetails() {
  // ============================================
  // GET PRODUCT ID FROM URL
  // ============================================

  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadedProductId, setLoadedProductId] = useState(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const { addToCart, itemCount } = useCart();

  const handleAddToCart = async () => {
    try {
      setAddingToCart(true);
      await addToCart(id);
      toast.success("Added to your cart");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not add this item to your cart");
    } finally {
      setAddingToCart(false);
    }
  };

  // ============================================
  // GET PRODUCT
  // ============================================

  useEffect(() => {
    let isCurrent = true;

    const fetchProduct = async () => {
      try {
        const response = await productsinstance.get(`/products/${id}`);
        if (isCurrent) {
          setProduct(response.data.product);
          setLoadedProductId(id);
        }
      } catch (error) {
        if (isCurrent) {
          console.error("Error fetching product:", error);
          setProduct(null);
          setLoadedProductId(id);
        }
      } finally {
        if (isCurrent) setLoading(false);
      }
    };

    fetchProduct();
    return () => {
      isCurrent = false;
    };
  }, [id]);

  // ============================================
  // LOADING
  // ============================================

  if (loading || loadedProductId !== id) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0b0b0b] p-6 text-white">
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.9,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          className="border-4 border-white bg-blue-500 p-8 text-black shadow-[10px_10px_0px_#ffffff]"
        >
          <div className="flex items-center gap-4">
            <motion.div
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "linear",
              }}
              className="flex h-12 w-12 items-center justify-center border-4 border-black bg-white"
            >
              <Package className="h-6 w-6" />
            </motion.div>

            <div>
              <p className="text-xs font-black uppercase tracking-[0.25em]">
                LabProject
              </p>

              <p className="text-xl font-black uppercase">Loading Product...</p>
            </div>
          </div>
        </motion.div>
      </main>
    );
  }

  // ============================================
  // PRODUCT NOT FOUND
  // ============================================

  if (!product) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0b0b0b] p-6 text-white">
        <div className="w-full max-w-lg border-4 border-white bg-[#151515] p-10 text-center shadow-[10px_10px_0px_#3b82f6]">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center border-4 border-white bg-blue-500 text-black">
            <AlertCircle className="h-10 w-10" />
          </div>

          <p className="text-xs font-black uppercase tracking-[0.25em] text-blue-500">
            Error 404
          </p>

          <h1 className="mt-3 text-4xl font-black uppercase">
            Product Not Found
          </h1>

          <p className="mt-4 text-sm text-zinc-400">
            This product may have been removed or the URL may be invalid.
          </p>

          <Link to="/products">
            <button className="mt-8 inline-flex h-12 items-center gap-2 border-4 border-white bg-blue-500 px-6 text-sm font-black uppercase text-black shadow-[5px_5px_0px_#ffffff] transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none">
              <ArrowLeft className="h-4 w-4" />
              Back To Products
            </button>
          </Link>
        </div>
      </main>
    );
  }

  // ============================================
  // MAIN PRODUCT PAGE
  // ============================================

  return (
    <main className="min-h-screen overflow-hidden bg-[#0b0b0b] text-white">
      {/* =========================================
          BACKGROUND
      ========================================== */}

      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:40px_40px]" />

        <motion.div
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute left-[5%] top-[20%] h-80 w-80 rounded-full bg-blue-600/10 blur-3xl"
        />
      </div>

      {/* =========================================
          HEADER
      ========================================== */}

      <header className="border-b-4 border-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 md:px-10 lg:px-8">
          <Link to="/products">
            <motion.div
              whileHover={{
                x: -3,
              }}
              className="flex items-center gap-3"
            >
              <div className="flex h-11 w-11 items-center justify-center border-2 border-white bg-blue-500 text-black">
                <ArrowLeft className="h-5 w-5" />
              </div>

              <span className="text-xs font-black uppercase tracking-[0.2em]">
                Back To Store
              </span>
            </motion.div>
          </Link>

          <div className="flex items-center gap-3">
            <div className="hidden border-2 border-zinc-700 px-3 py-2 text-xs font-black uppercase tracking-widest text-zinc-500 sm:block">
              Product / Details
            </div>
            <Link
              to="/cart"
              aria-label={`View cart, ${itemCount} items`}
              className="relative flex h-11 min-w-11 items-center justify-center gap-2 border-2 border-white bg-blue-500 px-3 font-black text-black transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-500"
            >
              <ShoppingCart className="h-5 w-5" />
              <span>{itemCount}</span>
            </Link>
          </div>
        </div>
      </header>

      {/* =========================================
          PRODUCT
      ========================================== */}

      <section className="mx-auto max-w-7xl px-5 py-10 md:px-10 md:py-16 lg:px-8 lg:py-20">
        {/* Breadcrumb */}

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="mb-10 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-zinc-500"
        >
          <Link
            to="/products"
            className="transition-colors hover:text-blue-500"
          >
            Products
          </Link>

          <span>/</span>

          <span className="text-blue-500">{product.category}</span>
        </motion.div>

        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          {/* =======================================
              IMAGE
          ======================================== */}

          <motion.div
            initial={{
              opacity: 0,
              x: -40,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.6,
            }}
          >
            <div className="relative border-4 border-white bg-white shadow-[12px_12px_0px_#3b82f6]">
              <div className="aspect-square overflow-hidden">
                <ProductImage
                  src={product.image}
                  alt={product.name}
                  category={product.category}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Category */}

              <div className="absolute left-5 top-5 border-4 border-black bg-blue-500 px-4 py-2 text-xs font-black uppercase tracking-widest text-black">
                {product.category}
              </div>

              {/* Product Number */}

              <div className="absolute bottom-5 right-5 border-4 border-black bg-white px-4 py-2 text-xs font-black uppercase text-black">
                ID / {product._id.slice(-6)}
              </div>
            </div>
          </motion.div>

          {/* =======================================
              DETAILS
          ======================================== */}

          <motion.div
            initial={{
              opacity: 0,
              x: 40,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.6,
              delay: 0.1,
            }}
            className="flex flex-col"
          >
            {/* Label */}

            <div className="mb-5 inline-flex w-fit items-center gap-2 border-2 border-white bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-black">
              <ShoppingBag className="h-4 w-4" />
              Product
            </div>

            {/* Name */}

            <h1 className="text-5xl font-black uppercase leading-[0.9] tracking-[-0.05em] sm:text-6xl lg:text-7xl">
              {product.name}
            </h1>

            {/* Price */}

            <div className="mt-8 border-y-4 border-white py-6">
              <p className="text-xs font-black uppercase tracking-[0.25em] text-zinc-500">
                Price
              </p>

              <p className="mt-2 text-5xl font-black text-blue-500">
                ₹{Number(product.price).toLocaleString("en-IN")}
              </p>
            </div>

            {/* Description */}

            <div className="mt-8">
              <p className="mb-3 text-xs font-black uppercase tracking-[0.25em] text-blue-500">
                Description
              </p>

              <p className="max-w-xl text-base font-medium leading-8 text-zinc-400">
                {product.description}
              </p>
            </div>

            {/* Stock */}

            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="border-2 border-zinc-700 bg-[#151515] p-5">
                <Package className="mb-4 h-6 w-6 text-blue-500" />

                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                  Available Stock
                </p>

                <p className="mt-1 text-2xl font-black">{product.stock}</p>
              </div>

              <div className="border-2 border-zinc-700 bg-[#151515] p-5">
                <ShieldCheck className="mb-4 h-6 w-6 text-blue-500" />

                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                  Product Status
                </p>

                <p className="mt-1 text-2xl font-black uppercase">
                  {product.stock > 0 ? "In Stock" : "Sold Out"}
                </p>
              </div>
            </div>

            {/* Action */}

            <div className="mt-8">
              {product.stock > 0 ? (
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={addingToCart}
                  className="group flex h-16 w-full items-center justify-between border-4 border-white bg-blue-500 px-6 text-base font-black uppercase tracking-wide text-black shadow-[7px_7px_0px_#ffffff] transition-all hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-500 disabled:cursor-wait disabled:opacity-60"
                >
                  <span>{addingToCart ? "Adding..." : "Add To Cart"}</span>

                  <ArrowUpRight className="h-6 w-6 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </button>
              ) : (
                <button
                  disabled
                  className="flex h-16 w-full cursor-not-allowed items-center justify-between border-4 border-zinc-700 bg-zinc-800 px-6 text-base font-black uppercase tracking-wide text-zinc-500"
                >
                  <span>Out Of Stock</span>
                  <Package className="h-6 w-6" />
                </button>
              )}
            </div>

            {/* Info */}

            <div className="mt-8 grid gap-3 border-t-2 border-zinc-800 pt-6 sm:grid-cols-2">
              <div className="flex items-center gap-3">
                <Truck className="h-5 w-5 text-blue-500" />

                <div>
                  <p className="text-xs font-black uppercase">Fast Delivery</p>

                  <p className="text-xs text-zinc-500">Reliable shipping</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-blue-500" />

                <div>
                  <p className="text-xs font-black uppercase">
                    Secure Purchase
                  </p>

                  <p className="text-xs text-zinc-500">Safe & protected</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* =========================================
          BOTTOM SECTION
      ========================================== */}

      <section className="mx-auto max-w-7xl px-5 pb-20 md:px-10 lg:px-8">
        <div className="border-t-4 border-white pt-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.25em] text-blue-500">
                Continue Exploring
              </p>

              <h2 className="mt-2 text-3xl font-black uppercase">
                More Products
              </h2>
            </div>

            <Link to="/products">
              <button className="flex h-12 items-center gap-3 border-4 border-white bg-white px-5 text-sm font-black uppercase text-black transition-colors hover:bg-blue-500">
                View Catalog
                <ArrowUpRight className="h-4 w-4" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================
          FOOTER
      ========================================== */}

      <footer className="border-t-4 border-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 md:px-10 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <p className="font-black tracking-tight">LABPROJECT</p>

          <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
            Product Details © 2026
          </p>
        </div>
      </footer>
    </main>
  );
}

export default ProductDetails;
