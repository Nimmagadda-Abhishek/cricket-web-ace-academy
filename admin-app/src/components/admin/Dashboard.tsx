import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';

interface DashboardProps {
  onNavigate?: (page: string) => void;
}

interface DashboardStats {
  students: number;
  programs: number;
  coaches: number;
  revenue: string;
  facilities: number;
  testimonials: number;
  galleryImages: number;
  contacts: number;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [stats, setStats] = useState<DashboardStats>({
    students: 0,
    programs: 0,
    coaches: 0,
    revenue: '₹0',
    facilities: 0,
    testimonials: 0,
    galleryImages: 0,
    contacts: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      
      // Fetch programs count
      const { count: programsCount } = await supabase
        .from('programs')
        .select('*', { count: 'exact', head: true });
      
      // Fetch contacts count
      const { count: contactsCount } = await supabase
        .from('contacts')
        .select('*', { count: 'exact', head: true });
      
      // Fetch facilities count
      const { count: facilitiesCount } = await supabase
        .from('facilities')
        .select('*', { count: 'exact', head: true });
      
      // Fetch testimonials count
      const { count: testimonialsCount } = await supabase
        .from('testimonials')
        .select('*', { count: 'exact', head: true });
      
      // Fetch gallery images count
      const { count: galleryCount } = await supabase
        .from('gallery')
        .select('*', { count: 'exact', head: true });
      
      // Set the stats
      setStats({
        students: 487, // Mock data for now
        programs: programsCount || 0,
        coaches: 24, // Mock data for now
        revenue: '₹37,73,440', // Mock data for now
        facilities: facilitiesCount || 0,
        testimonials: testimonialsCount || 0,
        galleryImages: galleryCount || 0,
        contacts: contactsCount || 0
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { title: 'Total Students', value: stats.students.toString(), change: '+12%', icon: '👥', color: 'bg-blue-500', page: 'students' },
    { title: 'Active Programs', value: stats.programs.toString(), change: '+2', icon: '🏏', color: 'bg-cricket-orange', page: 'programs' },
    { title: 'Total Coaches', value: stats.coaches.toString(), change: '+3', icon: '👨‍🏫', color: 'bg-green-500', page: 'coaches' },
    { title: 'Monthly Revenue', value: stats.revenue, change: '+18%', icon: '💰', color: 'bg-purple-500', page: null },
    { title: 'Facilities', value: stats.facilities.toString(), icon: '🏢', color: 'bg-amber-500', page: 'facilities' },
    { title: 'Testimonials', value: stats.testimonials.toString(), icon: '⭐', color: 'bg-pink-500', page: 'testimonials' },
    { title: 'Gallery Images', value: stats.galleryImages.toString(), icon: '📸', color: 'bg-indigo-500', page: 'gallery' },
    { title: 'Contact Requests', value: stats.contacts.toString(), icon: '📞', color: 'bg-teal-500', page: 'contacts' }
  ];

  const recentActivities = [
    { type: 'enrollment', message: 'New student enrolled in Youth Development program', time: '2 hours ago', icon: '✅' },
    { type: 'payment', message: 'Payment received from Alex Rodriguez', time: '4 hours ago', icon: '💳' },
    { type: 'achievement', message: 'Emma Thompson won Junior Championship', time: '1 day ago', icon: '🏆' },
    { type: 'feedback', message: 'New 5-star review from Sarah Mitchell', time: '2 days ago', icon: '⭐' },
    { type: 'equipment', message: 'New cricket equipment delivered', time: '3 days ago', icon: '📦' }
  ];

  const upcomingEvents = [
    { title: 'Junior Championship Finals', date: '2024-02-15', time: '10:00 AM', participants: 24 },
    { title: 'Parent-Coach Meeting', date: '2024-02-18', time: '6:00 PM', participants: 45 },
    { title: 'Elite Training Camp', date: '2024-02-20', time: '9:00 AM', participants: 12 },
    { title: 'Equipment Maintenance', date: '2024-02-22', time: '2:00 PM', participants: 5 }
  ];

  const handleQuickAction = (action: string) => {
    console.log(`Quick action clicked: ${action}`);
    
    switch (action) {
      case 'Add New Student':
        console.log('Navigating to students page');
        if (onNavigate) {
          onNavigate('students');
        } else {
          alert('Navigation function not available');
        }
        break;
      case 'Schedule Training':
        console.log('Navigating to programs page');
        if (onNavigate) {
          onNavigate('programs');
        } else {
          alert('Navigation function not available');
        }
        break;
      case 'Send Newsletter':
        console.log('Navigating to contacts page');
        if (onNavigate) {
          onNavigate('contacts');
        } else {
          alert('Navigation function not available');
        }
        break;
      case 'Upload to Gallery':
        console.log('Navigating to gallery page');
        if (onNavigate) {
          onNavigate('gallery');
        } else {
          alert('Navigation function not available');
        }
        break;
      case 'Add Testimonial':
        console.log('Navigating to testimonials page');
        if (onNavigate) {
          onNavigate('testimonials');
        } else {
          alert('Navigation function not available');
        }
        break;
      case 'Manage Facilities':
        console.log('Navigating to facilities page');
        if (onNavigate) {
          onNavigate('facilities');
        } else {
          alert('Navigation function not available');
        }
        break;
      case 'Generate Report':
        console.log('Report generation clicked');
        alert('Report generation feature coming soon!');
        break;
      default:
        console.log('Unknown action');
        break;
    }
  };

  const programPerformance = [
    { name: 'Junior Cricket', students: 120, satisfaction: 95, revenue: '₹8,00,000' },
    { name: 'Youth Development', students: 85, satisfaction: 92, revenue: '₹8,50,000' },
    { name: 'Adult Programs', students: 65, satisfaction: 88, revenue: '₹8,12,500' },
    { name: 'Elite Training', students: 30, satisfaction: 98, revenue: '₹7,50,000' }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          // Loading skeleton
          Array(8).fill(0).map((_, index) => (
            <Card key={index} className="card-hover gradient-card border-0 shadow-lg overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="w-full">
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3 mb-2"></div>
                    <div className="h-8 bg-gray-200 rounded animate-pulse w-1/2 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-1/3"></div>
                  </div>
                  <div className="bg-gray-200 animate-pulse w-16 h-16 rounded-full"></div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          statCards.map((stat, index) => (
            <Card 
              key={index} 
              className={`card-hover gradient-card border-0 shadow-lg overflow-hidden animate-bounceIn stagger-${index + 1} ${stat.page ? 'cursor-pointer' : ''}`}
              onClick={() => stat.page && onNavigate && onNavigate(stat.page)}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold text-cricket-green">{stat.value}</p>
                    {stat.change && (
                      <p className="text-sm text-green-600 mt-1">
                        <span className="inline-block mr-1">📈</span>
                        {stat.change} from last month
                      </p>
                    )}
                  </div>
                  <div className={`w-16 h-16 ${stat.color} rounded-full flex items-center justify-center text-white text-2xl animate-float`}>
                    {stat.icon}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <Card className="card-hover shadow-lg animate-slideInLeft">
          <CardHeader>
            <CardTitle className="flex items-center text-cricket-green">
              <span className="mr-2">📋</span>
              Recent Activities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-80 overflow-y-auto">
              {recentActivities.map((activity, index) => (
                <div key={index} className={`flex items-start space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 animate-slideInLeft stagger-${index + 1}`}>
                  <div className="text-2xl">{activity.icon}</div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-800">{activity.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card className="card-hover shadow-lg animate-slideInRight">
          <CardHeader>
            <CardTitle className="flex items-center text-cricket-green">
              <span className="mr-2">📅</span>
              Upcoming Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-80 overflow-y-auto">
              {upcomingEvents.map((event, index) => (
                <div key={index} className={`border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200 animate-slideInRight stagger-${index + 1}`}>
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-cricket-green">{event.title}</h4>
                    <span className="text-xs bg-cricket-orange text-white px-2 py-1 rounded-full">
                      {event.participants} participants
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="mr-3">📅 {event.date}</span>
                    <span>🕒 {event.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Program Performance */}
      <Card className="card-hover shadow-lg animate-fadeInUp">
        <CardHeader>
          <CardTitle className="flex items-center text-cricket-green">
            <span className="mr-2">📊</span>
            Program Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Program</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Students</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Satisfaction</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {programPerformance.map((program, index) => (
                  <tr key={index} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200 animate-slideUp stagger-${index + 1}`}>
                    <td className="py-4 px-4 font-medium text-cricket-green">{program.name}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <span className="mr-2">👥</span>
                        {program.students}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full transition-all duration-1000" 
                            style={{ width: `${program.satisfaction}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{program.satisfaction}%</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-semibold text-cricket-orange">{program.revenue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="card-hover shadow-lg animate-fadeInUp">
        <CardHeader>
          <CardTitle className="flex items-center text-cricket-green">
            <span className="mr-2">⚡</span>
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { action: 'Add New Student', icon: '👤', color: 'bg-blue-500' },
              { action: 'Schedule Training', icon: '📅', color: 'bg-green-500' },
              { action: 'Upload to Gallery', icon: '📸', color: 'bg-indigo-500' },
              { action: 'Add Testimonial', icon: '⭐', color: 'bg-pink-500' },
              { action: 'Manage Facilities', icon: '🏢', color: 'bg-amber-500' },
              { action: 'Send Newsletter', icon: '📧', color: 'bg-purple-500' },
              { action: 'Generate Report', icon: '📊', color: 'bg-cricket-orange' }
            ].map((item, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleQuickAction(item.action)}
                className={`p-4 rounded-lg text-white ${item.color} hover:opacity-90 transition-all duration-200 hover:scale-105 text-center animate-bounceIn stagger-${index + 1} cursor-pointer`}
              >
                <div className="text-2xl mb-2">{item.icon}</div>
                <div className="text-sm font-medium">{item.action}</div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;