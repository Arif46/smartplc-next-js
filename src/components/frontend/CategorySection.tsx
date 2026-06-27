"use client";

import React from "react";
import Link from "next/link";
import ProductCard from "./ProductCard";

interface CategorySectionProps {
  title: string;
  slug: string;
  products: any[];
}

const CategorySection: React.FC<CategorySectionProps> = ({ title, slug, products }) => {
  const latestProducts = [...products]
    .sort((a, b) => (b.created_at ? new Date(b.created_at).getTime() : 0) - (a.created_at ? new Date(a.created_at).getTime() : 0))
    .slice(0, 4);

  return (
    <div className="py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="section-title">{title}</h2>
        <Link href={`/category/${slug}`} className="btn-secondary text-sm">
          View All
        </Link>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {latestProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default CategorySection;
