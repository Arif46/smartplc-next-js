"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchBlogs, type BlogPost } from "@/lib/shopApi";
import { Calendar } from "lucide-react";
import ProductSkeleton from "@/components/frontend/ui/ProductSkeleton";

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs()
      .then(setPosts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="mb-10">
        <h1 className="section-title">Rider&apos;s Blog</h1>
        <p className="section-subtitle">
          Tips, guides, and news for motorcycle enthusiasts
        </p>
      </div>

      {loading ? (
        <ProductSkeleton count={3} />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group rounded-xl border border-border bg-card overflow-hidden card-hover"
            >
              <div className="h-48 bg-gradient-to-br from-secondary to-primary/30 flex items-center justify-center">
                <span className="text-5xl font-black text-white/15">PLC</span>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                  <Calendar className="h-3 w-3" />
                  {post.published_at
                    ? new Date(post.published_at).toLocaleDateString()
                    : ""}
                  · {post.author}
                </div>
                <h2 className="font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </h2>
                <p className="text-sm text-muted-foreground mt-2 line-clamp-3">{post.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
