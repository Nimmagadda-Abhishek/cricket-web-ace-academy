import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { coachesApi } from '@/services/api';

// Define the Coach type
interface Coach {
  id: number;
  name: string;
  title: string;
  bio: string;
  experience_years: number;
  specialization: string;
  image_url: string;
  contact_email: string;
  contact_phone: string;
  display_order: number;
  status: 'active' | 'inactive';
}

const CoachesSection: React.FC = () => {
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCoaches = async () => {
      setIsLoading(true);
      try {
        // Try to fetch from database API first
        const response = await coachesApi.getCoaches();
        
        if (response.success && response.data && response.data.coaches) {
          const data = response.data.coaches.filter((c: Coach) => c.status === 'active');
          setCoaches(data.sort((a: Coach, b: Coach) => a.display_order - b.display_order));
        } else {
          throw new Error('No coaches data received');
        }
      } catch (apiError) {
        console.warn('Failed to fetch coaches from API, falling back to mock data:', apiError);
        
        // Fall back to mock data
        const mockCoaches: Coach[] = [
          {
            id: 1,
            name: 'Coach Rajesh Kumar',
            title: 'Head Coach & Academy Director',
            bio: 'Former state-level player with 15 years of coaching experience. Specializes in technique development and mental conditioning for competitive cricket.',
            experience_years: 15,
            specialization: 'Elite Performance, Advanced Techniques',
            image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
            contact_email: 'rajesh@kalyancricketacademy.com',
            contact_phone: '+91 98765 43210',
            display_order: 1,
            status: 'active'
          },
          {
            id: 2,
            name: 'Coach Priya Sharma',
            title: 'Senior Coach - Technique Specialist',
            bio: 'International certified coach with expertise in personalized training and video analysis. Known for helping players overcome technical challenges.',
            experience_years: 12,
            specialization: 'Personalized Training, Technique Analysis',
            image_url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
            contact_email: 'priya@kalyancricketacademy.com',
            contact_phone: '+91 98765 43211',
            display_order: 2,
            status: 'active'
          },
          {
            id: 3,
            name: 'Coach Vikram Singh',
            title: 'Group Training Coach',
            bio: 'Enthusiastic coach who excels at building team dynamics and developing fundamental skills. Perfect for group training and team development.',
            experience_years: 10,
            specialization: 'Group Training, Team Development',
            image_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
            contact_email: 'vikram@kalyancricketacademy.com',
            contact_phone: '+91 98765 43212',
            display_order: 3,
            status: 'active'
          },
          {
            id: 4,
            name: 'Coach Arjun Patel',
            title: 'Corporate Programs Coach',
            bio: 'Specialized in corporate training programs and team building activities. Expert at combining fitness, strategy, and leadership development.',
            experience_years: 8,
            specialization: 'Corporate Training, Team Building',
            image_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
            contact_email: 'arjun@kalyancricketacademy.com',
            contact_phone: '+91 98765 43213',
            display_order: 4,
            status: 'active'
          }
        ];
        
        setCoaches(mockCoaches);
      } catch (err) {
        console.error('Error fetching coaches:', err);
        setError('Failed to load coaches. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCoaches();
  }, []);

  if (isLoading) {
    return (
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <p>Loading coaches...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <p className="text-red-500">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  if (coaches.length === 0) {
    return null; // Don't render the section if there are no coaches
  }

  return (
    <section className="py-20 bg-white relative overflow-hidden parallax-section">
      {/* Enhanced Parallax Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-32 h-32 bg-gradient-to-br from-cricket-green/10 to-cricket-orange/10 rounded-full parallax-bg-element"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-gradient-to-br from-cricket-purple/10 to-cricket-green/10 rounded-full parallax-bg-element-2"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-gradient-to-br from-cricket-orange/10 to-cricket-purple/10 rounded-full parallax-bg-element-3"></div>
        <div className="absolute top-1/3 right-1/3 w-28 h-28 bg-gradient-to-br from-cricket-green/8 to-cricket-orange/8 rounded-full parallax-bg-element"></div>
        <div className="absolute bottom-1/3 right-1/4 w-20 h-20 bg-gradient-to-br from-cricket-purple/8 to-cricket-orange/8 rounded-full parallax-bg-element-2"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold font-poppins gradient-text-coaches mb-6">
            Meet Our Expert Coaches
          </h2>
          <p className="text-xl text-secondary max-w-3xl mx-auto">
            Learn from experienced professionals who are passionate about developing the next generation of cricket talent
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {coaches.map((coach, index) => (
            <div key={coach.id} className="group">
              <Card className={`multicolor-border-${(index % 4) + 1} overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2`}>
                <div className="relative">
                  <img
                    src={coach.image_url}
                    alt={coach.name}
                    className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-bold text-white mb-1">
                      {coach.name}
                    </h3>
                    <p className="text-cricket-orange font-semibold">
                      {coach.title}
                    </p>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="mb-4">
                    <div className="flex items-center mb-2">
                      <span className="text-cricket-green font-semibold text-sm">Experience:</span>
                      <span className="ml-2 text-gray-600">{coach.experience_years} years</span>
                    </div>
                    <div className="flex items-center mb-3">
                      <span className="text-cricket-green font-semibold text-sm">Specialization:</span>
                      <span className="ml-2 text-gray-600 text-sm">{coach.specialization}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed mb-4">
                    {coach.bio}
                  </p>
                  
                  <div className="space-y-2">
                    {coach.contact_email && (
                      <div className="flex items-center text-sm">
                        <span className="text-cricket-orange mr-2">✉️</span>
                        <a 
                          href={`mailto:${coach.contact_email}`}
                          className="text-gray-600 hover:text-cricket-orange transition-colors duration-300"
                        >
                          {coach.contact_email}
                        </a>
                      </div>
                    )}
                    {coach.contact_phone && (
                      <div className="flex items-center text-sm">
                        <span className="text-cricket-orange mr-2">📞</span>
                        <a 
                          href={`tel:${coach.contact_phone}`}
                          className="text-gray-600 hover:text-cricket-orange transition-colors duration-300"
                        >
                          {coach.contact_phone}
                        </a>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoachesSection;
