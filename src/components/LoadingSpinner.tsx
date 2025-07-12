import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-cricket-green/95 to-cricket-orange/95 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="text-center">
        {/* Cricket Bat and Ball Animation */}
        <div className="relative mb-8">
          {/* Cricket Ball */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-gradient-to-br from-red-500 to-red-700 rounded-full animate-ball-bounce shadow-lg">
            <div className="w-full h-full rounded-full border-2 border-white/30"></div>
          </div>
          
          {/* Cricket Bat */}
          <div className="relative w-16 h-32 mx-auto animate-bat-swing">
            {/* Bat Handle */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2 h-16 bg-gradient-to-b from-amber-600 to-amber-800 rounded-full"></div>
            
            {/* Bat Blade */}
            <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 w-12 h-16 bg-gradient-to-b from-amber-400 to-amber-600 rounded-t-full"></div>
            
            {/* Bat Grip */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3 h-8 bg-gradient-to-b from-gray-600 to-gray-800 rounded-full"></div>
          </div>
        </div>
        
        {/* Loading Text */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white mb-2">Kalyan Cricket Academy</h2>
          <div className="flex items-center justify-center space-x-1">
            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
          <p className="text-white/80 text-sm mt-4">Loading your cricket journey...</p>
        </div>
        
        {/* Cricket Field Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Pitch Lines */}
          <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 w-1 h-32 bg-white/20"></div>
          <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 w-1 h-32 bg-white/20" style={{ transform: 'translateX(-20px)' }}></div>
          <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 w-1 h-32 bg-white/20" style={{ transform: 'translateX(20px)' }}></div>
          
          {/* Floating Cricket Elements */}
          <div className="absolute top-1/3 left-1/4 text-4xl animate-cricket-float opacity-20">🏏</div>
          <div className="absolute top-2/3 right-1/4 text-3xl animate-cricket-float opacity-20" style={{ animationDelay: '1s' }}>🏆</div>
          <div className="absolute bottom-1/3 left-1/3 text-2xl animate-cricket-float opacity-20" style={{ animationDelay: '2s' }}>⚾</div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner; 