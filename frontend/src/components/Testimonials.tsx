import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { dbService } from '@/lib/api';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  image_url: string;
  is_featured: boolean;
  created_at: string;
}

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [featuredTestimonials, setFeaturedTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchTestimonials();
    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (featuredTestimonials.length > 0) {
      startAutoplay();
    }
    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
      }
    };
  }, [featuredTestimonials]);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await dbService.testimonials.getTestimonials();
      
      if (response.status === 'error' || !response.data) {
        throw new Error(response.message || 'Failed to fetch testimonials');
      }

      const testimonialData = response.data.testimonials || [];
      setTestimonials(testimonialData);
      
      // Filter featured testimonials for the carousel
      const featured = testimonialData.filter(t => t.is_featured) || [];
      setFeaturedTestimonials(featured.length > 0 ? featured : testimonialData.slice(0, 3) || []);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      setError('Failed to load testimonials. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const startAutoplay = () => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
    }
    
    autoplayRef.current = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % featuredTestimonials.length);
    }, 5000);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
    }
    startAutoplay();
  };

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, index) => (
      <span key={index} className={index < rating ? 'text-yellow-400' : 'text-gray-300'}>★</span>
    ));
  };

  return (
    <section id="testimonials" className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-cricket-green mb-4">What Our Students Say</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Hear from our students and parents about their experiences at Kalyan Cricket Academy.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin text-4xl">⏳</div>
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">
            <p>{error}</p>
            <Button 
              onClick={fetchTestimonials} 
              variant="outline" 
              className="mt-4"
            >
              Try Again
            </Button>
          </div>
        ) : featuredTestimonials.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <div className="text-5xl mb-4">⭐</div>
            <p>No testimonials available yet</p>
          </div>
        ) : (
          <>
            {/* Featured Testimonials Carousel */}
            <div className="relative mb-16 overflow-hidden" ref={sliderRef}>
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {featuredTestimonials.map((testimonial, index) => (
                  <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
                    <div className="max-w-4xl mx-auto">
                      <Card className="bg-white shadow-lg overflow-visible border border-gray-200">
                        <CardContent className="p-0">
                          <div className="relative p-8 md:p-12">
                            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-lg">
                              <img 
                                src={testimonial.image_url} 
                                alt={testimonial.name} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                            
                            <div className="text-center pt-12">
                              <div className="text-yellow-400 text-xl mb-4">
                                {renderStars(testimonial.rating)}
                              </div>
                              <p className="text-gray-700 italic mb-6 text-lg">
                                "{testimonial.content}"
                              </p>
                              <div>
                                <h4 className="font-bold text-cricket-green text-xl">{testimonial.name}</h4>
                                <p className="text-gray-500">{testimonial.role}</p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Navigation Dots */}
              <div className="flex justify-center mt-8">
                {featuredTestimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-3 h-3 mx-1 rounded-full transition-all duration-300 ${
                      index === currentSlide ? 'bg-cricket-orange w-6' : 'bg-gray-300'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
              
              {/* Navigation Arrows */}
              {featuredTestimonials.length > 1 && (
                <>
                  <button
                    onClick={() => goToSlide((currentSlide - 1 + featuredTestimonials.length) % featuredTestimonials.length)}
                    className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/80 hover:bg-white w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-all duration-300"
                    aria-label="Previous testimonial"
                  >
                    ←
                  </button>
                  <button
                    onClick={() => goToSlide((currentSlide + 1) % featuredTestimonials.length)}
                    className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80 hover:bg-white w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-all duration-300"
                    aria-label="Next testimonial"
                  >
                    →
                  </button>
                </>
              )}
            </div>
            
            {/* All Testimonials Grid */}
            <div className="mt-16">
              <h3 className="text-2xl font-bold text-cricket-green text-center mb-8">More Success Stories</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {testimonials.filter(t => !featuredTestimonials.some(ft => ft.id === t.id)).slice(0, 6).map((testimonial) => (
                  <Card key={testimonial.id} className="hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                          <img
                            src={testimonial.image_url}
                            alt={testimonial.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="font-semibold">{testimonial.name}</h4>
                          <p className="text-sm text-gray-600">{testimonial.role}</p>
                        </div>
                      </div>
                      <div className="text-yellow-400 text-sm mb-3">
                        {renderStars(testimonial.rating)}
                      </div>
                      <p className="text-gray-700 text-sm italic line-clamp-4">
                        "{testimonial.content}"
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Testimonials;