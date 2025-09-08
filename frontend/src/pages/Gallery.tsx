import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import GalleryComponent from '@/components/Gallery';
import { api } from '@/lib/api';
import '@/styles/animations.css';

const Gallery = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [useDynamicGallery, setUseDynamicGallery] = useState(false);
  
  // Check if we have gallery images in the database
  useEffect(() => {
    const checkGalleryImages = async () => {
      try {
        const response = await api.gallery.getAll();

        if (!response.success || !response.data) {
          throw new Error(response.message || 'Failed to fetch gallery images');
        }
        
        const images = response.data.images || [];
        setUseDynamicGallery(images.length > 0);
      } catch (error) {
        console.error('Error checking gallery images:', error);
        setUseDynamicGallery(false);
      }
    };
    
    checkGalleryImages();
  }, []);

  // Sample gallery images - will be replaced with dynamic admin content
  const galleryImages = [
    {
      id: 1,
      url: '/images/facilites/01.webp',
      title: 'Practice Nets Training',
      category: 'training',
      description: 'Students practicing batting techniques in our professional nets'
    },
    {
      id: 2,
      url: '/images/facilites/02.jpg',
      title: 'Ground Practice Session',
      category: 'training',
      description: 'Team practice session on our main cricket ground'
    },
    {
      id: 3,
      url: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      title: 'Cricket Match Action',
      category: 'matches',
      description: 'Exciting match moment captured during inter-academy tournament'
    },
    {
      id: 4,
      url: '/images/galary/01.jpeg',
      title: 'Team Celebration',
      category: 'events',
      description: 'Victory celebration after winning the championship'
    },
    {
      id: 5,
      url: '/images/facilites/03.webp',
      title: 'Indoor Training Facility',
      category: 'facilities',
      description: 'State-of-the-art indoor training hall'
    },
    {
      id: 6,
      url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      title: 'Fitness Training',
      category: 'training',
      description: 'Cricket-specific fitness training session'
    },
    {
      id: 7,
      url: '/images/galary/02.avif',
      title: 'Awards Ceremony',
      category: 'events',
      description: 'Annual awards ceremony recognizing outstanding performers'
    },
    {
      id: 8,
      url: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      title: 'Bowling Practice',
      category: 'training',
      description: 'Young bowlers perfecting their technique'
    },
    {
      id: 9,
      url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      title: 'Equipment Room',
      category: 'facilities',
      description: 'Well-organized equipment storage facility'
    },
    {
      id: 11,
      url: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      title: 'Junior Training',
      category: 'training',
      description: 'Young cricketers learning the basics'
    },
    {
      id: 12,
      url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      title: 'Coaching Session',
      category: 'training',
      description: 'One-on-one coaching with professional instructor'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Photos', count: galleryImages.length },
    { id: 'training', name: 'Training', count: galleryImages.filter(img => img.category === 'training').length },
    { id: 'matches', name: 'Matches', count: galleryImages.filter(img => img.category === 'matches').length },
    { id: 'events', name: 'Events', count: galleryImages.filter(img => img.category === 'events').length },
    { id: 'facilities', name: 'Facilities', count: galleryImages.filter(img => img.category === 'facilities').length }
  ];

  const filteredImages = selectedCategory === 'all' 
    ? galleryImages 
    : galleryImages.filter(img => img.category === selectedCategory);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const openLightbox = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cricket-orange mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading Gallery...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      
      {useDynamicGallery ? (
        <GalleryComponent />
      ) : (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
          {/* Hero Section */}
          <section className="relative py-20 bg-gradient-to-r from-cricket-green to-cricket-orange overflow-hidden">
            <div className="absolute inset-0 bg-black/20"></div>
            
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <div className="animate-fadeInUp">
                <h1 className="text-5xl md:text-7xl font-bold font-poppins text-white mb-6">
                  Our
                  <span className="block gradient-text-gallery">Gallery</span>
                </h1>
                <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-4xl mx-auto leading-relaxed">
                  Capturing moments of excellence, dedication, and triumph
                </p>
                <div className="flex justify-center">
                  <div className="bg-white/10 backdrop-blur-md rounded-full px-6 py-3 border border-white/20">
                    <span className="text-white font-semibold">📸 {galleryImages.length} Photos & Counting</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute top-20 left-10 animate-float">
              <div className="w-4 h-4 bg-white/20 rounded-full"></div>
            </div>
            <div className="absolute top-40 right-20 animate-float-delayed">
              <div className="w-6 h-6 bg-white/30 rounded-full"></div>
            </div>
            <div className="absolute bottom-20 left-1/4 animate-float">
              <div className="w-3 h-3 bg-white/25 rounded-full"></div>
            </div>
          </section>

          {/* Category Filter */}
          <section className="py-12 bg-white sticky top-16 z-40 shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-wrap justify-center gap-4">
                {categories.map((category, index) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`
                      px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105
                      ${selectedCategory === category.id 
                        ? 'bg-cricket-orange hover:bg-cricket-orange/90 text-white shadow-lg' 
                        : 'border-2 border-cricket-green text-cricket-green hover:bg-cricket-green hover:text-white'
                      }
                      animate-slideInUp
                    `}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {category.name}
                    <Badge 
                      variant="secondary" 
                      className={`ml-2 ${selectedCategory === category.id ? 'bg-white/20 text-white' : 'bg-cricket-green/10 text-cricket-green'}`}
                    >
                      {category.count}
                    </Badge>
                  </Button>
                ))}
              </div>
            </div>
          </section>

          {/* Gallery Grid */}
          <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredImages.map((image, index) => (
                  <Card 
                    key={image.id}
                    className="group overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer bg-white animate-fadeInUp border border-gray-200"
                    style={{ animationDelay: `${index * 0.1}s` }}
                    onClick={() => openLightbox(image.url)}
                  >
                    <div className="relative aspect-square overflow-hidden">
                      <img
                        src={image.url}
                        alt={image.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                      />
                      
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-4 left-4 right-4 text-white">
                          <h3 className="font-bold text-lg mb-1">{image.title}</h3>
                          <p className="text-sm text-white/90">{image.description}</p>
                        </div>
                      </div>

                      {/* Category Badge */}
                      <div className="absolute top-3 right-3">
                        <Badge 
                          className="bg-cricket-orange/90 text-white capitalize backdrop-blur-sm"
                        >
                          {image.category}
                        </Badge>
                      </div>

                      {/* Zoom Icon */}
                      <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Empty State */}
              {filteredImages.length === 0 && (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">📸</div>
                  <h3 className="text-2xl font-bold text-gray-600 mb-2">No photos in this category</h3>
                  <p className="text-gray-500">Check back soon for more amazing moments!</p>
                </div>
              )}
            </div>
          </section>

          {/* Call to Action */}
          <section className="py-16 bg-gradient-to-r from-cricket-green to-cricket-orange">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-4xl font-bold font-poppins text-white mb-6 animate-fadeInUp">
                Want to Be Part of Our Story?
              </h2>
              <p className="text-xl text-white/90 mb-8 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                Join our academy and create your own moments of cricket excellence
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
                <Button
                  size="lg"
                  className="bg-white text-cricket-green hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-full transform transition-all duration-300 hover:scale-105"
                  onClick={() => navigate('/contact')}
                >
                  🚀 Join Academy
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white bg-transparent text-white hover:bg-white hover:text-cricket-green px-8 py-4 text-lg font-semibold rounded-full transform transition-all duration-300 hover:scale-105"
                  onClick={() => navigate('/programs')}
                >
                  📋 View Programs
                </Button>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 animate-fadeIn"
          onClick={closeLightbox}
        >
          <div className="relative max-w-4xl max-h-full">
            <img
              src={selectedImage}
              alt="Gallery Image"
              className="max-w-full max-h-full object-contain animate-scaleIn"
            />
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Gallery;