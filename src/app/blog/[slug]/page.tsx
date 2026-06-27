"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { fetchBlogBySlug, type BlogPost } from "@/lib/shopApi";
import { ArrowLeft, Calendar, User } from "lucide-react";

export default function BlogDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogBySlug(slug)
      .then(setPost)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto animate-pulse space-y-4">
        <div className="skeleton h-8 w-3/4 rounded" />
        <div className="skeleton h-4 w-1/2 rounded" />
        <div className="skeleton h-64 w-full rounded-xl" />
        <div className="skeleton h-4 w-full rounded" />
        <div className="skeleton h-4 w-full rounded" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-16">
        <h1 className="text-2xl font-bold">Post not found</h1>
        <Link href="/blog" className="btn-primary mt-4 inline-flex">Back to Blog</Link>
      </div>
    );
  }

  return (
    <article className="max-w-3xl mx-auto">
      <Link href="/blog" className="inline-flex items-center gap-1 text-sm text-primary hover:underline mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to Blog
      </Link>

      <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">{post.title}</h1>

      <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
        <span className="flex items-center gap-1"><User className="h-4 w-4" /> {post.author}</span>
        <span className="flex items-center gap-1">
          <Calendar className="h-4 w-4" />
          {post.published_at ? new Date(post.published_at).toLocaleDateString() : ""}
        </span>
      </div>

      <div className="h-64 rounded-2xl bg-gradient-to-br from-secondary to-primary/30 my-8 flex items-center justify-center">
        <span className="text-6xl font-black text-white/15">PLC</span>
      </div>

      <div
        className="prose-content"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </article>
  );
}
