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
    <section className="py-20 bg-gray-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-32 h-32 bg-cricket-orange rounded-full animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-cricket-green rounded-full animate-float"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 animate-fadeInUp">
          <h2 className="text-5xl font-bold font-poppins heading-gradient mb-6">
            Our Achievements
          </h2>
          <div className="w-24 h-1 bg-cricket-orange mx-auto mb-6 rounded-full"></div>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Celebrating the success of our students and the academy's milestones
          </p>
        </div>

        {/* Achievements Slider */}
        <div className="overflow-hidden mb-10">
          <div className="flex flex-nowrap gap-6 animate-marquee">
            {displayAchievements.map((achievement, index) => (
              <div key={`${achievement.id}-${index}`} className="min-w-[300px] max-w-[300px] flex-shrink-0">
                <div className="group card-hover border-0 shadow-xl overflow-hidden bg-white relative animate-bounceIn hover:shadow-2xl transition-all duration-500 rounded-xl h-full">
                  {/* Achievement Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={achievement.image_url}
                      alt={achievement.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    
                    {/* Achievement Icon */}
                    <div className={`absolute top-4 right-4 w-12 h-12 bg-gradient-to-br ${achievement.color} rounded-full flex items-center justify-center text-white text-xl shadow-lg`}>
                      {achievement.icon}
                    </div>
                  </div>

                  <div className="p-6">
                    {/* Achievement Title */}
                    <h3 className="text-xl font-bold text-cricket-green mb-2 group-hover:text-cricket-orange transition-colors duration-300">
                      {achievement.title}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                      {achievement.description}
                    </p>

                    {/* Achievement Date */}
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