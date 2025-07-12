import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';

// Define the Achievement type
interface Achievement {
  id: number;
  title: string;
  description: string;
  achievement_date: string;
  icon: string;
  color: string;
  image_url: string;
  category: string;
  display_order: number;
  status: 'active' | 'inactive';
}

const AchievementsSection: React.FC = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAchievements = async () => {
      setIsLoading(true);
      try {
        // In a real implementation, this would call your API
        // const response = await api.achievements.getAll();
        // const data = response.data.filter(a => a.status === 'active');
        // setAchievements(data.sort((a, b) => a.display_order - b.display_order));
        
        // For now, we'll use mock data
        const mockAchievements: Achievement[] = [
          {
            id: 1,
            title: 'State Team Selection',
            description: '5 of our students were selected for the state cricket team in 2023, showcasing our academy\'s excellence in training.',
            achievement_date: '2023-06-15',
            icon: '🏆',
            color: 'from-cricket-green to-cricket-green/80',
            image_url: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            category: 'Team',
            display_order: 1,
            status: 'active'
          },
          {
            id: 2,
            title: 'IPL Selection',
            description: 'Two of our academy graduates were picked in the IPL auction, marking a significant milestone in their professional careers.',
            achievement_date: '2022-12-20',
            icon: '🏏',
            color: 'from-cricket-orange to-cricket-orange/80',
            image_url: 'https://images.unsplash.com/photo-1624880357913-a8539238245b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            category: 'Professional',
            display_order: 2,
            status: 'active'
          },
          {
            id: 3,
            title: 'Under-18 National Team',
            description: 'Three students selected for the Under-18 National Cricket Team, representing our academy at the highest youth level.',
            achievement_date: '2023-08-10',
            icon: '👦',
            color: 'from-blue-500 to-blue-600',
            image_url: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            category: 'Youth',
            display_order: 3,
            status: 'active'
          },
          {
            id: 4,
            title: 'Best Cricket Academy',
            description: 'Awarded as the Best Cricket Academy in the region for 2023, recognizing our commitment to excellence in cricket training.',
            achievement_date: '2023-01-15',
            icon: '🎓',
            color: 'from-purple-600 to-purple-700',
            image_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            category: 'Academy',
            display_order: 4,
            status: 'active'
          }
        ];
        
        setAchievements(mockAchievements);
      } catch (err) {
        console.error('Error fetching achievements:', err);
        setError('Failed to load achievements. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAchievements();
  }, []);

  // Format date to a readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <section className="py-20 bg-gray-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <p>Loading achievements...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-gray-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <p className="text-red-500">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  if (achievements.length === 0) {
    return null; // Don't render the section if there are no achievements
  }

  // Create duplicates for continuous scrolling
  const displayAchievements = [...achievements, ...achievements];

  return (
    <section className="py-20 bg-gray-50 relative overflow-hidden parallax-section">
      {/* Enhanced Parallax Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-32 h-32 bg-gradient-to-br from-cricket-orange/12 to-cricket-purple/12 rounded-full parallax-bg-element"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-gradient-to-br from-cricket-green/12 to-cricket-orange/12 rounded-full parallax-bg-element-2"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-gradient-to-br from-cricket-purple/12 to-cricket-green/12 rounded-full parallax-bg-element-3"></div>
        <div className="absolute top-1/3 right-1/3 w-28 h-28 bg-gradient-to-br from-cricket-orange/8 to-cricket-purple/8 rounded-full parallax-bg-element"></div>
        <div className="absolute bottom-1/3 right-1/4 w-20 h-20 bg-gradient-to-br from-cricket-green/8 to-cricket-orange/8 rounded-full parallax-bg-element-2"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold font-poppins gradient-text-achievements mb-6">
            Our Achievements
          </h2>
          <p className="text-xl text-secondary max-w-3xl mx-auto">
            Celebrating the success of our students and the academy's milestones
          </p>
        </div>

        <div className="overflow-hidden mb-10">
          <div className="flex flex-nowrap gap-6 animate-marquee">
            {displayAchievements.map((achievement, index) => (
              <div key={`${achievement.id}-${index}`} className="min-w-[300px] max-w-[300px] flex-shrink-0">
                <div className="bg-white rounded-xl shadow-lg h-full flex flex-col hover:shadow-xl transition-all duration-300 hover:-translate-y-2" style={{height: '400px'}}>
                  <div className="relative flex-shrink-0" style={{height: '70%'}}>
                    <img
                      src={achievement.image_url}
                      alt={achievement.title}
                      className="w-full h-full object-cover rounded-t-xl"
                      style={{height: '100%', width: '100%'}}
                    />
                    <div className="absolute top-4 right-4 w-12 h-12 bg-gradient-to-br from-cricket-orange to-cricket-purple rounded-full flex items-center justify-center text-white text-xl shadow-lg">
                      {achievement.icon}
                    </div>
                  </div>
                  <div className="flex-1 p-6 flex flex-col justify-between" style={{height: '30%'}}>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {achievement.title}
                    </h3>
                    <div className="flex items-center text-sm text-cricket-orange">
                      <span className="font-semibold">Achievement Date:</span>
                      <span className="ml-2">{formatDate(achievement.achievement_date)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AchievementsSection;