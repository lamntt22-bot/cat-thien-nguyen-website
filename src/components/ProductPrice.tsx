import { formatVnd } from "@/lib/format";
import type { ProductRecord } from "@/lib/product-store";

interface ProductPriceProps {
  product: Pick<ProductRecord, "price" | "priceAmount" | "compareAtPriceAmount">;
  size?: "sm" | "lg";
}

export default function ProductPrice({ product, size = "sm" }: ProductPriceProps) {
  const hasDiscount = Boolean(
    product.compareAtPriceAmount &&
      product.priceAmount &&
      product.compareAtPriceAmount > product.priceAmount,
  );
  const discountPercent = hasDiscount
    ? Math.round(
        ((product.compareAtPriceAmount! - product.priceAmount!) /
          product.compareAtPriceAmount!) *
          100,
      )
    : 0;

  return (
    <div className="flex flex-col">
      {hasDiscount && (
        <div className="flex items-center gap-1.5">
          <span
            className={`${size === "lg" ? "text-sm" : "text-xs"} text-ink-700/50 line-through decoration-red-600 decoration-2`}
          >
            {formatVnd(product.compareAtPriceAmount!)}
          </span>
          <span className="rounded bg-red-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
            -{discountPercent}%
          </span>
        </div>
      )}
      <span
        className={`font-display font-semibold text-red-600 ${size === "lg" ? "text-2xl" : "text-base"}`}
      >
        {product.priceAmount ? formatVnd(product.priceAmount) : product.price}
      </span>
    </div>
  );
}
