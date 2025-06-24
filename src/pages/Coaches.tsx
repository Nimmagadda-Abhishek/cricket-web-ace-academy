import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { coachesApi } from '@/services/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SearchIcon, FilterIcon, StarIcon } from 'lucide-react';

interface Coach {
  _id: string;
  name: string;
  bio: string;
  specialization: string[];
  experience: number;
  image: string;
  rating: {
    average: number;
    count: number;
  };
  achievements: string[];
}

const Coaches: React.FC = () => {
  const navigate = useNavigate();
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [specializationFilter, setSpecializationFilter] = useState<string>('all');
  const [experienceFilter, setExperienceFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('rating');

  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        setLoading(true);
        const response = await coachesApi.getCoaches();
        setCoaches(response.data.coaches);
      } catch (err: any) {
        setError(err.message || 'Failed to load coaches');
        console.error('Error fetching coaches:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCoaches();
  }, []);

  const handleCoachClick = (coachId: string) => {
    navigate(`/coaches/${coachId}`);
  };

  // Get unique specializations for filter
  const specializations = coaches.length > 0 
    ? [...new Set(coaches.flatMap(coach => coach.specialization))]
    : [];

  const filteredCoaches = coaches
    .filter(coach => {
      // Search filter
      if (searchTerm && !coach.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
          !coach.bio.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      // Specialization filter
      if (specializationFilter !== 'all' && !coach.specialization.includes(specializationFilter)) {
        return false;
      }
      
      // Experience filter
      if (experienceFilter !== 'all') {
        const exp = coach.experience;
        if (experienceFilter === '0-5' && (exp < 0 || exp > 5)) return false;
        if (experienceFilter === '5-10' && (exp < 5 || exp > 10)) return false;
        if (experienceFilter === '10+' && exp < 10) return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      // Sort options
      switch (sortBy) {
        case 'rating':
          return b.rating.average - a.rating.average;
        case 'experience-high':
          return b.experience - a.experience;
        case 'experience-low':
          return a.experience - b.experience;
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
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
            <h2 className="text-2xl font-bold mb-4">Error Loading Coaches</h2>
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
              Meet Our Expert Coaches
            </h1>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              Learn from the best with our team of experienced, certified coaches who bring 
              professional expertise, passion, and proven results to every training session.
            </p>
          </div>
          
          {/* Filters */}
          <div className="mb-12 bg-white p-6 rounded-lg shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Search coaches..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div>
                <Select value={specializationFilter} onValueChange={setSpecializationFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Specialization" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Specializations</SelectItem>
                    {specializations.map((spec) => (
                      <SelectItem key={spec} value={spec}>
                        {spec.charAt(0).toUpperCase() + spec.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Select value={experienceFilter} onValueChange={setExperienceFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Experience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Experience Levels</SelectItem>
                    <SelectItem value="0-5">0-5 Years</SelectItem>
                    <SelectItem value="5-10">5-10 Years</SelectItem>
                    <SelectItem value="10+">10+ Years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rating">Highest Rating</SelectItem>
                    <SelectItem value="experience-high">Experience: High to Low</SelectItem>
                    <SelectItem value="experience-low">Experience: Low to High</SelectItem>
                    <SelectItem value="name-asc">Name: A to Z</SelectItem>
                    <SelectItem value="name-desc">Name: Z to A</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {(searchTerm || specializationFilter !== 'all' || experienceFilter !== 'all') && (
              <div className="mt-4 flex items-center">
                <FilterIcon className="h-4 w-4 text-cricket-orange mr-2" />
                <span className="text-sm text-gray-600">
                  Showing {filteredCoaches.length} of {coaches.length} coaches
                </span>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="ml-4 text-sm"
                  onClick={() => {
                    setSearchTerm('');
                    setSpecializationFilter('all');
                    setExperienceFilter('all');
                    setSortBy('rating');
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
          
          {/* Coaches Grid */}
          {filteredCoaches.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <h3 className="text-2xl font-semibold text-gray-700 mb-2">No Coaches Found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria</p>
              <Button 
                onClick={() => {
                  setSearchTerm('');
                  setSpecializationFilter('all');
                  setExperienceFilter('all');
                  setSortBy('rating');
                }}
              >
                View All Coaches
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCoaches.map((coach) => (
                <Card 
                  key={coach._id} 
                  className="group hover-lift border-0 shadow-xl overflow-hidden bg-white relative cursor-pointer"
                  onClick={() => handleCoachClick(coach._id)}
                >
                  <CardContent className="p-0">
                    {/* Coach Image */}
                    <div className="relative h-64 overflow-hidden">
                      <img 
                        src={coach.image || 'https://via.placeholder.com/400x500?text=Coach+Image'} 
                        alt={coach.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300"></div>
                      <div className="absolute bottom-4 left-4 right-4 text-white">
                        <h3 className="text-xl font-bold font-poppins mb-1">{coach.name}</h3>
                        <div className="flex items-center">
                          <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
                          <span className="text-sm font-medium">{coach.rating.average.toFixed(1)}</span>
                          <span className="text-xs ml-1">({coach.rating.count} reviews)</span>
                        </div>
                      </div>
                    </div>

                    {/* Coach Details */}
                    <div className="p-6">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {coach.specialization.map((spec, index) => (
                          <span 
                            key={index} 
                            className="px-3 py-1 bg-cricket-orange/10 text-cricket-orange text-sm font-medium rounded-full"
                          >
                            {spec.charAt(0).toUpperCase() + spec.slice(1)}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-center mb-4">
                        <div className="px-3 py-1 bg-cricket-green/10 text-cricket-green text-sm font-medium rounded-full">
                          {coach.experience} years experience
                        </div>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-6 line-clamp-3">
                        {coach.bio}
                      </p>

                      <div className="space-y-3 mb-6">
                        <h4 className="font-semibold text-cricket-green text-sm text-center mb-3">Key Achievements</h4>
                        {coach.achievements.slice(0, 2).map((achievement, idx) => (
                          <div key={idx} className="flex items-center space-x-3 group/achievement">
                            <div className="w-4 h-4 bg-cricket-orange rounded-full flex items-center justify-center group-hover/achievement:scale-110 transition-transform duration-200">
                              <span className="text-white text-xs">✓</span>
                            </div>
                            <span className="text-gray-700 text-xs group-hover/achievement:text-cricket-green transition-colors duration-200">{achievement}</span>
                          </div>
                        ))}
                        
                        {coach.achievements.length > 2 && (
                          <div className="text-center text-xs text-cricket-orange">
                            +{coach.achievements.length - 2} more achievements
                          </div>
                        )}
                      </div>

                      <Button 
                        type="button"
                        className="w-full py-2 px-4 bg-gradient-to-r from-cricket-green to-cricket-orange text-white rounded-full font-medium text-sm hover:from-cricket-orange hover:to-cricket-green transition-all duration-300 transform hover:scale-105"
                      >
                        View Profile
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          
          {/* Team Stats */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: '50+', label: 'Years Combined Experience', icon: '⏰' },
              { number: '200+', label: 'International Matches', icon: '🌍' },
              { number: '15', label: 'Coaching Certifications', icon: '🏆' },
              { number: '1000+', label: 'Players Trained', icon: '👥' }
            ].map((stat, index) => (
              <div key={index} className="text-center animate-scaleIn" style={{ animationDelay: `${index * 0.2}s` }}>
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-cricket-orange to-cricket-gold rounded-full text-2xl mb-3 shadow-lg">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold font-poppins text-cricket-green mb-1">{stat.number}</div>
                <div className="text-gray-600 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Coaches;