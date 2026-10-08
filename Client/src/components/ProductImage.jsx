import { useState } from "react";
import { ImageOff, Package } from "lucide-react";

function ProductImage({
  src,
  alt,
  category,
  className = "h-full w-full object-cover",
}) {
  const [failedSrc, setFailedSrc] = useState("");
  const hasImage = Boolean(src) && failedSrc !== src;

  return hasImage ? (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setFailedSrc(src)}
    />
  ) : (
    <div
      role="img"
      aria-label={`${alt || "Product"} image unavailable`}
      className={`relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-zinc-900 p-4 text-center text-white ${className.replace("object-cover", "")}`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:24px_24px]"
      />
      <div className="relative flex h-14 w-14 items-center justify-center border-2 border-blue-500 bg-black text-blue-500 sm:h-16 sm:w-16">
        {src ? <ImageOff className="h-7 w-7" /> : <Package className="h-7 w-7" />}
      </div>
      <p className="relative mt-4 line-clamp-2 max-w-full text-xs font-black uppercase tracking-wide">
        {alt || "Product image"}
      </p>
      {category && (
        <p className="relative mt-2 text-[9px] font-bold uppercase tracking-[0.2em] text-blue-400">
          {category}
        </p>
      )}
      <span className="relative mt-3 inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-zinc-500">
        <ImageOff aria-hidden="true" className="h-3 w-3" />
        Image unavailable
      </span>
    </div>
  );
}

export default ProductImage;
