"use client";

import React, { useState } from "react";
import { Heart, ShoppingCart, GitCompare, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useCompareStore } from "@/store/compareStore";
import StarRating from "@/components/frontend/ui/StarRating";
import {
  getProductImageUrl,
  resolveProductImage,
  formatPrice,
  getEffectivePrice,
  getDiscountPercent,
} from "@/lib/productUtils";
import toast from "react-hot-toast";

export interface ProductCardData {
  id: number;
  slug: string;
  name: string;
  purchase_price: number;
  sale_price?: number | null;
  discount_percent?: number;
  description?: string;
  image?: string | null;
  image_url?: string | null;
  stock: number;
  rating?: number;
  review_count?: number;
  brand?: { id: number; name: string };
  is_featured?: boolean;
  is_new_arrival?: boolean;
  is_flash_sale?: boolean;
  is_on_sale?: boolean;
}

interface ProductCardProps {
  product: ProductCardData;
  showBadges?: boolean;
}

export default function ProductCard({ product, showBadges = true }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();
  const addToCart = useCartStore((s) => s.addToCart);
  const { toggle: toggleWishlist, has: isWishlisted } = useWishlistStore();
  const { add: addCompare, has: isCompared } = useCompareStore();

  const discount = getDiscountPercent(product);
  const effectivePrice = getEffectivePrice(product);
  const wishlisted = isWishlisted(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product.stock) return;
    addToCart({
      id: product.id,
      name: product.name,
      price: effectivePrice,
      image: product.image ?? "",
      stock: product.stock,
      quantity: 1,
    });
    toast.success("Added to cart");
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist({
      id: product.id,
      slug: product.slug,
      name: product.name,
      purchase_price: product.purchase_price,
      sale_price: product.sale_price,
      image: product.image ?? "",
      stock: product.stock,
    });
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const ok = addCompare({
      id: product.id,
      slug: product.slug,
      name: product.name,
      purchase_price: product.purchase_price,
      image: product.image ?? "",
      brand: product.brand,
    });
    toast[ok ? "success" : "error"](ok ? "Added to compare" : "Compare list full (max 4)");
  };

  return (
    <article
      onClick={() => router.push(`/product/${product.slug}`)}
      className="group relative rounded-xl border border-border bg-card overflow-hidden card-hover cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={resolveProductImage(product)}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {showBadges && (
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {discount > 0 && <span className="badge-sale">-{discount}%</span>}
            {product.is_new_arrival && <span className="badge-new">NEW</span>}
            {product.is_flash_sale && <span className="badge-featured">FLASH</span>}
          </div>
        )}

        {!product.stock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-semibold text-sm">Out of Stock</span>
          </div>
        )}

        <div
          className={`absolute top-2 right-2 flex flex-col gap-1.5 transition-opacity ${
            isHovered ? "opacity-100" : "opacity-0 md:opacity-0"
          }`}
        >
          <button
            onClick={handleWishlist}
            className={`p-2 rounded-full shadow-md transition-colors ${
              wishlisted ? "bg-danger text-white" : "bg-card text-foreground hover:bg-muted"
            }`}
            aria-label="Wishlist"
          >
            <Heart className={`h-4 w-4 ${wishlisted ? "fill-current" : ""}`} />
          </button>
          <button
            onClick={handleCompare}
            className={`p-2 rounded-full shadow-md transition-colors ${
              isCompared(product.id) ? "bg-accent text-white" : "bg-card text-foreground hover:bg-muted"
            }`}
            aria-label="Compare"
          >
            <GitCompare className="h-4 w-4" />
          </button>
        </div>

        {isHovered && product.stock > 0 && (
          <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
            <button
              onClick={handleAddToCart}
              className="w-full btn-primary text-sm py-2"
            >
              <ShoppingCart className="h-4 w-4" />
              Add to Cart
            </button>
          </div>
        )}
      </div>

      <div className="p-4">
        {product.brand && (
          <p className="text-xs font-medium text-accent uppercase tracking-wide mb-1">
            {product.brand.name}
          </p>
        )}
        <h3 className="font-semibold text-foreground line-clamp-2 min-h-[2.5rem] group-hover:text-primary transition-colors">
          {product.name}
        </h3>

        {(product.rating ?? 0) > 0 && (
          <div className="mt-2">
            <StarRating rating={product.rating ?? 0} count={product.review_count} />
          </div>
        )}

        <div className="mt-3 flex items-end gap-2">
          <span className="text-lg font-bold text-foreground">{formatPrice(effectivePrice)}</span>
          {product.sale_price && product.sale_price < product.purchase_price && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(product.purchase_price)}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
