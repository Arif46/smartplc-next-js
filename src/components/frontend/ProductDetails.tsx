"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Heart,
  ShoppingCart,
  Minus,
  Plus,
  Truck,
  Shield,
  RotateCcw,
  GitCompare,
  Package,
  ChevronRight,
  Zap,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useCompareStore } from "@/store/compareStore";
import ProductMediaGallery from "@/components/frontend/product/ProductMediaGallery";
import StarRating from "@/components/frontend/ui/StarRating";
import {
  resolveProductGallery,
  formatPrice,
  getEffectivePrice,
  getDiscountPercent,
} from "@/lib/productUtils";
import toast from "react-hot-toast";
import type { Product } from "@/lib/productsApi";

interface ProductDetailsProps {
  product: Product;
}

type DetailTab = "description" | "specification" | "reviews" | "installation";

const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<DetailTab>("description");

  const addToCart = useCartStore((s) => s.addToCart);
  const { toggle: toggleWishlist, has: isInWishlist } = useWishlistStore();
  const { add: addCompare, has: isCompared } = useCompareStore();

  const images = useMemo(() => resolveProductGallery(product), [product]);
  const price = getEffectivePrice(product as any);
  const discount = getDiscountPercent(product as any);
  const inStock = (product.stock ?? 0) > 0;
  const rating = Number(product.rating ?? 0);
  const reviewCount = product.review_count ?? product.reviews?.length ?? 0;

  const tabs: { id: DetailTab; label: string; show: boolean }[] = [
    { id: "description", label: "Description", show: !!product.description },
    { id: "specification", label: "Specifications", show: !!product.specification },
    { id: "reviews", label: `Reviews (${reviewCount})`, show: reviewCount > 0 },
    { id: "installation", label: "Installation", show: !!product.installation_guide },
  ].filter((t) => t.show);

  const handleAddToCart = () => {
    if (!inStock) return;
    addToCart({
      id: product.id,
      name: product.name,
      price,
      image: product.image ?? "",
      stock: product.stock ?? 0,
      quantity,
    });
    toast.success("Added to cart");
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/cart");
  };

  const handleWishlist = () => {
    const wasWishlisted = isInWishlist(product.id);
    toggleWishlist({
      id: product.id,
      slug: product.slug,
      name: product.name,
      purchase_price: product.purchase_price ?? price,
      sale_price: product.sale_price,
      image: product.image ?? "",
      stock: product.stock ?? 0,
    });
    toast.success(wasWishlisted ? "Removed from wishlist" : "Added to wishlist");
  };

  const handleCompare = () => {
    const added = addCompare({
      id: product.id,
      slug: product.slug,
      name: product.name,
      purchase_price: product.purchase_price ?? price,
      image: product.image ?? "",
      brand: product.brand,
      specification: product.specification,
    });
    toast.success(added ? "Added to compare" : "Compare list is full (max 4)");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center flex-wrap gap-1 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-primary">
          Home
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/shop" className="hover:text-primary">
          Shop
        </Link>
        {product.category?.name && (
          <>
            <ChevronRight className="h-4 w-4" />
            <span>{product.category.name}</span>
          </>
        )}
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground font-medium line-clamp-1">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Media gallery */}
        <ProductMediaGallery
          images={images}
          productName={product.name}
          videoUrl={product.video_url}
        />

        {/* Product info */}
        <div className="space-y-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {product.brand?.name && (
                <span className="text-xs font-medium uppercase tracking-wide text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                  {product.brand.name}
                </span>
              )}
              {product.is_new_arrival && (
                <span className="text-xs font-medium bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full">
                  New Arrival
                </span>
              )}
              {discount > 0 && (
                <span className="text-xs font-medium bg-danger text-white px-2.5 py-1 rounded-full">
                  -{discount}% OFF
                </span>
              )}
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-foreground leading-tight">
              {product.name}
            </h1>

            {rating > 0 && (
              <div className="mt-3">
                <StarRating rating={rating} count={reviewCount} />
              </div>
            )}

            <div className="flex flex-wrap items-end gap-3 mt-5">
              <span className="text-3xl font-bold text-foreground">{formatPrice(price)}</span>
              {product.sale_price && product.purchase_price && product.sale_price < product.purchase_price && (
                <span className="text-lg text-muted-foreground line-through">
                  {formatPrice(product.purchase_price)}
                </span>
              )}
            </div>
          </div>

          {/* Meta info */}
          <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-muted/30 border border-border text-sm">
            {product.sku && (
              <div>
                <span className="text-muted-foreground">SKU</span>
                <p className="font-medium text-foreground">{product.sku}</p>
              </div>
            )}
            {product.oem_number && (
              <div>
                <span className="text-muted-foreground">OEM</span>
                <p className="font-medium text-foreground">{product.oem_number}</p>
              </div>
            )}
            {product.part_number && (
              <div>
                <span className="text-muted-foreground">Part No.</span>
                <p className="font-medium text-foreground">{product.part_number}</p>
              </div>
            )}
            <div>
              <span className="text-muted-foreground">Availability</span>
              <p
                className={`font-medium inline-flex items-center gap-1 ${
                  inStock ? "text-emerald-600" : "text-danger"
                }`}
              >
                {inStock ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    In Stock ({product.stock})
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4" />
                    Out of Stock
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Bike compatibility */}
          {product.bike_models && product.bike_models.length > 0 && (
            <div>
              <p className="text-sm font-medium text-foreground mb-2">Compatible Models</p>
              <div className="flex flex-wrap gap-2">
                {product.bike_models.map((m) => (
                  <span
                    key={m.id}
                    className="text-xs px-3 py-1.5 rounded-full border border-border bg-card"
                  >
                    {m.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Quantity + actions */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-foreground">Quantity</span>
              <div className="flex items-center rounded-xl border border-border overflow-hidden">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2.5 hover:bg-muted transition-colors"
                  disabled={!inStock}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="px-4 py-2 min-w-[3rem] text-center font-medium">{quantity}</span>
                <button
                  type="button"
                  onClick={() =>
                    setQuantity(Math.min(product.stock ?? 1, quantity + 1))
                  }
                  className="p-2.5 hover:bg-muted transition-colors"
                  disabled={!inStock || quantity >= (product.stock ?? 0)}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!inStock}
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-primary-foreground font-medium hover:brightness-105 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <ShoppingCart className="h-5 w-5" />
                Add to Cart
              </button>
              <button
                type="button"
                onClick={handleBuyNow}
                disabled={!inStock}
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border-2 border-primary text-primary font-medium hover:bg-primary/5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Zap className="h-5 w-5" />
                Buy Now
              </button>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleWishlist}
                className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors ${
                  isInWishlist(product.id)
                    ? "border-danger/30 bg-danger/10 text-danger"
                    : "border-border hover:bg-muted/50"
                }`}
              >
                <Heart className={`h-4 w-4 ${isInWishlist(product.id) ? "fill-current" : ""}`} />
                Wishlist
              </button>
              <button
                type="button"
                onClick={handleCompare}
                className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors ${
                  isCompared(product.id)
                    ? "border-primary/30 bg-primary/10 text-primary"
                    : "border-border hover:bg-muted/50"
                }`}
              >
                <GitCompare className="h-4 w-4" />
                Compare
              </button>
            </div>
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            {[
              { icon: Truck, text: "Free shipping over ৳2,000" },
              { icon: RotateCcw, text: "Easy returns policy" },
              { icon: Shield, text: product.warranty ? `${product.warranty} warranty` : "Genuine parts guarantee" },
            ].map(({ icon: Icon, text }) => (
              <div
                key={text}
                className="flex items-center gap-2.5 p-3 rounded-xl border border-border bg-card text-xs text-muted-foreground"
              >
                <Icon className="h-4 w-4 text-primary shrink-0" />
                {text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detail tabs */}
      {tabs.length > 0 && (
        <div className="mt-12 md:mt-16">
          <div className="flex flex-wrap gap-2 border-b border-border pb-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 text-sm font-medium rounded-t-xl transition-colors ${
                  activeTab === tab.id
                    ? "text-primary border-b-2 border-primary bg-primary/5"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="py-8">
            {activeTab === "description" && product.description && (
              <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed whitespace-pre-line">
                {product.description}
              </div>
            )}

            {activeTab === "specification" && product.specification && (
              <div
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{
                  __html: product.specification || "<p>No specification added.</p>",
                }}
              />
            )}

            {activeTab === "reviews" && product.reviews && product.reviews.length > 0 && (
              <div className="space-y-4 max-w-3xl">
                {product.reviews.map((review: any) => (
                  <div
                    key={review.id}
                    className="p-5 rounded-2xl border border-border bg-card"
                  >
                    <div className="flex items-center justify-between gap-4 mb-2">
                      <StarRating rating={review.rating} />
                      <span className="text-xs text-muted-foreground">
                        {review.created_at
                          ? new Date(review.created_at).toLocaleDateString()
                          : ""}
                      </span>
                    </div>
                    {review.title && (
                      <p className="font-medium text-foreground mb-1">{review.title}</p>
                    )}
                    <p className="text-sm text-muted-foreground">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "installation" && product.installation_guide && (
              <div
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: product.installation_guide }}
              />
            )}
          </div>
        </div>
      )}

      {/* Extra product meta row */}
      {(product.weight || product.dimensions) && (
        <div className="mt-4 p-5 rounded-2xl border border-border bg-muted/20 flex flex-wrap gap-6 text-sm">
          {product.weight && (
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">Weight:</span>
              <span className="font-medium">{product.weight} kg</span>
            </div>
          )}
          {product.dimensions && (
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">Dimensions:</span>
              <span className="font-medium">{product.dimensions}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
