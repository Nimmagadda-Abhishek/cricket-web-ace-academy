import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface GalleryImage {
  id: string;
  title: string;
  description: string | null;
  url: string;
  category: string;
  created_at: string;
}

const Gallery = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [filteredImages, setFilteredImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchGalleryImages();
  }, []);

  useEffect(() => {
    if (activeCategory === 'all') {
      setFilteredImages(images);
    } else {
      setFilteredImages(images.filter(image => image.category === activeCategory));
    }
  }, [activeCategory, images]);

  const fetchGalleryImages = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setImages(data || []);
      setFilteredImages(data || []);
    } catch (error) {
      console.error('Error fetching gallery images:', error);
      setError('Failed to load gallery images. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: 'all', name: 'All Images' },
    { id: 'general', name: 'General' },
    { id: 'training', name: 'Training' },
    { id: 'matches', name: 'Matches' },
    { id: 'events', name: 'Events' },
    { id: 'facilities', name: 'Facilities' }
  ];

  const openLightbox = (image: GalleryImage) => {
    setSelectedImage(image);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'auto';
  };

  return (
    <section id="gallery" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold gradient-text-gallery mb-4">Our Gallery</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our collection of images showcasing our academy's facilities, training sessions, matches, and special events.
          </p>
        </div>

        <Tabs defaultValue="all" className="w-full mb-8">
          <div className="flex justify-center mb-6">
            <TabsList className="bg-white shadow-md">
              {categories.map(category => (
                <TabsTrigger 
                  key={category.id} 
                  value={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className="px-4 py-2 data-[state=active]:bg-cricket-green data-[state=active]:text-white"
                >
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <TabsContent value={activeCategory} className="mt-0">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin text-4xl">⏳</div>
              </div>
            ) : error ? (
              <div className="text-center py-12 text-red-500">
                <p>{error}</p>
                <Button 
                  onClick={fetchGalleryImages} 
                  variant="outline" 
                  className="mt-4"
                >
                  Try Again
                </Button>
              </div>
            ) : filteredImages.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <div className="text-5xl mb-4">🖼️</div>
                <p>No images found in this category</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredImages.map((image) => (
                  <Card 
                    key={image.id} 
                    className="overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer group"
                    onClick={() => openLightbox(image)}
                  >
                    <div className="aspect-square relative">
                      <img
                        src={image.url}
                        alt={image.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                        <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0">
                          <span className="text-2xl">🔍</span>
                        </div>
                      </div>
                      <div className="absolute top-2 right-2">
                        <span className="bg-cricket-green text-white text-xs px-2 py-1 rounded-full">
                          {image.category}
                        </span>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold truncate">{image.title}</h3>
                      {image.description && (
                        <p className="text-sm text-gray-500 line-clamp-2 h-10">
                          {image.description}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <div 
            className="max-w-4xl w-full bg-white rounded-lg overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <img 
                src={selectedImage.url} 
                alt={selectedImage.title} 
                className="w-full max-h-[70vh] object-contain"
              />
              <button 
                onClick={closeLightbox}
                className="absolute top-4 right-4 bg-black bg-opacity-50 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-opacity-70 transition-all"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">{selectedImage.title}</h3>
              {selectedImage.description && (
                <p className="text-gray-600 mb-4">{selectedImage.description}</p>
              )}
              <div className="flex justify-between items-center">
                <span className="bg-cricket-green text-white text-xs px-2 py-1 rounded-full">
                  {selectedImage.category}
                </span>
                <span className="text-sm text-gray-500">
                  {new Date(selectedImage.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Gallery;