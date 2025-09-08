import React from 'react';
import { achievementsData, getActiveAchievements } from '@/data/achievements';

// Define the Achievement type
interface Achievement {
  id: number;
  title: string;
  description: string;
  achievement_date: string;
  color: string;
  image_url: string;
  category: string;
  display_order: number;
  status: 'active' | 'inactive';
}

const AchievementsSection: React.FC = () => {
  const achievements = getActiveAchievements();

  // Format date to a readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (achievements.length === 0) {
    return null; // Don't render the section if there are no achievements
  }

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

        {/* Apple Intelligence Style Cards Container */}
        {achievements && achievements.length > 0 && (
          <div className="relative">
          {/* Scroll Buttons */}
          <button
            onClick={() => {
              const container = document.getElementById('achievements-scroll');
              if (container) {
                container.scrollBy({ left: -350, behavior: 'smooth' });
              }
            }}
            className="w-12 h-12 bg-gradient-to-r from-cricket-green to-cricket-orange text-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center transition-all duration-300 hover:from-cricket-orange hover:to-cricket-purple hover:scale-110 absolute left-0 top-1/2 transform -translate-y-1/2 z-20"
            aria-label="Scroll left"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={() => {
              const container = document.getElementById('achievements-scroll');
              if (container) {
                container.scrollBy({ left: 350, behavior: 'smooth' });
              }
            }}
            className="w-12 h-12 bg-gradient-to-r from-cricket-green to-cricket-orange text-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center transition-all duration-300 hover:from-cricket-orange hover:to-cricket-purple hover:scale-110 absolute right-0 top-1/2 transform -translate-y-1/2 z-20"
            aria-label="Scroll right"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Cards Container */}
          <div
            id="achievements-scroll"
            className="flex gap-6 overflow-x-auto scrollbar-hide pb-6 px-2 smooth-scroll"
          >
            {achievements.map((achievement, index: number) => (
              <div
                key={achievement.id}
                className="min-w-[300px] max-w-[300px] flex-shrink-0"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="bg-white rounded-xl shadow-lg h-full flex flex-col hover:shadow-xl transition-all duration-300 hover:-translate-y-2" style={{height: '400px'}}>
                  <div className="relative flex-shrink-0" style={{height: '70%'}}>
                    <img
                      src={achievement.image_url}
                      alt={achievement.title}
                      className="w-full h-full object-cover rounded-t-xl"
                      style={{height: '100%', width: '100%'}}
                    />
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
        )}
      </div>

      {/* Custom Scrollbar Styles */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default AchievementsSection;
