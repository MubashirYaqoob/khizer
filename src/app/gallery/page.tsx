"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  images: string[];
  category: {
    name: string;
  };
}

export default function GalleryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<{ url: string; productName: string; slug: string } | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        if (res.ok) {
          setProducts(data.products || []);
        }
      } catch (error) {
        console.error("Error fetching gallery items:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Gather all unique images with their parent product information
  const galleryItems = products.flatMap((product) =>
    product.images.map((image) => ({
      url: image,
      productName: product.name,
      slug: product.slug,
      category: product.category.name,
      price: product.price,
    }))
  );

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-cream">
        <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-cream min-h-screen py-12 md:py-20 font-montserrat">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-label-caps text-gold block mb-3">Brand Showcase</span>
          <h1 className="font-garamond text-display-lg-mobile md:text-display-lg text-primary mb-4">
            Our Lookbook & Gallery
          </h1>
          <p className="text-body-md text-text-muted">
            Explore the exquisite details of Khizar Fabric Store designs, textures, and custom fits in our curated lookbook.
          </p>
        </div>

        {galleryItems.length === 0 ? (
          <div className="bg-white p-8 text-center border border-primary/5 shadow-sm">
            <p className="text-body-md text-text-muted">No images found in the gallery.</p>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {galleryItems.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="relative overflow-hidden group cursor-pointer break-inside-avoid bg-white border border-primary/5 p-2 shadow-sm mb-4"
                onClick={() => setActiveImage({ url: item.url, productName: item.productName, slug: item.slug })}
              >
                <div className="relative overflow-hidden bg-cream aspect-[3/4]">
                  <img
                    src={item.url}
                    alt={item.productName}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <span className="text-white text-xs font-semibold uppercase tracking-wider mb-1">
                      {item.category}
                    </span>
                    <h3 className="font-garamond text-white text-lg font-medium">
                      {item.productName}
                    </h3>
                    <p className="text-gold text-sm font-medium">
                      Rs. {item.price.toLocaleString()}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox / Modal */}
      <AnimatePresence>
        {activeImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4"
            onClick={() => setActiveImage(null)}
          >
            <button
              onClick={() => setActiveImage(null)}
              className="absolute top-6 right-6 text-white text-3xl hover:text-gold transition-colors focus:outline-none cursor-pointer"
            >
              &times;
            </button>

            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="relative max-w-4xl max-h-[80vh] w-full h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={activeImage.url}
                alt={activeImage.productName}
                className="max-w-full max-h-[70vh] object-contain"
              />
            </motion.div>

            <div className="text-center mt-4 text-white">
              <h3 className="font-garamond text-xl mb-2">{activeImage.productName}</h3>
              <Link
                href={`/product/${activeImage.slug}`}
                className="btn-outline border-white text-white hover:bg-white hover:text-black py-2 px-6 text-xs"
              >
                View Product
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
