const BIKE_PRODUCT_PLACEHOLDER =
  "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&h=600&q=80";

export function getProductImageUrl(image?: string | null): string {
  if (!image) return BIKE_PRODUCT_PLACEHOLDER;
  if (image.startsWith("http")) return image;
  return `${process.env.NEXT_PUBLIC_API_BASE_URL}/storage/products/${image}`;
}

export function resolveProductImage(product: {
  image?: string | null;
  image_url?: string | null;
}): string {
  if (product.image_url) return product.image_url;
  return getProductImageUrl(product.image);
}

export function formatPrice(price: number): string {
  return `৳${price.toLocaleString("en-BD")}`;
}

export function getEffectivePrice(product: {
  purchase_price: number;
  sale_price?: number | null;
}): number {
  return product.sale_price ?? product.purchase_price;
}

export function getDiscountPercent(product: {
  purchase_price: number;
  sale_price?: number | null;
  discount_percent?: number;
}): number {
  if (product.discount_percent) return product.discount_percent;
  if (product.sale_price && product.purchase_price > product.sale_price) {
    return Math.round(
      ((product.purchase_price - product.sale_price) / product.purchase_price) * 100
    );
  }
  return 0;
}
