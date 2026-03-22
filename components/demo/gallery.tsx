"use client"

import { useState } from "react"
import { Camera } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"
import { getGalleryImages } from "@/lib/image-map"
import { DemoConfig } from "@/lib/types"

export function Gallery({ config }: { config: DemoConfig }) {
  const images = getGalleryImages(config.services.map((s) => s.id))
  const [selectedImage, setSelectedImage] = useState<{ src: string; caption: string } | null>(null)

  return (
    <section id="gallery" className="py-16 md:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        {/* Heading */}
        <div className="text-center mb-12">
          <p className="text-accent-amber font-semibold text-sm uppercase tracking-wider mb-2">
            Our Work
          </p>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy-900">
            Recent Projects
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((img, i) => (
            <GalleryItem
              key={i}
              img={img}
              onClick={() => setSelectedImage(img)}
            />
          ))}
        </div>
      </div>

      {/* Lightbox dialog */}
      <Dialog open={!!selectedImage} onOpenChange={(open) => { if (!open) setSelectedImage(null) }}>
        <DialogContent className="max-w-3xl p-2">
          <DialogTitle className="sr-only">
            {selectedImage?.caption ?? "Gallery image"}
          </DialogTitle>
          {selectedImage && (
            <img
              src={selectedImage.src}
              alt={selectedImage.caption}
              className="w-full rounded-lg object-contain max-h-[80vh]"
            />
          )}
          {selectedImage && (
            <p className="text-center text-sm text-slate-600 py-2 px-4">
              {selectedImage.caption}
            </p>
          )}
        </DialogContent>
      </Dialog>
    </section>
  )
}

function GalleryItem({
  img,
  onClick,
}: {
  img: { src: string; caption: string }
  onClick: () => void
}) {
  const [imgError, setImgError] = useState(false)

  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative aspect-square overflow-hidden rounded-xl bg-slate-100 cursor-pointer w-full"
    >
      {imgError ? (
        <div className="w-full h-full bg-slate-200 flex items-center justify-center">
          <Camera size={32} className="text-slate-400" />
        </div>
      ) : (
        <img
          src={img.src}
          alt={img.caption}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={() => setImgError(true)}
        />
      )}
      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
        <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 backdrop-blur text-navy-900 px-4 py-2 rounded-full font-medium text-sm">
          {img.caption}
        </span>
      </div>
    </button>
  )
}
