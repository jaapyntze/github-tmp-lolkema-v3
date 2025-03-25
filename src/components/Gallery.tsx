import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useInView } from '../hooks/useInView';

const images = [
  {
    src: "images/hakselen.jpg",
    alt: "Tractor plowing field"
  },
  {
    src: "images/project.jpg",
    alt: "Harvesting wheat"
  },
  {
    src: "images/sleepslangen 2.jpg",
    alt: "Aerial view of farmland"
  },
  {
    src: "images/zaaien.jpg",
    alt: "Spraying crops"
  },
  {
    src: "images/vrachtauto.jpg",
    alt: "Planting season"
  },
  {
    src: "images/persen.jpg",
    alt: "Farm equipment"
  }
];

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [ref, isInView] = useInView({ threshold: 0.1 });

  const openLightbox = (index: number) => {
    setSelectedImage(index);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const goToPrevious = () => {
    setSelectedImage((prev) => (prev === 0 ? images.length - 1 : prev! - 1));
  };

  const goToNext = () => {
    setSelectedImage((prev) => (prev === images.length - 1 ? 0 : prev! + 1));
  };

  return (
    <section id="gallery" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Onze Projecten
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            Een blik op onze werkzaamheden en machines in actie.
          </p>
        </div>

        <div 
          ref={ref as React.RefObject<HTMLDivElement>}
          className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {images.map((image, index) => (
            <div 
              key={index} 
              className={`overflow-hidden rounded-lg shadow-md cursor-pointer hover:shadow-xl transition-all duration-700 transform ${
                isInView 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
              onClick={() => openLightbox(index)}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-64 object-cover hover:scale-105 transition duration-500"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {selectedImage !== null && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4">
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300"
            onClick={closeLightbox}
          >
            <X className="h-8 w-8" />
          </button>
          
          <button
            className="absolute left-4 text-white hover:text-gray-300"
            onClick={goToPrevious}
          >
            <ChevronLeft className="h-12 w-12" />
          </button>
          
          <img
            src={images[selectedImage].src}
            alt={images[selectedImage].alt}
            className="max-h-[80vh] max-w-[90vw] object-contain"
          />
          
          <button
            className="absolute right-4 text-white hover:text-gray-300"
            onClick={goToNext}
          >
            <ChevronRight className="h-12 w-12" />
          </button>
        </div>
      )}
    </section>
  );
};

export default Gallery;