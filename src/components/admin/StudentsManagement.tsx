import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  program: string;
  joinDate: string;
  status: 'active' | 'inactive' | 'pending';
  fees: number;
  avatar: string;
}

const StudentsManagement = () => {
  const [students] = useState<Student[]>([
    {
      id: '1',
      name: 'Alex Rodriguez',
      email: 'alex.rodriguez@email.com',
      phone: '+1-555-0123',
      age: 16,
      program: 'Youth Development',
      joinDate: '2023-09-15',
      status: 'active',
      fees: 10000,
      avatar: '🏏'
    },
    {
      id: '2',
      name: 'Emma Thompson',
      email: 'emma.thompson@email.com',
      phone: '+1-555-0124',
      age: 14,
      program: 'Junior Cricket',
      joinDate: '2023-10-01',
      status: 'active',
      fees: 6500,
      avatar: '⭐'
    },
    {
      id: '3',
      name: 'James Wilson',
      email: 'james.wilson@email.com',
      phone: '+1-555-0125',
      age: 28,
      program: 'Adult Programs',
      joinDate: '2023-08-20',
      status: 'active',
      fees: 12500,
      avatar: '🎯'
    },
    {
      id: '4',
      name: 'Sarah Mitchell',
      email: 'sarah.mitchell@email.com',
      phone: '+1-555-0126',
      age: 12,
      program: 'Junior Cricket',
      joinDate: '2023-11-10',
      status: 'pending',
      fees: 6500,
      avatar: '👩‍🎓'
    },
    {
      id: '5',
      name: 'Michael Chen',
      email: 'michael.chen@email.com',
      phone: '+1-555-0127',
      age: 19,
      program: 'Elite Training',
      joinDate: '2023-07-05',
      status: 'active',
      fees: 25000,
      avatar: '👑'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterProgram, setFilterProgram] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  const programs = ['Junior Cricket', 'Youth Development', 'Adult Programs', 'Elite Training'];

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProgram = filterProgram === 'all' || student.program === filterProgram;
    const matchesStatus = filterStatus === 'all' || student.status === filterStatus;
    
    return matchesSearch && matchesProgram && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const AddStudentModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
      <Card className="w-full max-w-md mx-4 animate-bounceIn">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Add New Student</span>
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cricket-orange focus:border-transparent"
                placeholder="Enter student name"
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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cricket-orange focus:border-transparent"
                  placeholder="Age"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Program</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cricket-orange focus:border-transparent">
                  {programs.map(program => (
                    <option key={program} value={program}>{program}</option>
                  ))}
                </select>
              </div>
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
                Add Student
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
            <div className="text-3xl mb-2">👥</div>
            <div className="text-2xl font-bold text-cricket-green">{students.length}</div>
            <div className="text-sm text-gray-600">Total Students</div>
          </CardContent>
        </Card>
        <Card className="card-hover gradient-card shadow-lg animate-bounceIn stagger-1">
          <CardContent className="p-4 text-center">
            <div className="text-3xl mb-2">✅</div>
            <div className="text-2xl font-bold text-green-600">{students.filter(s => s.status === 'active').length}</div>
            <div className="text-sm text-gray-600">Active Students</div>
          </CardContent>
        </Card>
        <Card className="card-hover gradient-card shadow-lg animate-bounceIn stagger-2">
          <CardContent className="p-4 text-center">
            <div className="text-3xl mb-2">⏳</div>
            <div className="text-2xl font-bold text-yellow-600">{students.filter(s => s.status === 'pending').length}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </CardContent>
        </Card>
        <Card className="card-hover gradient-card shadow-lg animate-bounceIn stagger-3">
          <CardContent className="p-4 text-center">
            <div className="text-3xl mb-2">💰</div>
            <div className="text-2xl font-bold text-cricket-orange">
              ₹{students.reduce((sum, student) => sum + student.fees, 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Monthly Revenue</div>
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
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cricket-orange focus:border-transparent"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  🔍
                </div>
              </div>
              
              <select
                value={filterProgram}
                onChange={(e) => setFilterProgram(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cricket-orange focus:border-transparent"
              >
                <option value="all">All Programs</option>
                {programs.map(program => (
                  <option key={program} value={program}>{program}</option>
                ))}
              </select>
              
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cricket-orange focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            
            <Button
              onClick={() => setShowAddModal(true)}
              className="bg-cricket-orange hover:bg-cricket-orange/90 hover:scale-105 transition-all duration-200"
            >
              ➕ Add Student
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Students List */}
      <Card className="card-hover shadow-lg animate-fadeInUp">
        <CardHeader>
          <CardTitle className="flex items-center">
            <span className="mr-2">👥</span>
            Students ({filteredStudents.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Student</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Contact</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Program</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Fees</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student, index) => (
                  <tr key={student.id} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200 animate-slideInLeft stagger-${index + 1}`}>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-cricket-orange/20 rounded-full flex items-center justify-center text-lg">
                          {student.avatar}
                        </div>
                        <div>
                          <div className="font-medium text-cricket-green">{student.name}</div>
                          <div className="text-sm text-gray-500">Age: {student.age}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm">
                        <div className="text-gray-800">{student.email}</div>
                        <div className="text-gray-500">{student.phone}</div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="bg-cricket-green/10 text-cricket-green px-2 py-1 rounded-full text-xs font-medium">
                        {student.program}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(student.status)}`}>
                        {student.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-semibold text-cricket-orange">
                      ₹{student.fees}/month
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-800 transition-colors duration-200">
                          👁️
                        </button>
                        <button className="text-green-600 hover:text-green-800 transition-colors duration-200">
                          ✏️
                        </button>
                        <button className="text-red-600 hover:text-red-800 transition-colors duration-200">
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredStudents.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-4">🔍</div>
              <p>No students found matching your criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {showAddModal && <AddStudentModal />}
    </div>
  );
};

export default StudentsManagement;