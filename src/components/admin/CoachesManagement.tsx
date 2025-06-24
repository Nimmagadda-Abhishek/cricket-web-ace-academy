import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Coach {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  experience: number;
  programs: string[];
  status: 'active' | 'inactive' | 'on-leave';
  salary: number;
  joinDate: string;
  certifications: string[];
  avatar: string;
  bio: string;
}

const CoachesManagement = () => {
  const [coaches] = useState<Coach[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@academy.com',
      phone: '+1-555-0201',
      specialization: 'Junior Development',
      experience: 8,
      programs: ['Junior Cricket'],
      status: 'active',
      salary: 5500,
      joinDate: '2020-03-15',
      certifications: ['Level 3 Cricket Coach', 'Youth Sports Safety'],
      avatar: '👩‍🏫',
      bio: 'Specialized in junior cricket development with 8 years of experience in youth coaching.'
    },
    {
      id: '2',
      name: 'Mike Rodriguez',
      email: 'mike.rodriguez@academy.com',
      phone: '+1-555-0202',
      specialization: 'Advanced Techniques',
      experience: 12,
      programs: ['Youth Development', 'Elite Training'],
      status: 'active',
      salary: 7200,
      joinDate: '2018-09-01',
      certifications: ['Level 4 Master Coach', 'Sports Psychology', 'Fitness Training'],
      avatar: '👨‍🏫',
      bio: 'Former professional player with expertise in advanced batting and bowling techniques.'
    },
    {
      id: '3',
      name: 'David Thompson',
      email: 'david.thompson@academy.com',
      phone: '+1-555-0203',
      specialization: 'Adult Programs',
      experience: 10,
      programs: ['Adult Programs'],
      status: 'active',
      salary: 6800,
      joinDate: '2019-06-10',
      certifications: ['Level 3 Cricket Coach', 'Fitness Instructor'],
      avatar: '🧑‍🏫',
      bio: 'Specializes in adult cricket programs and fitness coaching for recreational players.'
    },
    {
      id: '4',
      name: 'James Mitchell',
      email: 'james.mitchell@academy.com',
      phone: '+1-555-0204',
      specialization: 'Elite Performance',
      experience: 15,
      programs: ['Elite Training'],
      status: 'active',
      salary: 8500,
      joinDate: '2017-01-20',
      certifications: ['Level 5 High Performance Coach', 'Video Analysis', 'Mental Conditioning'],
      avatar: '👑',
      bio: 'Elite performance coach with experience training national level players.'
    },
    {
      id: '5',
      name: 'Lisa Chen',
      email: 'lisa.chen@academy.com',
      phone: '+1-555-0205',
      specialization: 'Fitness & Conditioning',
      experience: 6,
      programs: ['Youth Development', 'Adult Programs'],
      status: 'on-leave',
      salary: 5000,
      joinDate: '2021-08-15',
      certifications: ['Certified Fitness Trainer', 'Sports Nutrition'],
      avatar: '💪',
      bio: 'Fitness and conditioning specialist focusing on cricket-specific training.'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const filteredCoaches = coaches.filter(coach => {
    const matchesSearch = coach.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         coach.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || coach.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'on-leave': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const CoachDetailsModal = ({ coach }: { coach: Coach }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
      <Card className="w-full max-w-2xl mx-4 max-h-screen overflow-y-auto animate-bounceIn">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-4xl">{coach.avatar}</div>
              <div>
                <h3 className="text-xl font-bold text-cricket-green">{coach.name}</h3>
                <p className="text-sm text-gray-600">{coach.specialization}</p>
              </div>
            </div>
            <button 
              onClick={() => setShowDetailsModal(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Email</label>
              <p className="text-cricket-green">{coach.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Phone</label>
              <p className="text-cricket-green">{coach.phone}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Experience</label>
              <p className="text-cricket-green">{coach.experience} years</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Join Date</label>
              <p className="text-cricket-green">{new Date(coach.joinDate).toLocaleDateString()}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Status</label>
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(coach.status)}`}>
                {coach.status}
              </span>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Salary</label>
              <p className="text-cricket-green font-semibold">${coach.salary.toLocaleString()}/month</p>
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="text-sm font-medium text-gray-500 block mb-2">Biography</label>
            <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{coach.bio}</p>
          </div>

          {/* Programs */}
          <div>
            <label className="text-sm font-medium text-gray-500 block mb-2">Assigned Programs</label>
            <div className="flex flex-wrap gap-2">
              {coach.programs.map((program, index) => (
                <span key={index} className="bg-cricket-orange/10 text-cricket-orange px-3 py-1 rounded-full text-sm">
                  {program}
                </span>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div>
            <label className="text-sm font-medium text-gray-500 block mb-2">Certifications</label>
            <div className="space-y-2">
              {coach.certifications.map((cert, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <span className="text-green-500">🏆</span>
                  <span className="text-sm text-gray-700">{cert}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button variant="outline" className="flex-1" onClick={() => setShowDetailsModal(false)}>
              Close
            </Button>
            <Button className="flex-1 bg-cricket-orange hover:bg-cricket-orange/90">
              Edit Coach
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const AddCoachModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
      <Card className="w-full max-w-2xl mx-4 max-h-screen overflow-y-auto animate-bounceIn">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Add New Coach</span>
            <button 
              onClick={() => setShowAddModal(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cricket-orange focus:border-transparent"
                  placeholder="Enter coach name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Specialization</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cricket-orange focus:border-transparent"
                  placeholder="e.g., Junior Development"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cricket-orange focus:border-transparent"
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cricket-orange focus:border-transparent"
                  placeholder="Enter phone number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Experience (years)</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cricket-orange focus:border-transparent"
                  placeholder="Years of experience"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Salary ($)</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cricket-orange focus:border-transparent"
                  placeholder="Monthly salary"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Biography</label>
              <textarea
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cricket-orange focus:border-transparent"
                placeholder="Brief biography and background"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Certifications (one per line)</label>
              <textarea
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cricket-orange focus:border-transparent"
                placeholder="Enter certifications, one per line"
              />
            </div>
            
            <div className="flex space-x-3 pt-4">
              <Button 
                type="button"
                onClick={() => setShowAddModal(false)}
                variant="outline" 
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                className="flex-1 bg-cricket-orange hover:bg-cricket-orange/90"
              >
                Add Coach
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="card-hover gradient-card shadow-lg animate-bounceIn">
          <CardContent className="p-4 text-center">
            <div className="text-3xl mb-2">👨‍🏫</div>
            <div className="text-2xl font-bold text-cricket-green">{coaches.length}</div>
            <div className="text-sm text-gray-600">Total Coaches</div>
          </CardContent>
        </Card>
        <Card className="card-hover gradient-card shadow-lg animate-bounceIn stagger-1">
          <CardContent className="p-4 text-center">
            <div className="text-3xl mb-2">✅</div>
            <div className="text-2xl font-bold text-green-600">{coaches.filter(c => c.status === 'active').length}</div>
            <div className="text-sm text-gray-600">Active Coaches</div>
          </CardContent>
        </Card>
        <Card className="card-hover gradient-card shadow-lg animate-bounceIn stagger-2">
          <CardContent className="p-4 text-center">
            <div className="text-3xl mb-2">📈</div>
            <div className="text-2xl font-bold text-cricket-orange">
              {Math.round(coaches.reduce((sum, coach) => sum + coach.experience, 0) / coaches.length)}
            </div>
            <div className="text-sm text-gray-600">Avg Experience</div>
          </CardContent>
        </Card>
        <Card className="card-hover gradient-card shadow-lg animate-bounceIn stagger-3">
          <CardContent className="p-4 text-center">
            <div className="text-3xl mb-2">💰</div>
            <div className="text-2xl font-bold text-purple-600">
              ${coaches.reduce((sum, coach) => sum + coach.salary, 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Monthly Payroll</div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <Card className="card-hover shadow-lg animate-slideInUp">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col md:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-sm">
                <input
                  type="text"
                  placeholder="Search coaches..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cricket-orange focus:border-transparent"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  🔍
                </div>
              </div>
              
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cricket-orange focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="on-leave">On Leave</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            
            <Button
              onClick={() => setShowAddModal(true)}
              className="bg-cricket-orange hover:bg-cricket-orange/90 hover:scale-105 transition-all duration-200"
            >
              ➕ Add Coach
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Coaches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCoaches.map((coach, index) => (
          <Card key={coach.id} className={`card-hover gradient-card shadow-lg overflow-hidden animate-bounceIn stagger-${index + 1}`}>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-4xl">{coach.avatar}</div>
                  <div>
                    <h3 className="font-bold text-cricket-green">{coach.name}</h3>
                    <p className="text-sm text-gray-600">{coach.specialization}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(coach.status)}`}>
                  {coach.status}
                </span>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Experience:</span>
                  <p className="font-medium text-cricket-green">{coach.experience} years</p>
                </div>
                <div>
                  <span className="text-gray-500">Salary:</span>
                  <p className="font-medium text-cricket-orange">${coach.salary.toLocaleString()}</p>
                </div>
              </div>
              
              <div>
                <span className="text-gray-500 text-sm">Programs:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {coach.programs.map((program, idx) => (
                    <span key={idx} className="bg-cricket-green/10 text-cricket-green px-2 py-1 rounded-full text-xs">
                      {program}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <span className="text-gray-500 text-sm">Certifications:</span>
                <p className="text-xs text-gray-600 mt-1">
                  {coach.certifications.length} certificates
                </p>
              </div>
              
              <div className="flex space-x-2 pt-4">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setSelectedCoach(coach);
                    setShowDetailsModal(true);
                  }}
                >
                  👁️ View
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 text-blue-600 border-blue-600 hover:bg-blue-50"
                >
                  ✏️ Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCoaches.length === 0 && (
        <Card className="card-hover shadow-lg animate-fadeInUp">
          <CardContent className="text-center py-12">
            <div className="text-6xl mb-4">👨‍🏫</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No coaches found</h3>
            <p className="text-gray-500">No coaches match your search criteria.</p>
          </CardContent>
        </Card>
      )}

      {/* Modals */}
      {showAddModal && <AddCoachModal />}
      {showDetailsModal && selectedCoach && <CoachDetailsModal coach={selectedCoach} />}
    </div>
  );
};

export default CoachesManagement;