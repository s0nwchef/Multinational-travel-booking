import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

export default function TourGallery({ images }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="w-full">
      {/* Main Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-4">
        {/* Large Main Image */}
        <div
          onClick={() => {
            setCurrentImageIndex(0);
            setLightboxOpen(true);
          }}
          className="lg:col-span-2 lg:row-span-2 h-96 md:h-96 lg:h-[500px] rounded-3xl overflow-hidden cursor-pointer group"
        >
          <img
            src={images[0]}
            alt="Main tour image"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>

        {/* Grid Images - Top Row */}
        {images.slice(1, 3).map((image, index) => (
          <div
            key={index}
            onClick={() => {
              setCurrentImageIndex(index + 1);
              setLightboxOpen(true);
            }}
            className="h-48 md:h-48 lg:h-56 rounded-2xl overflow-hidden cursor-pointer group"
          >
            <img
              src={image}
              alt={`Tour image ${index + 2}`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>
        ))}

        {/* Grid Images - Bottom Row */}
        {images.slice(3, 5).map((image, index) => (
          <div
            key={index + 2}
            onClick={() => {
              setCurrentImageIndex(index + 3);
              setLightboxOpen(true);
            }}
            className="h-48 md:h-48 lg:h-56 rounded-2xl overflow-hidden cursor-pointer group relative"
          >
            <img
              src={image}
              alt={`Tour image ${index + 4}`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            {/* Show more overlay on last image */}
            {index === 1 && images.length > 5 && (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex(5);
                  setLightboxOpen(true);
                }}
                className="absolute inset-0 bg-black/60 flex items-center justify-center group-hover:bg-black/70 transition-colors cursor-pointer"
              >
                <span className="text-white font-bold text-2xl">+{images.length - 5}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center">
          {/* Close Button */}
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-6 right-6 z-60 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          {/* Image Container */}
          <div className="relative w-full h-full flex items-center justify-center px-4">
            <img
              src={images[currentImageIndex]}
              alt={`Tour image ${currentImageIndex + 1}`}
              className="max-w-full max-h-[90vh] object-contain"
            />

            {/* Navigation Buttons */}
            {images.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-4 p-3 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                >
                  <ChevronLeft className="w-6 h-6 text-white" />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-4 p-3 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                >
                  <ChevronRight className="w-6 h-6 text-white" />
                </button>

                {/* Image Counter */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium">
                  {currentImageIndex + 1} / {images.length}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
