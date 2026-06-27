"use client";

import React, { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Play, X, ZoomIn } from "lucide-react";
import ProductImage5DViewer from "./ProductImage5DViewer";
import { parseVideoEmbed } from "@/lib/productUtils";

interface ProductMediaGalleryProps {
  images: string[];
  productName: string;
  videoUrl?: string | null;
}

export default function ProductMediaGallery({
  images,
  productName,
  videoUrl,
}: ProductMediaGalleryProps) {
  const video = useMemo(() => parseVideoEmbed(videoUrl), [videoUrl]);
  const mediaItems = useMemo(() => {
    const list = images.length ? images : [];
    if (video) {
      return [...list, `__video__:${video.embedUrl}`];
    }
    return list;
  }, [images, video]);

  const [selected, setSelected] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const isVideoSelected = mediaItems[selected]?.startsWith("__video__:");
  const currentImage = !isVideoSelected ? mediaItems[selected] : mediaItems[0] || images[0];
  const currentVideoUrl = isVideoSelected
    ? mediaItems[selected].replace("__video__:", "")
    : null;

  const goPrev = () => setSelected((i) => (i - 1 + mediaItems.length) % mediaItems.length);
  const goNext = () => setSelected((i) => (i + 1) % mediaItems.length);

  if (!mediaItems.length) {
    return (
      <div className="aspect-square rounded-2xl bg-muted border border-border flex items-center justify-center text-muted-foreground">
        No image available
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col-reverse lg:flex-row gap-4">
        {/* Thumbnails */}
        <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-y-auto lg:max-h-[520px] shrink-0 pb-1 lg:pb-0 lg:w-20">
          {mediaItems.map((item, index) => {
            const isVideo = item.startsWith("__video__:");
            const thumbSrc = isVideo
              ? video?.thumbnailUrl || images[0]
              : item;
            const active = selected === index;

            return (
              <button
                key={`${item}-${index}`}
                type="button"
                onClick={() => setSelected(index)}
                className={`relative shrink-0 w-16 h-16 lg:w-20 lg:h-20 rounded-xl overflow-hidden border-2 transition-all ${
                  active
                    ? "border-primary ring-2 ring-primary/20 scale-[1.02]"
                    : "border-border hover:border-primary/40"
                }`}
              >
                <img src={thumbSrc} alt="" className="w-full h-full object-cover" />
                {isVideo && (
                  <span className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <Play className="h-5 w-5 text-white fill-white" />
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Main viewer */}
        <div className="flex-1 min-w-0 relative">
          {isVideoSelected && currentVideoUrl ? (
            <div className="aspect-square rounded-2xl overflow-hidden border border-border bg-black">
              {video?.type === "direct" ? (
                <video
                  src={currentVideoUrl}
                  controls
                  className="w-full h-full object-contain bg-black"
                  poster={images[0]}
                />
              ) : (
                <iframe
                  src={currentVideoUrl}
                  title={`${productName} video`}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
            </div>
          ) : (
            <ProductImage5DViewer
              src={currentImage}
              alt={productName}
              onOpenLightbox={() => setLightbox(true)}
            />
          )}

          {mediaItems.length > 1 && (
            <>
              <button
                type="button"
                onClick={goPrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/90 border border-border shadow-sm hover:bg-muted"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={goNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/90 border border-border shadow-sm hover:bg-muted"
                aria-label="Next image"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 rounded-full bg-background/85 backdrop-blur-sm border border-border text-xs text-muted-foreground">
            <ZoomIn className="h-3.5 w-3.5" />
            {selected + 1} / {mediaItems.length}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && !isVideoSelected && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(false)}
        >
          <button
            type="button"
            onClick={() => setLightbox(false)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <X className="h-6 w-6" />
          </button>
          <img
            src={currentImage}
            alt={productName}
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
          {mediaItems.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goPrev();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-white/20"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goNext();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-white/20"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
}
