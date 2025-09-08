import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Facilities = () => {
  const navigate = useNavigate();

  const facilities = [
    {
      title: 'High-Performance Practice Nets',
      description: 'State-of-the-art practice nets with multiple surface types to simulate real match conditions and improve adaptability.',
      image: '/images/facilites/01.webp',
      icon: '🏏',
      color: 'from-blue-500 to-cyan-600',
      features: [
        '15 Professional Practice Nets',
        'Turf & Astro-Turf Surfaces',
        'Cement & Matting Surfaces',
        'LED Floodlighting System',
        'Ball Return Systems',
        'Safety Netting & Padding'
      ],
      specifications: {
        'Total Nets': '15',
        'Surface Types': '4 Different',
        'Operating Hours': '6 AM - 10 PM',
        'Lighting': 'LED Floodlights'
      }
    },
    {
      title: 'Professional Turf Ground',
      description: 'Full-size cricket ground with premium turf wicket for match practice and competitive games.',
      image: '/images/facilites/02.jpg',
      icon: '🏟️',
      color: 'from-green-500 to-emerald-600',
      features: [
        'Full-Size Cricket Ground',
        'Premium Turf Wicket',
        'Professional Boundary Ropes',
        'Spectator Seating Area',
        'Scoreboard & PA System',
        'Pavilion & Changing Rooms'
      ],
      specifications: {
        'Ground Size': 'Full International',
        'Wicket Type': 'Premium Turf',
        'Seating Capacity': '200+',
        'Facilities': 'Complete'
      }
    },
    {
      title: 'Modern Fitness Center',
      description: 'Fully equipped gym with cricket-specific training equipment and professional fitness guidance.',
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      icon: '💪',
      color: 'from-orange-500 to-red-600',
      features: [
        'Cricket-Specific Equipment',
        'Cardio Training Zone',
        'Strength Training Area',
        'Agility Training Space',
        'Professional Trainers',
        'Injury Prevention Programs'
      ],
      specifications: {
        'Area': '2000 sq ft',
        'Equipment': '50+ Machines',
        'Trainers': '3 Certified',
        'Programs': 'Customized'
      }
    },
    {
      title: 'Indoor Training Hall',
      description: 'Climate-controlled indoor facility for year-round training regardless of weather conditions.',
      image: '/images/facilites/03.webp',
      icon: '🏢',
      color: 'from-purple-500 to-indigo-600',
      features: [
        'Climate Controlled Environment',
        'Synthetic Wicket Strips',
        'Bowling Machine Setup',
        'Video Analysis Corner',
        'Theory Class Area',
        'Equipment Storage'
      ],
      specifications: {
        'Area': '3000 sq ft',
        'Height': '25 feet',
        'Temperature': 'Controlled',
        'Capacity': '30 players'
      }
    },
    {
      title: 'Player Amenities',
      description: 'Complete facilities to ensure comfort and convenience for all players and visitors.',
      image: 'https://d13loartjoc1yn.cloudfront.net/upload/article/large/1738041157ashish%20nehra%20cricket%20academy.webp',
      icon: '🚿',
      color: 'from-teal-500 to-blue-600',
      features: [
        'Modern Changing Rooms',
        'Hot Water Showers',
        'Secure Lockers',
        'Refreshment Area',
        'First Aid Station',
        'Parking Facility'
      ],
      specifications: {
        'Changing Rooms': '4 Separate',
        'Lockers': '100+',
        'Parking': '50 Vehicles',
        'Refreshments': 'Available'
      }
    },
    {
      title: 'Technology Integration',
      description: 'Advanced technology for performance analysis and skill development tracking.',
      image: 'https://sklc-tinymce-2021.s3.amazonaws.com/comp/2022/06/image_1655389349.png',
      icon: '📱',
      color: 'from-pink-500 to-rose-600',
      features: [
        'Video Analysis System',
        'Performance Tracking',
        'Speed Radar Guns',
        'Digital Scoreboard',
        'Online Booking System',
        'Progress Reports'
      ],
      specifications: {
        'Cameras': 'HD Multi-Angle',
        'Software': 'Professional',
        'Reports': 'Detailed Analytics',
        'Access': '24/7 Online'
      }
    },
    {
      title: 'HCA League Club Teams',
      description: 'Participation in One-Day, Two-Day & Three-Day HCA League matches to build match temperament with top-level competition.',
      image: 'https://22yards.co.in/hyderabad-cricket-association/assets/img/playCricket.png',
      icon: '🏆',
      color: 'from-yellow-500 to-orange-600',
      features: [
        'Participation in One-Day, Two-Day & Three-Day HCA League matches',
        'Build match temperament with top-level competition',
        'Professional league experience',
        'Competitive match practice',
        'Team building and strategy development',
        'Performance evaluation and feedback'
      ],
      specifications: {
        'Match Formats': 'One-Day, Two-Day & Three-Day',
        'League': 'HCA Professional',
        'Competition Level': 'Top-tier',
        'Teams': 'Multiple Divisions'
      }
    },
    {
      title: 'International Exposure & Tie-Ups',
      description: 'Global partnerships and exclusive opportunities to train and compete with international teams.',
      image: 'https://upload.wikimedia.org/wikipedia/commons/8/89/Uppal_stadium_Rajiv_Gandhi_International_Cricket_Stadium.jpg',
      icon: '🌍',
      color: 'from-indigo-500 to-purple-600',
      features: [
        'Official collaborations with clubs in Sri Lanka & Nepal',
        'Exclusive opportunities to train & play with international teams',
        'Cross-cultural cricket exchanges',
        'International tournament participation',
        'Global networking opportunities',
        'Cultural immersion programs'
      ],
      specifications: {
        'Partner Countries': 'Sri Lanka & Nepal',
        'International Teams': '5+ Partnerships',
        'Exchange Programs': 'Annual',
        'Tournament Access': 'Exclusive'
      }
    },
    {
      title: 'Nutrition & Recovery Program',
      description: 'Comprehensive sports nutrition and recovery programs for peak performance and injury prevention.',
      image: 'https://cdn.prod.website-files.com/60e2d1e1782f3340897bbad0/64d72c50fd2d55cc672c1c54_carbohydrate_recommendations.jpg',
      icon: '🥗',
      color: 'from-emerald-500 to-teal-600',
      features: [
        'Sports nutrition plans for peak performance & endurance',
        'Physiotherapy and injury prevention programs',
        'Ice baths and recovery facilities',
        'Dietary counseling and meal planning',
        'Hydration management systems',
        'Performance monitoring and adjustments'
      ],
      specifications: {
        'Nutrition Plans': 'Personalized',
        'Recovery Facilities': 'Complete',
        'Physiotherapy': 'On-site',
        'Monitoring': '24/7'
      }
    },
    {
      title: 'Cricket Gear & Equipment Store',
      description: 'Premium quality cricket equipment and accessories for players of all levels.',
      image: 'https://media.istockphoto.com/id/519191424/photo/cricket-equipment.jpg?s=612x612&w=0&k=20&c=qElSS_hoyVpWWc-2MX7t_1TLh1Vmf1O7t5UuFvMF2eU=',
      icon: '🛍️',
      color: 'from-amber-500 to-orange-600',
      features: [
        'Premium quality bats, gloves, pads & accessories',
        'Equipment for beginners to professionals',
        'Expert fitting and customization services',
        'Brand partnerships with leading manufacturers',
        'Maintenance and repair services',
        'Online ordering and delivery'
      ],
      specifications: {
        'Product Range': 'Complete',
        'Brands': 'Premium',
        'Services': 'Full',
        'Delivery': 'Nationwide'
      }
    }
  ];

  const stats = [
    { number: '15', label: 'Practice Nets', icon: '🏏' },
    { number: '2', label: 'Full Grounds', icon: '🏟️' },
    { number: '3000', label: 'Sq Ft Indoor', icon: '🏢' },
    { number: '50+', label: 'Parking Spots', icon: '🚗' }
  ];

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-r from-cricket-green to-cricket-orange overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div>
              <h1 className="text-5xl md:text-7xl font-bold font-poppins text-white mb-6 relative">
                World-Class
                <span className="block gradient-text-facilities">Facilities</span>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-white to-transparent rounded-full opacity-80"></div>
              </h1>
              <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-4xl mx-auto leading-relaxed">
                Experience cricket training at its finest with our state-of-the-art facilities designed for excellence
              </p>
              <div className="flex justify-center">
                <div className="bg-white/10 backdrop-blur-md rounded-full px-6 py-3 border border-white/20">
                  <span className="text-white font-semibold">Where Champions Are Made</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl font-bold text-cricket-green mb-2">{stat.number}</div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Facilities Grid */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold font-poppins heading-gradient mb-4">
                Our Premium Facilities
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Every facility is designed with precision to provide the best training environment for cricketers of all levels
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {facilities.map((facility, index) => (
                <Card 
                  key={index}
                  className="group overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-white border border-gray-200"
                >
                  {/* Facility Image */}
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={facility.image}
                      alt={facility.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    

                  </div>

                  <CardContent className="p-6">
                    <CardTitle className="text-2xl font-bold font-poppins text-cricket-green mb-3 group-hover:text-cricket-orange transition-colors duration-300 relative">
                      {facility.title}
                      <div className="absolute -bottom-1 left-0 w-16 h-0.5 bg-gradient-to-r from-cricket-green to-cricket-orange rounded-full opacity-80"></div>
                    </CardTitle>
                    
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {facility.description}
                    </p>

                    {/* Specifications */}


                    {/* Features */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-cricket-green mb-3">Key Features:</h4>
                      <div className="grid grid-cols-1 gap-2">
                        {facility.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-cricket-orange rounded-full"></div>
                            <span className="text-sm text-gray-600">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 bg-gradient-to-r from-cricket-green to-cricket-orange">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold font-poppins text-white mb-6">
              Ready to Experience Our Facilities?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Schedule a tour today and see why we're the premier cricket training destination
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-cricket-green hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-full transform transition-all duration-300 hover:scale-105"
                onClick={() => navigate('/contact')}
              >
                Schedule Tour
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white bg-transparent text-white hover:bg-white hover:text-cricket-green px-8 py-4 text-lg font-semibold rounded-full transform transition-all duration-300 hover:scale-105"
                onClick={() => navigate('/programs')}
              >
                View Programs
              </Button>
            </div>
          </div>
        </section>

        {/* Additional Info */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h3 className="text-3xl font-bold font-poppins gradient-text-facilities mb-6">
              Why Choose Our Facilities?
            </h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <h4 className="text-xl font-bold text-cricket-green mb-2">Professional Standard</h4>
                <p className="text-gray-600">All facilities meet international cricket training standards</p>
              </div>
              <div className="text-center">
                <h4 className="text-xl font-bold text-cricket-green mb-2">Regular Maintenance</h4>
                <p className="text-gray-600">Facilities are maintained daily for optimal performance</p>
              </div>
              <div className="text-center">
                <h4 className="text-xl font-bold text-cricket-green mb-2">Latest Technology</h4>
                <p className="text-gray-600">Equipped with modern technology for enhanced training</p>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default Facilities;