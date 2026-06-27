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

export function resolveProductGallery(product: {
  image?: string | null;
  image_url?: string | null;
  gallery?: string[] | null;
  gallery_urls?: string[] | null;
}): string[] {
  const main = resolveProductImage(product);
  const fromApi = product.gallery_urls?.filter(Boolean) ?? [];
  const fromGallery =
    product.gallery?.map((img) => getProductImageUrl(img)).filter(Boolean) ?? [];

  const all = [main, ...fromApi, ...fromGallery].filter(Boolean);
  return [...new Set(all)];
}

export type VideoEmbed = {
  type: "youtube" | "vimeo" | "direct" | "unknown";
  embedUrl: string;
  thumbnailUrl?: string;
};

export function parseVideoEmbed(videoUrl?: string | null): VideoEmbed | null {
  if (!videoUrl?.trim()) return null;

  const url = videoUrl.trim();

  const youtubeMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/
  );
  if (youtubeMatch) {
    const id = youtubeMatch[1];
    return {
      type: "youtube",
      embedUrl: `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1`,
      thumbnailUrl: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
    };
  }

  const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeoMatch) {
    return {
      type: "vimeo",
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}`,
    };
  }

  if (/\.(mp4|webm|ogg)(\?|$)/i.test(url) || url.startsWith("blob:")) {
    return { type: "direct", embedUrl: url };
  }

  return { type: "unknown", embedUrl: url };
}
