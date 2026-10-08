import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowUpRight, ShoppingBag, Package, Heart } from "lucide-react";
import { authinstance } from "../lib/axiosinstance";
import ProductImage from "./ProductImage.jsx";

function ProductCard({ product }) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [loading, setLoading] = useState(false);

  const addToWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (loading || isWishlisted) return;

    try {
      setLoading(true);

      await authinstance.post(`/wishlist/${product._id}`);

      setIsWishlisted(true);
    } catch (error) {
      console.error(
        error.response?.data?.message || "Failed to add to wishlist",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Link to={`/products/${product._id}`}>
      <motion.article
        whileHover={{
          y: -8,
        }}
        transition={{
          duration: 0.2,
        }}
        className="group h-full cursor-pointer border-4 border-white bg-[#151515] text-white shadow-[7px_7px_0px_#3b82f6] transition-shadow hover:shadow-[11px_11px_0px_#3b82f6]"
      >
        <div className="relative aspect-square overflow-hidden border-b-4 border-white bg-white">
          <ProductImage
            src={product.image}
            alt={product.name}
            category={product.category}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          <div className="absolute left-4 top-4 border-2 border-black bg-blue-500 px-3 py-2 text-xs font-black uppercase tracking-wider text-black">
            {product.category}
          </div>

          <div className="absolute right-4 top-4 flex gap-2">
            <button
              type="button"
              onClick={addToWishlist}
              disabled={loading}
              className={`flex h-11 w-11 items-center justify-center border-2 border-black transition-all ${
                isWishlisted
                  ? "bg-blue-500 text-black"
                  : "bg-white text-black hover:bg-blue-500"
              }`}
            >
              <Heart
                className="h-5 w-5"
                fill={isWishlisted ? "currentColor" : "none"}
              />
            </button>

            <div className="flex h-11 w-11 items-center justify-center border-2 border-black bg-white text-black transition-all group-hover:bg-blue-500">
              <ArrowUpRight className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="mb-2 text-[10px] font-black uppercase tracking-[0.25em] text-blue-500">
                Product
              </p>

              <h2 className="truncate text-xl font-black uppercase tracking-tight">
                {product.name}
              </h2>
            </div>

            <ShoppingBag className="mt-1 h-5 w-5 shrink-0 text-zinc-500 transition-colors group-hover:text-blue-500" />
          </div>

          <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-zinc-400">
            {product.description}
          </p>

          <div className="mt-6 flex items-end justify-between border-t-2 border-zinc-800 pt-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                Price
              </p>

              <p className="mt-1 text-2xl font-black text-white">
                ₹{Number(product.price).toLocaleString("en-IN")}
              </p>
            </div>

            <div className="text-right">
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                Stock
              </p>

              <div className="mt-1 flex items-center justify-end gap-1.5">
                <Package className="h-3.5 w-3.5 text-blue-500" />

                <span className="text-xs font-black">{product.stock}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.article>
    </Link>
  );
}

export default ProductCard;
