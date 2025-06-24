import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DashboardProps {
  onNavigate?: (page: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const stats = [
    { title: 'Total Students', value: '487', change: '+12%', icon: '👥', color: 'bg-blue-500' },
    { title: 'Active Programs', value: '8', change: '+2', icon: '🏏', color: 'bg-cricket-orange' },
    { title: 'Total Coaches', value: '24', change: '+3', icon: '👨‍🏫', color: 'bg-green-500' },
    { title: 'Monthly Revenue', value: '₹37,73,440', change: '+18%', icon: '💰', color: 'bg-purple-500' }
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
        {stats.map((stat, index) => (
          <Card key={index} className={`card-hover gradient-card border-0 shadow-lg overflow-hidden animate-bounceIn stagger-${index + 1}`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-cricket-green">{stat.value}</p>
                  <p className="text-sm text-green-600 mt-1">
                    <span className="inline-block mr-1">📈</span>
                    {stat.change} from last month
                  </p>
                </div>
                <div className={`w-16 h-16 ${stat.color} rounded-full flex items-center justify-center text-white text-2xl animate-float`}>
                  {stat.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
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