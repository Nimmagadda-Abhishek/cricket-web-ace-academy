import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { programsApi } from '@/services/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BadgeIndianRupeeIcon, SearchIcon, FilterIcon } from 'lucide-react';

interface Program {
  _id: string;
  title: string;
  description: string;
  ageGroup: string;
  duration: string;
  price: number;
  features: string[];
  icon: string;
  color: string;
  image: string;
  level: string;
  category: string;
  coach: {
    name: string;
    specialization: string[];
    rating: {
      average: number;
    };
  };
  discount?: {
    type: string;
    value: number;
    validUntil: string;
    description: string;
  };
}

const Programs: React.FC = () => {
  const navigate = useNavigate();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('default');

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        setLoading(true);
        const response = await programsApi.getPrograms();
        setPrograms(response.data.programs);
      } catch (err: any) {
        setError(err.message || 'Failed to load programs');
        console.error('Error fetching programs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, []);

  const calculateDiscount = (price: number, discount?: { type: string; value: number }) => {
    if (!discount) return price;
    
    if (discount.type === 'percentage') {
      return price - (price * (discount.value / 100));
    } else if (discount.type === 'fixed') {
      return price - discount.value;
    }
    
    return price;
  };

  const handleProgramClick = (programId: string) => {
    navigate(`/programs/${programId}`);
  };

  const filteredPrograms = programs
    .filter(program => {
      // Search filter
      if (searchTerm && !program.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
          !program.description.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      // Category filter
      if (categoryFilter !== 'all' && program.category !== categoryFilter) {
        return false;
      }
      
      // Level filter
      if (levelFilter !== 'all' && program.level !== levelFilter) {
        return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      // Sort options
      switch (sortBy) {
        case 'price-low':
          return calculateDiscount(a.price, a.discount) - calculateDiscount(b.price, b.discount);
        case 'price-high':
          return calculateDiscount(b.price, b.discount) - calculateDiscount(a.price, a.discount);
        case 'name-asc':
          return a.title.localeCompare(b.title);
        case 'name-desc':
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="mb-8">
            <Skeleton className="h-12 w-1/3 mb-4" />
            <Skeleton className="h-6 w-2/3 mb-8" />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-96 w-full rounded-lg" />
            ))}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Error Loading Programs</h2>
            <p className="mb-6">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      
      <div className="bg-gradient-to-b from-cricket-green/10 to-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold font-poppins heading-gradient mb-4">
              Cricket Training Programs
            </h1>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              Explore our comprehensive range of cricket programs designed for all ages and skill levels,
              each crafted to unlock your full potential on the field.
            </p>
          </div>
          
          {/* Filters */}
          <div className="mb-12 bg-white p-6 rounded-lg shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Search programs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="junior">Junior</SelectItem>
                    <SelectItem value="youth">Youth</SelectItem>
                    <SelectItem value="adult">Adult</SelectItem>
                    <SelectItem value="elite">Elite</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Select value={levelFilter} onValueChange={setLevelFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                    <SelectItem value="mixed">Mixed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="name-asc">Name: A to Z</SelectItem>
                    <SelectItem value="name-desc">Name: Z to A</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {(searchTerm || categoryFilter !== 'all' || levelFilter !== 'all') && (
              <div className="mt-4 flex items-center">
                <FilterIcon className="h-4 w-4 text-cricket-orange mr-2" />
                <span className="text-sm text-gray-600">
                  Showing {filteredPrograms.length} of {programs.length} programs
                </span>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="ml-4 text-sm"
                  onClick={() => {
                    setSearchTerm('');
                    setCategoryFilter('all');
                    setLevelFilter('all');
                    setSortBy('default');
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
          
          {/* Programs Grid */}
          {filteredPrograms.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <h3 className="text-2xl font-semibold text-gray-700 mb-2">No Programs Found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria</p>
              <Button 
                onClick={() => {
                  setSearchTerm('');
                  setCategoryFilter('all');
                  setLevelFilter('all');
                  setSortBy('default');
                }}
              >
                View All Programs
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPrograms.map((program) => {
                const discountedPrice = calculateDiscount(program.price, program.discount);
                const hasDiscount = discountedPrice < program.price;
                
                return (
                  <Card 
                    key={program._id} 
                    className="group card-hover gradient-card border-0 shadow-xl overflow-hidden bg-white relative animate-bounceIn cursor-pointer"
                    onClick={() => handleProgramClick(program._id)}
                  >
                    {/* Background Image with Enhanced Effects */}
                    <div className="image-overlay absolute inset-0 overflow-hidden">
                      <img
                        src={program.image}
                        alt={program.title}
                        className="w-full h-full object-cover opacity-10 group-hover:opacity-20 image-zoom transition-all duration-500"
                      />
                    </div>
                    
                    {/* Gradient Border Effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-cricket-orange/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    <CardHeader className="relative z-10 text-center pb-4">
                      {/* Enhanced Icon with Multiple Animations */}
                      <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r ${program.color || 'from-cricket-orange to-cricket-gold'} text-white text-3xl mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg animate-zoomIn animate-heartbeat`}>
                        {program.icon}
                      </div>
                      
                      {/* Animated Title */}
                      <CardTitle className="text-xl font-poppins text-cricket-green mb-3 group-hover:text-cricket-orange transition-colors duration-300 animate-slideUp">
                        {program.title}
                      </CardTitle>
                      
                      {/* Description with Animation */}
                      <p className="text-gray-600 text-sm leading-relaxed animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                        {program.description.length > 120 
                          ? `${program.description.substring(0, 120)}...` 
                          : program.description}
                      </p>
                    </CardHeader>
                    
                    <CardContent className="relative z-10 space-y-6">
                      {/* Enhanced Features List */}
                      <div className="space-y-3">
                        {program.features.slice(0, 3).map((feature, idx) => (
                          <div 
                            key={idx} 
                            className={`flex items-center space-x-3 group/item animate-slideInLeft stagger-${idx + 1}`}
                          >
                            <div className="w-5 h-5 bg-cricket-orange rounded-full flex items-center justify-center group-hover/item:scale-110 transition-transform duration-200 animate-bounceIn">
                              <span className="text-white text-xs font-bold">✓</span>
                            </div>
                            <span className="text-gray-700 text-sm group-hover/item:text-cricket-green transition-colors duration-200">
                              {feature}
                            </span>
                          </div>
                        ))}
                        
                        {program.features.length > 3 && (
                          <div className="text-center text-sm text-cricket-orange">
                            +{program.features.length - 3} more features
                          </div>
                        )}
                      </div>
                      
                      {/* Enhanced Pricing Section */}
                      <div className="pt-4 border-t border-gray-100">
                        <div className="flex justify-between items-center mb-2 animate-slideInRight">
                          <span className="text-gray-500 text-sm">Duration:</span>
                          <span className="font-medium text-cricket-green animate-shimmer">{program.duration}</span>
                        </div>
                        <div className="flex justify-between items-center mb-2 animate-slideInRight">
                          <span className="text-gray-500 text-sm">Age Group:</span>
                          <span className="font-medium text-cricket-green animate-shimmer">{program.ageGroup}</span>
                        </div>
                        <div className="flex justify-between items-center mb-6 animate-slideInRight" style={{ animationDelay: '0.1s' }}>
                          <span className="text-gray-500 text-sm">Price:</span>
                          <div className="flex items-center">
                            <BadgeIndianRupeeIcon className="h-4 w-4 mr-1 text-cricket-orange" />
                            {hasDiscount ? (
                              <div className="flex flex-col items-end">
                                <span className="text-sm line-through text-gray-400">₹{program.price.toLocaleString()}</span>
                                <span className="text-xl font-bold text-cricket-orange animate-shimmer">
                                  ₹{discountedPrice.toLocaleString()}
                                </span>
                              </div>
                            ) : (
                              <span className="text-xl font-bold text-cricket-orange animate-shimmer">
                                ₹{program.price.toLocaleString()}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        {/* Enhanced Button */}
                        <Button 
                          type="button"
                          className="w-full bg-gradient-to-r from-cricket-green to-cricket-orange hover:from-cricket-orange hover:to-cricket-green text-white font-semibold py-3 rounded-full transform transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl ripple-effect animate-bounceIn"
                          style={{ animationDelay: '0.3s' }}
                        >
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
          
          {/* Call to Action */}
          <div className="mt-16 text-center animate-fadeInUp">
            <div className="bg-gradient-to-r from-cricket-green to-cricket-orange rounded-2xl p-8 text-white shadow-2xl">
              <h3 className="text-3xl font-bold font-poppins mb-4">Not Sure Which Program to Choose?</h3>
              <p className="text-xl mb-6 opacity-90">Book a free consultation with our expert coaches to find the perfect program for your goals.</p>
              <Button 
                type="button"
                onClick={() => navigate('/contact')}
                className="bg-white text-cricket-green hover:bg-gray-100 px-8 py-3 font-semibold rounded-full transform transition-all duration-300 hover:scale-105"
              >
                📞 Book Free Consultation
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Programs;