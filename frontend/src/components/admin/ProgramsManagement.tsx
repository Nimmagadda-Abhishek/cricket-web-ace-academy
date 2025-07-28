import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Program {
  id: string;
  title: string;
  description: string;
  ageGroup: string;
  duration: string;
  price: number;
  maxStudents: number;
  currentStudents: number;
  features: string[];
  status: 'active' | 'inactive' | 'full';
  coach: string;
  schedule: string;
  icon: string;
}

const ProgramsManagement = () => {
  const [programs] = useState<Program[]>([
    {
      id: '1',
      title: 'Junior Cricket (6-12 years)',
      description: 'Fun-based learning with focus on basic skills, hand-eye coordination, and team spirit through engaging activities.',
      ageGroup: '6-12 years',
      duration: '2 hours/week',
      price: 6500,
      maxStudents: 30,
      currentStudents: 25,
      features: ['Basic batting & bowling', 'Fielding fundamentals', 'Team games & drills', 'Safety first approach'],
      status: 'active',
      coach: 'Sarah Johnson',
      schedule: 'Saturdays 10:00 AM - 12:00 PM',
      icon: '🏏'
    },
    {
      id: '2',
      title: 'Youth Development (13-17 years)',
      description: 'Comprehensive training focusing on technique refinement, competitive play, and character development.',
      ageGroup: '13-17 years',
      duration: '4 hours/week',
      price: 10000,
      maxStudents: 25,
      currentStudents: 25,
      features: ['Advanced techniques', 'Match strategies', 'Fitness training', 'Mental conditioning'],
      status: 'full',
      coach: 'Mike Rodriguez',
      schedule: 'Tuesdays & Thursdays 4:00 PM - 6:00 PM',
      icon: '⚡'
    },
    {
      id: '3',
      title: 'Adult Programs (18+ years)',
      description: 'Professional coaching for adults looking to improve their game, stay fit, and enjoy competitive cricket.',
      ageGroup: '18+ years',
      duration: '5 hours/week',
      price: 12500,
      maxStudents: 20,
      currentStudents: 18,
      features: ['Skill development', 'Match preparation', 'Fitness coaching', 'League preparation'],
      status: 'active',
      coach: 'David Thompson',
      schedule: 'Mondays, Wednesdays & Fridays 6:00 PM - 8:00 PM',
      icon: '🎯'
    },
    {
      id: '4',
      title: 'Elite Training',
      description: 'High-performance program for aspiring professional players with personalized coaching and advanced analytics.',
      ageGroup: '16+ years',
      duration: '10 hours/week',
      price: 25000,
      maxStudents: 15,
      currentStudents: 12,
      features: ['1-on-1 coaching', 'Video analysis', 'Sports psychology', 'Tournament prep'],
      status: 'active',
      coach: 'James Mitchell',
      schedule: 'Daily 7:00 AM - 9:00 AM',
      icon: '👑'
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'full': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getOccupancyColor = (current: number, max: number) => {
    const percentage = (current / max) * 100;
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const ProgramModal = ({ program, isEdit = false }: { program?: Program; isEdit?: boolean }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
      <Card className="w-full max-w-2xl mx-4 max-h-screen overflow-y-auto animate-bounceIn">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{isEdit ? 'Edit Program' : 'Add New Program'}</span>
            <button 
              onClick={() => {
                setShowAddModal(false);
                setShowEditModal(false);
                setSelectedProgram(null);
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Program Title</label>
                <input
                  type="text"
                  defaultValue={program?.title}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cricket-orange focus:border-transparent"
                  placeholder="Enter program title"
                />
              </div>
              
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  rows={3}
                  defaultValue={program?.description}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cricket-orange focus:border-transparent"
                  placeholder="Enter program description"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Age Group</label>
                <input
                  type="text"
                  defaultValue={program?.ageGroup}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cricket-orange focus:border-transparent"
                  placeholder="e.g., 6-12 years"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                <input
                  type="text"
                  defaultValue={program?.duration}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cricket-orange focus:border-transparent"
                  placeholder="e.g., 2 hours/week"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price ($)</label>
                <input
                  type="number"
                  defaultValue={program?.price}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cricket-orange focus:border-transparent"
                  placeholder="Monthly fee"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max Students</label>
                <input
                  type="number"
                  defaultValue={program?.maxStudents}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cricket-orange focus:border-transparent"
                  placeholder="Maximum capacity"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Coach</label>
                <input
                  type="text"
                  defaultValue={program?.coach}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cricket-orange focus:border-transparent"
                  placeholder="Assigned coach"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select 
                  defaultValue={program?.status}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cricket-orange focus:border-transparent"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="full">Full</option>
                </select>
              </div>
              
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Schedule</label>
                <input
                  type="text"
                  defaultValue={program?.schedule}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cricket-orange focus:border-transparent"
                  placeholder="Training schedule"
                />
              </div>
              
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Features (one per line)</label>
                <textarea
                  rows={4}
                  defaultValue={program?.features.join('\n')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cricket-orange focus:border-transparent"
                  placeholder="Enter program features, one per line"
                />
              </div>
            </div>
            
            <div className="flex space-x-3 pt-4">
              <Button 
                type="button"
                onClick={() => {
                  setShowAddModal(false);
                  setShowEditModal(false);
                  setSelectedProgram(null);
                }}
                variant="outline" 
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                className="flex-1 bg-cricket-orange hover:bg-cricket-orange/90"
              >
                {isEdit ? 'Update Program' : 'Add Program'}
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
            <div className="text-3xl mb-2">🏏</div>
            <div className="text-2xl font-bold text-cricket-green">{programs.length}</div>
            <div className="text-sm text-gray-600">Total Programs</div>
          </CardContent>
        </Card>
        <Card className="card-hover gradient-card shadow-lg animate-bounceIn stagger-1">
          <CardContent className="p-4 text-center">
            <div className="text-3xl mb-2">✅</div>
            <div className="text-2xl font-bold text-green-600">{programs.filter(p => p.status === 'active').length}</div>
            <div className="text-sm text-gray-600">Active Programs</div>
          </CardContent>
        </Card>
        <Card className="card-hover gradient-card shadow-lg animate-bounceIn stagger-2">
          <CardContent className="p-4 text-center">
            <div className="text-3xl mb-2">👥</div>
            <div className="text-2xl font-bold text-cricket-orange">
              {programs.reduce((sum, program) => sum + program.currentStudents, 0)}
            </div>
            <div className="text-sm text-gray-600">Total Enrollments</div>
          </CardContent>
        </Card>
        <Card className="card-hover gradient-card shadow-lg animate-bounceIn stagger-3">
          <CardContent className="p-4 text-center">
            <div className="text-3xl mb-2">💰</div>
            <div className="text-2xl font-bold text-purple-600">
              ₹{programs.reduce((sum, program) => sum + (program.price * program.currentStudents), 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Monthly Revenue</div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <Card className="card-hover shadow-lg animate-slideInUp">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-cricket-green">Training Programs</h3>
            <Button
              onClick={() => setShowAddModal(true)}
              className="bg-cricket-orange hover:bg-cricket-orange/90 hover:scale-105 transition-all duration-200"
            >
              ➕ Add Program
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Programs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {programs.map((program, index) => (
          <Card key={program.id} className={`card-hover gradient-card shadow-lg overflow-hidden animate-bounceIn stagger-${index + 1}`}>
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-4xl">{program.icon}</div>
                  <div>
                    <CardTitle className="text-cricket-green">{program.title}</CardTitle>
                    <p className="text-sm text-gray-600">{program.ageGroup}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(program.status)}`}>
                  {program.status}
                </span>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-gray-700 text-sm leading-relaxed">{program.description}</p>
              
              {/* Program Details */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <span>👨‍🏫</span>
                  <span className="text-gray-600">{program.coach}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>⏰</span>
                  <span className="text-gray-600">{program.duration}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>💰</span>
                  <span className="text-gray-600">₹{program.price}/month</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>📅</span>
                  <span className="text-gray-600">Schedule</span>
                </div>
              </div>
              
              <div className="text-xs text-gray-500">
                {program.schedule}
              </div>
              
              {/* Occupancy */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Enrollment</span>
                  <span className="text-sm text-gray-600">
                    {program.currentStudents}/{program.maxStudents}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-1000 ${getOccupancyColor(program.currentStudents, program.maxStudents)}`}
                    style={{ width: `${(program.currentStudents / program.maxStudents) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              {/* Features */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Program Features</h4>
                <div className="space-y-1">
                  {program.features.slice(0, 3).map((feature, idx) => (
                    <div key={idx} className="flex items-center space-x-2 text-sm text-gray-600">
                      <span className="text-cricket-orange">✓</span>
                      <span>{feature}</span>
                    </div>
                  ))}
                  {program.features.length > 3 && (
                    <div className="text-sm text-gray-500">
                      +{program.features.length - 3} more features
                    </div>
                  )}
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex space-x-2 pt-4 border-t border-gray-100">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setSelectedProgram(program);
                    setShowEditModal(true);
                  }}
                >
                  ✏️ Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 text-blue-600 border-blue-600 hover:bg-blue-50"
                >
                  👁️ View Details
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-600 border-red-600 hover:bg-red-50"
                >
                  🗑️
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modals */}
      {showAddModal && <ProgramModal />}
      {showEditModal && selectedProgram && <ProgramModal program={selectedProgram} isEdit={true} />}
    </div>
  );
};

export default ProgramsManagement;