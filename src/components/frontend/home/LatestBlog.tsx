"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { fetchBlogs, type BlogPost } from "@/lib/shopApi";
import { Calendar, ArrowRight } from "lucide-react";

interface LatestBlogProps {
  initialPosts?: BlogPost[];
}

export default function LatestBlog({ initialPosts }: LatestBlogProps) {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts ?? []);

  useEffect(() => {
    if (initialPosts?.length) return;
    fetchBlogs().then(setPosts).catch(() => {});
  }, [initialPosts]);

  if (!posts.length) return null;

  return (
    <section className="py-10 md:py-14">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="section-title">Latest from Our Blog</h2>
          <p className="section-subtitle">Tips, guides & industry news for riders</p>
        </div>
        <Link href="/blog" className="hidden sm:flex items-center gap-1 text-sm font-semibold text-primary">
          All Posts <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {posts.slice(0, 3).map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="group rounded-xl border border-border bg-card overflow-hidden card-hover"
          >
            <div className="h-44 bg-gradient-to-br from-secondary to-primary/30 flex items-center justify-center">
              <span className="text-4xl font-black text-white/20">PLC</span>
            </div>
            <div className="p-5">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                <Calendar className="h-3 w-3" />
                {post.published_at
                  ? new Date(post.published_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : ""}
              </div>
              <h3 className="font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                {post.title}
              </h3>
              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{post.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
