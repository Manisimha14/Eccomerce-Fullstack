
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { authinstance } from "../lib/axiosinstance";
import ProductCard from "../components/ProductCard";

function Wishlist() {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 500);

        return () => clearTimeout(timer);
    }, [search]);

    const getWishlist = async () => {
        try {
            setLoading(true);

            const params = new URLSearchParams();

            if (debouncedSearch.trim()) {
                params.append("search", debouncedSearch.trim());
            }

            if (sort) {
                params.append("sort", sort);
            }

            const response = await authinstance.get(
                `/wishlist?${params.toString()}`
            );

            setWishlist(response.data.wishlist || []);
        } catch (error) {
            console.error("Error fetching wishlist:", error);
            setWishlist([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getWishlist();
    }, [debouncedSearch, sort]);

    const deleteWishlist = async (productId) => {
        try {
            await authinstance.delete(`/wishlist/${productId}`);

            setWishlist((previousWishlist) =>
                previousWishlist.filter(
                    (product) => product._id !== productId
                )
            );
        } catch (error) {
            console.error("Error deleting wishlist item:", error);
        }
    };

    const clearFilters = () => {
        setSearch("");
        setSort("");
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-blue-600 flex items-center justify-center p-6">
                <div className="bg-white border-4 border-black px-10 py-8 shadow-[12px_12px_0_#000]">
                    <div className="flex items-center gap-4">
                        <div className="w-5 h-5 bg-blue-600 border-4 border-black animate-pulse" />
                        <p className="font-black text-xl tracking-tight">
                            LOADING WISHLIST...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-blue-600 text-black px-5 py-8 md:px-10 md:py-12 lg:px-16">

            <div className="max-w-7xl mx-auto flex items-center justify-between mb-10">
                <div className="bg-black text-white px-4 py-2 font-black text-xs tracking-[0.2em]">
                    STORE / WISHLIST
                </div>

                <div className="hidden sm:block font-black text-xs tracking-widest">
                    2026
                </div>
            </div>

            <header className="max-w-7xl mx-auto mb-10">
                <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">

                    <div>
                        <p className="font-black text-sm tracking-[0.25em] mb-4">
                            SAVED PRODUCTS
                        </p>

                        <h1 className="text-7xl sm:text-8xl lg:text-[9rem] font-black tracking-[-0.08em] leading-[0.75]">
                            MY
                            <br />
                            WISHLIST<span className="text-white">.</span>
                        </h1>
                    </div>

                    <div className="lg:max-w-xs">
                        <p className="font-bold text-sm leading-relaxed">
                            Your saved products in one place. Search,
                            sort, and manage everything you've added
                            to your wishlist.
                        </p>

                        <Link
                            to="/products"
                            className="inline-block mt-5 bg-black text-white border-4 border-black px-5 py-3 font-black text-sm tracking-wide hover:bg-white hover:text-black transition-colors"
                        >
                            ← CONTINUE SHOPPING
                        </Link>
                    </div>

                </div>
            </header>

            <section className="max-w-7xl mx-auto mb-12">
                <div className="bg-white border-4 border-black shadow-[10px_10px_0_#000]">

                    <div className="p-4 md:p-5 flex flex-col lg:flex-row gap-4">

                        <div className="relative flex-1">

                            <div className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-lg">
                                /
                            </div>

                            <input
                                type="text"
                                placeholder="SEARCH WISHLIST..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full h-14 border-4 border-black pl-10 pr-12 font-black text-sm tracking-wide outline-none focus:bg-blue-50 placeholder:text-gray-500"
                            />

                            {search && (
                                <button
                                    onClick={() => setSearch("")}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black text-white font-black hover:bg-blue-600 transition-colors"
                                >
                                    ×
                                </button>
                            )}

                        </div>

                        <select
                            value={sort}
                            onChange={(e) => setSort(e.target.value)}
                            className="h-14 lg:w-64 border-4 border-black px-4 bg-white font-black text-sm tracking-wide outline-none cursor-pointer focus:bg-blue-50"
                        >
                            <option value="">SORT BY</option>
                            <option value="asc">
                                PRICE: LOW → HIGH
                            </option>
                            <option value="desc">
                                PRICE: HIGH → LOW
                            </option>
                        </select>

                        {(search || sort) && (
                            <button
                                onClick={clearFilters}
                                className="h-14 px-6 bg-black text-white border-4 border-black font-black text-sm tracking-wide hover:bg-blue-600 hover:text-black transition-colors"
                            >
                                CLEAR
                            </button>
                        )}

                    </div>
                </div>
            </section>

            <section className="max-w-7xl mx-auto">

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b-4 border-black pb-5 mb-8">

                    <div className="flex items-center gap-3">
                        <span className="bg-black text-white px-3 py-2 font-black text-xs tracking-widest">
                            SAVED
                        </span>

                        <span className="font-black text-sm">
                            {wishlist.length}{" "}
                            {wishlist.length === 1
                                ? "PRODUCT"
                                : "PRODUCTS"}
                        </span>
                    </div>

                    {(search || sort) && (
                        <p className="font-bold text-xs uppercase tracking-wider">
                            {search && `SEARCH: "${search}"`}
                            {search && sort && " • "}
                            {sort &&
                                `SORT: ${
                                    sort === "asc"
                                        ? "LOW TO HIGH"
                                        : "HIGH TO LOW"
                                }`}
                        </p>
                    )}

                </div>

                {wishlist.length === 0 ? (
                    <div className="min-h-87.5 flex items-center justify-center">

                        <div className="bg-white border-4 border-black p-10 md:p-14 shadow-[12px_12px_0_#000] text-center max-w-lg">

                            <div className="text-6xl font-black mb-5">
                                ♡
                            </div>

                            <h2 className="text-3xl font-black tracking-tight mb-3">
                                {search
                                    ? "NO MATCHES FOUND."
                                    : "WISHLIST IS EMPTY."}
                            </h2>

                            <p className="font-bold text-sm mb-7">
                                {search
                                    ? "Try changing your search."
                                    : "You haven't saved any products yet."}
                            </p>

                            {search || sort ? (
                                <button
                                    onClick={clearFilters}
                                    className="bg-blue-600 border-4 border-black px-6 py-3 font-black text-sm shadow-[5px_5px_0_#000] hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-[2px_2px_0_#000] transition-all"
                                >
                                    RESET FILTERS
                                </button>
                            ) : (
                                <Link
                                    to="/products"
                                    className="inline-block bg-blue-600 border-4 border-black px-6 py-3 font-black text-sm shadow-[5px_5px_0_#000] hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-[2px_2px_0_#000] transition-all"
                                >
                                    EXPLORE PRODUCTS
                                </Link>
                            )}

                        </div>
                    </div>
                ) : (
                    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 md:gap-8">

                        {wishlist.map((product) => (
                            <div
                                key={product._id}
                                className="relative"
                            >
                                <ProductCard product={product} />

                                <button
                                    onClick={() =>
                                        deleteWishlist(product._id)
                                    }
                                    className="absolute top-3 right-3 z-10 w-10 h-10 bg-white border-4 border-black font-black text-lg shadow-[4px_4px_0_#000] hover:bg-red-500 hover:text-white hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#000] transition-all"
                                >
                                    ×
                                </button>
                            </div>
                        ))}

                    </section>
                )}

            </section>

            <footer className="max-w-7xl mx-auto mt-20 pt-6 border-t-4 border-black flex flex-col sm:flex-row justify-between gap-3">
                <p className="font-black text-xs tracking-widest">
                    WISHLIST © 2026
                </p>

                <p className="font-bold text-xs">
                    {wishlist.length} SAVED ITEMS
                </p>
            </footer>

        </main>
    );
}

export default Wishlist;


