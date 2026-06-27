"use client";

import { useEffect, useState } from "react";
import { fetchHomepageData, type HomepageData } from "@/lib/shopApi";
import HeroSlider from "@/components/frontend/home/HeroSlider";
import PromoBanner from "@/components/frontend/home/PromoBanner";
import FeaturedCategories from "@/components/frontend/home/FeaturedCategories";
import PopularBrands from "@/components/frontend/home/PopularBrands";
import ProductSliderSection from "@/components/frontend/home/ProductSliderSection";
import ShopByBikeModel from "@/components/frontend/home/ShopByBikeModel";
import WhyChooseUs from "@/components/frontend/home/WhyChooseUs";
import LatestBlog from "@/components/frontend/home/LatestBlog";
import NewsletterSection from "@/components/frontend/home/NewsletterSection";
import ProductSkeleton from "@/components/frontend/ui/ProductSkeleton";

export default function Home() {
  const [data, setData] = useState<HomepageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHomepageData()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-2 md:space-y-4 -mx-4 sm:mx-0">
      <section className="px-4 sm:px-0">
        <HeroSlider initialSliders={data?.sliders} />
      </section>

      <div className="max-w-7xl mx-auto px-4">
        <PromoBanner />
        <FeaturedCategories initialCategories={data?.categories} />
        <PopularBrands initialBrands={data?.featured_brands} />

        {loading ? (
          <ProductSkeleton count={4} />
        ) : (
          <>
            <ProductSliderSection title="Flash Sale" subtitle="Limited time offers on top bike parts" products={data?.flash_sale ?? []} accent="danger" />
            <ProductSliderSection title="Today's Deals" subtitle="Best prices on top-rated parts" products={data?.on_sale ?? []} accent="danger" />
            <ProductSliderSection title="Best Sellers" subtitle="Most popular parts among riders" products={data?.best_sellers ?? []} />
            <ProductSliderSection title="New Arrivals" subtitle="Fresh stock just landed" products={data?.new_arrivals ?? []} accent="accent" />
            <ProductSliderSection title="Featured Products" subtitle="Hand-picked by our experts" products={data?.featured ?? []} />
            <ProductSliderSection title="Trending Now" subtitle="What riders are browsing right now" products={data?.trending ?? []} />
            <ProductSliderSection title="Top Rated" subtitle="Highest rated by our customers" products={data?.top_rated ?? []} />
            <ProductSliderSection title="Recently Added" subtitle="Latest additions to our catalog" products={data?.recent ?? []} />
          </>
        )}

        <ShopByBikeModel initialCompanies={data?.bike_companies} />
        <WhyChooseUs />
        <LatestBlog initialPosts={data?.blogs} />
        <NewsletterSection />
      </div>
    </div>
  );
}
