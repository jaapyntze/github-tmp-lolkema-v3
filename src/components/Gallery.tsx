import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useInView } from '../hooks/useInView';

const images = [
  {
    id: 'hakselen',
    srcset: {
      '480w': 'https://xjwlrohfjskzalfgvbug.supabase.co/storage/v1/object/public/public/Home/hakselen-480w.jpg',
      '768w': 'https://xjwlrohfjskzalfgvbug.supabase.co/storage/v1/object/public/public/Home/hakselen-768w.jpg',
      '1024w': 'https://xjwlrohfjskzalfgvbug.supabase.co/storage/v1/object/public/public/Home/hakselen-1024w.jpg',
      'full': 'https://xjwlrohfjskzalfgvbug.supabase.co/storage/v1/object/public/public/Home/hakselen.jpg'
    },
    alt: "Mais hakselen met moderne hakselaar"
  },
  {
    id: 'project',
    srcset: {
      '480w': 'https://xjwlrohfjskzalfgvbug.supabase.co/storage/v1/object/public/public/Home/project-480w.jpg',
      '768w': 'https://xjwlrohfjskzalfgvbug.supabase.co/storage/v1/object/public/public/Home/project-768w.jpg',
      '1024w': 'https://xjwlrohfjskzalfgvbug.supabase.co/storage/v1/object/public/public/Home/project-1024w.jpg',
      'full': 'https://xjwlrohfjskzalfgvbug.supabase.co/storage/v1/object/public/public/Home/project.jpg'
    },
    alt: "Grondwerk project in uitvoering"
  },
  {
    id: 'bemesten',
    srcset: {
      '480w': 'https://xjwlrohfjskzalfgvbug.supabase.co/storage/v1/object/public/public/Home/bemesten-480w.jpg',
      '768w': 'https://xjwlrohfjskzalfgvbug.supabase.co/storage/v1/object/public/public/Home/bemesten-768w.jpg',
      '1024w': 'https://xjwlrohfjskzalfgvbug.supabase.co/storage/v1/object/public/public/Home/bemesten-1024w.jpg',
      'full': 'https://xjwlrohfjskzalfgvbug.supabase.co/storage/v1/object/public/public/Home/bemesten.jpg'
    },
    alt: "Bemesten met bemester"
  },
  {
    id: 'zaaien',
    srcset: {
      '480w': 'https://xjwlrohfjskzalfgvbug.supabase.co/storage/v1/object/public/public/Home/zaaien-480w.jpg',
      '768w': 'https://xjwlrohfjskzalfgvbug.supabase.co/storage/v1/object/public/public/Home/zaaien-768w.jpg',
      '1024w': 'https://xjwlrohfjskzalfgvbug.supabase.co/storage/v1/object/public/public/Home/zaaien-1024w.jpg',
      'full': 'https://xjwlrohfjskzalfgvbug.supabase.co/storage/v1/object/public/public/Home/zaaien.jpg'
    },
    alt: "Precisie zaaien met GPS technologie"
  },
  {
    id: 'vrachtwagen',
    srcset: {
      '480w': 'https://xjwlrohfjskzalfgvbug.supabase.co/storage/v1/object/public/public/Home/vrachtwagen2-480w.jpg',
      '768w': 'https://xjwlrohfjskzalfgvbug.supabase.co/storage/v1/object/public/public/Home/vrachtwagen2-768w.jpg',
      '1024w': 'https://xjwlrohfjskzalfgvbug.supabase.co/storage/v1/object/public/public/Home/vrachtwagen2-1024w.jpg',
      'full': 'https://xjwlrohfjskzalfgvbug.supabase.co/storage/v1/object/public/public/Home/vrachtwagen2.jpg'
    },
    alt: "Mest vervoer met vrachtwagen"
  },
  {
    id: 'persen',
    srcset: {
      '480w': 'https://xjwlrohfjskzalfgvbug.supabase.co/storage/v1/object/public/public/Home/persen-480w.jpg',
      '768w': 'https://xjwlrohfjskzalfgvbug.supabase.co/storage/v1/object/public/public/Home/persen-768w.jpg',
      '1024w': 'https://xjwlrohfjskzalfgvbug.supabase.co/storage/v1/object/public/public/Home/persen-1024w.jpg',
      'full': 'https://xjwlrohfjskzalfgvbug.supabase.co/storage/v1/object/public/public/Home/persen.jpg'
    },
    alt: "Gras persen in balen"
  }
];

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [titleRef, isTitleInView] = useInView({ threshold: 0.1 });

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

  const getSrcSet = (image: typeof images[0]) => {
    return Object.entries(image.srcset)
      .map(([size, url]) => size === 'full' ? url : `${url} ${size}`)
      .join(', ');
  };

  const GalleryImage = ({ image, index }: { image: typeof images[0], index: number }) => {
    const [ref, isInView] = useInView({ threshold: 0.1 });

    return (
      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        className={`overflow-hidden rounded-lg shadow-md cursor-pointer hover:shadow-xl transition-all duration-700 transform ${
          isInView 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-10'
        }`}
        style={{ transitionDelay: `${index * 100}ms` }}
        onClick={() => openLightbox(index)}
      >
        <img
          src={image.srcset.full}
          srcSet={getSrcSet(image)}
          sizes="(max-width: 640px) 100vw,
                 (max-width: 1024px) 50vw,
                 33vw"
          alt={image.alt}
          className="w-full h-64 object-cover hover:scale-105 transition duration-500"
          loading="lazy"
        />
      </div>
    );
  };

  return (
    <section id="gallery" className="py-28 bg-secondary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          ref={titleRef as React.RefObject<HTMLDivElement>}
          className={`text-center transition-all duration-700 transform ${
            isTitleInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className="text-3xl font-extrabold text-secondary-900 sm:text-4xl">
            Onze Projecten
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-secondary-500">
            Een blik op onze werkzaamheden en machines in actie.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image, index) => (
            <GalleryImage key={image.id} image={image} index={index} />
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {selectedImage !== null && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4">
          <button
            className="absolute top-4 right-4 text-white hover:text-secondary-300"
            onClick={closeLightbox}
          >
            <X className="h-8 w-8" />
          </button>
          
          <button
            className="absolute left-4 text-white hover:text-secondary-300"
            onClick={goToPrevious}
          >
            <ChevronLeft className="h-12 w-12" />
          </button>
          
          <img
            src={images[selectedImage].srcset.full}
            srcSet={getSrcSet(images[selectedImage])}
            sizes="(max-width: 1200px) 90vw, 1200px"
            alt={images[selectedImage].alt}
            className="max-h-[80vh] max-w-[90vw] object-contain"
          />
          
          <button
            className="absolute right-4 text-white hover:text-secondary-300"
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