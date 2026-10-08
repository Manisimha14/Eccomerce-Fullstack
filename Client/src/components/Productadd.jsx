import React, { useState } from "react";
import { productsinstance } from "../lib/axiosinstance";
import { toast } from "react-toastify";

function Productadd() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const image = e.target.files[0];

    if (!image) {
      return;
    }

    setImageFile(image);

    const imageUrl = URL.createObjectURL(image);
    setPreviewImage(imageUrl);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Product name is required");
      return;
    }

    if (!description.trim()) {
      toast.error("Description is required");
      return;
    }

    if (!price || Number(price) <= 0) {
      toast.error("Price must be greater than 0");
      return;
    }

    if (!category) {
      toast.error("Please select a category");
      return;
    }

    if (stock === "" || Number(stock) < 0) {
      toast.error("Stock cannot be negative");
      return;
    }

    if (!imageFile) {
      toast.error("Please select a product image");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("name", name.trim());
      formData.append("description", description.trim());
      formData.append("price", price);
      formData.append("category", category);
      formData.append("stock", stock);
      formData.append("image", imageFile);

      const response = await productsinstance.post("/products", formData);

      toast.success(response.data?.message || "Product created successfully");

      // Reset form
      setName("");
      setDescription("");
      setPrice("");
      setCategory("");
      setStock("");
      setImageFile(null);
      setPreviewImage("");

      // Reset file input
      e.target.reset();
    } catch (error) {
      console.error("Error creating product:", error);

      toast.error(error.response?.data?.message || "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-600 px-5 py-10">
      <div className="mx-auto max-w-3xl">
        {/* HEADER */}
        <div className="mb-8">
          <div className="mb-4 inline-block bg-black px-4 py-2 text-xs font-black tracking-[0.2em] text-white">
            STORE / ADMIN
          </div>

          <h1 className="text-6xl font-black uppercase tracking-[-0.06em]">
            ADD
            <br />
            PRODUCT<span className="text-white">.</span>
          </h1>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="border-4 border-black bg-white p-6 shadow-[12px_12px_0_#000] md:p-8"
        >
          {/* PRODUCT NAME */}
          <div className="mb-6">
            <label className="mb-2 block text-xs font-black tracking-widest">
              PRODUCT NAME
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ENTER PRODUCT NAME"
              className="h-14 w-full border-4 border-black px-4 font-bold outline-none focus:bg-blue-50"
            />
          </div>

          {/* DESCRIPTION */}
          <div className="mb-6">
            <label className="mb-2 block text-xs font-black tracking-widest">
              DESCRIPTION
            </label>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="ENTER PRODUCT DESCRIPTION"
              rows="5"
              className="w-full resize-none border-4 border-black p-4 font-bold outline-none focus:bg-blue-50"
            />
          </div>

          {/* PRICE */}
          <div className="mb-6">
            <label className="mb-2 block text-xs font-black tracking-widest">
              PRICE
            </label>

            <input
              type="number"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="ENTER PRICE"
              className="h-14 w-full border-4 border-black px-4 font-bold outline-none focus:bg-blue-50"
            />
          </div>

          {/* CATEGORY */}
          <div className="mb-6">
            <label className="mb-2 block text-xs font-black tracking-widest">
              CATEGORY
            </label>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="h-14 w-full cursor-pointer border-4 border-black bg-white px-4 font-bold outline-none focus:bg-blue-50"
            >
              <option value="">SELECT CATEGORY</option>
              <option value="Electronics">ELECTRONICS</option>
              <option value="Wearables">WEARABLES</option>
              <option value="Clothing">CLOTHING</option>
              <option value="Footwear">FOOTWEAR</option>
              <option value="Accessories">ACCESSORIES</option>
              <option value="Bags">BAGS</option>
              <option value="Home & Kitchen">HOME & KITCHEN</option>
            </select>
          </div>

          {/* STOCK */}
          <div className="mb-6">
            <label className="mb-2 block text-xs font-black tracking-widest">
              STOCK
            </label>

            <input
              type="number"
              min="0"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              placeholder="ENTER STOCK QUANTITY"
              className="h-14 w-full border-4 border-black px-4 font-bold outline-none focus:bg-blue-50"
            />
          </div>

          {/* IMAGE */}
          <div className="mb-6">
            <label className="mb-2 block text-xs font-black tracking-widest">
              PRODUCT IMAGE
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full border-4 border-black bg-white p-3 font-bold"
            />
          </div>

          {/* IMAGE PREVIEW */}
          {previewImage && (
            <div className="mb-6 border-4 border-black bg-gray-100 p-4">
              <p className="mb-3 text-xs font-black tracking-widest">
                IMAGE PREVIEW
              </p>

              <div className="border-4 border-black bg-white p-3">
                <img
                  src={previewImage}
                  alt="Product preview"
                  className="max-h-80 w-full object-contain"
                />
              </div>
            </div>
          )}

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full border-4 border-black py-4 text-sm font-black tracking-widest text-white shadow-[6px_6px_0_#3b82f6] transition-all ${
              loading
                ? "cursor-not-allowed bg-gray-600"
                : "bg-black hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-[2px_2px_0_#3b82f6]"
            }`}
          >
            {loading ? "CREATING PRODUCT..." : "ADD PRODUCT"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Productadd;
