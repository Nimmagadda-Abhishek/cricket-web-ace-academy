import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Programs = () => {
  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">
              Cricket Training Programs
            </h1>
            <p className="text-xl text-gray-600 mb-12">
              Choose from our comprehensive range of cricket training programs
            </p>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-lg shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Group Training</h3>
                <p className="text-gray-600 mb-4">Perfect for beginners and team building</p>
                <div className="text-3xl font-bold text-blue-600 mb-4">₹8,000/month</div>
                <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
                  Enroll Now
                </button>
              </div>
              
              <div className="bg-white p-8 rounded-lg shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Personal Training</h3>
                <p className="text-gray-600 mb-4">One-on-one coaching for rapid improvement</p>
                <div className="text-3xl font-bold text-orange-600 mb-4">₹15,000/month</div>
                <button className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700">
                  Enroll Now
                </button>
              </div>
              
              <div className="bg-white p-8 rounded-lg shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Elite Coaching</h3>
                <p className="text-gray-600 mb-4">Advanced training for serious players</p>
                <div className="text-3xl font-bold text-purple-600 mb-4">₹25,000/month</div>
                <button className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700">
                  Enroll Now
                </button>
              </div>
              
              <div className="bg-white p-8 rounded-lg shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Corporate Program</h3>
                <p className="text-gray-600 mb-4">Team building and corporate training</p>
                <div className="text-3xl font-bold text-green-600 mb-4">₹20,000/month</div>
                <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700">
                  Enroll Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Programs;