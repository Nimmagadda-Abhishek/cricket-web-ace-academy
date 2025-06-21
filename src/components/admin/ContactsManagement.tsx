import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'new' | 'replied' | 'resolved' | 'archived';
  priority: 'low' | 'medium' | 'high';
  submittedAt: string;
  repliedAt?: string;
  category: 'inquiry' | 'enrollment' | 'complaint' | 'feedback' | 'other';
}

const ContactsManagement = () => {
  const [contacts] = useState<Contact[]>([
    {
      id: '1',
      name: 'Jennifer Adams',
      email: 'jennifer.adams@email.com',
      phone: '+1-555-0301',
      subject: 'Enrollment Inquiry for Junior Program',
      message: 'Hi, I would like to enroll my 8-year-old daughter in your junior cricket program. Could you please provide me with more details about the schedule, fees, and enrollment process?',
      status: 'new',
      priority: 'high',
      submittedAt: '2024-02-10T14:30:00Z',
      category: 'enrollment'
    },
    {
      id: '2',
      name: 'Robert Chen',
      email: 'robert.chen@email.com',
      phone: '+1-555-0302',
      subject: 'Coaching Staff Question',
      message: 'I am interested in the adult cricket program. Can you tell me more about the qualifications and experience of your coaching staff?',
      status: 'replied',
      priority: 'medium',
      submittedAt: '2024-02-09T10:15:00Z',
      repliedAt: '2024-02-09T16:20:00Z',
      category: 'inquiry'
    },
    {
      id: '3',
      name: 'Lisa Martinez',
      email: 'lisa.martinez@email.com',
      phone: '+1-555-0303',
      subject: 'Facility Tour Request',
      message: 'My family is considering enrolling our two children in your programs. Would it be possible to schedule a tour of your facilities?',
      status: 'resolved',
      priority: 'medium',
      submittedAt: '2024-02-08T09:45:00Z',
      repliedAt: '2024-02-08T11:30:00Z',
      category: 'inquiry'
    },
    {
      id: '4',
      name: 'Michael Thompson',
      email: 'michael.thompson@email.com',
      phone: '+1-555-0304',
      subject: 'Schedule Conflict Issue',
      message: 'There seems to be a scheduling conflict with my son\'s training sessions. The times have been changed without prior notice. Please help resolve this.',
      status: 'new',
      priority: 'high',
      submittedAt: '2024-02-07T16:20:00Z',
      category: 'complaint'
    },
    {
      id: '5',
      name: 'Amanda Wilson',
      email: 'amanda.wilson@email.com',
      phone: '+1-555-0305',
      subject: 'Excellent Training Experience',
      message: 'I wanted to share how impressed we are with the training our daughter has received. The coaches are fantastic and she has improved tremendously. Thank you!',
      status: 'archived',
      priority: 'low',
      submittedAt: '2024-02-06T13:10:00Z',
      repliedAt: '2024-02-06T14:45:00Z',
      category: 'feedback'
    },
    {
      id: '6',
      name: 'David Kumar',
      email: 'david.kumar@email.com',
      phone: '+1-555-0306',
      subject: 'Elite Training Program Details',
      message: 'I am a serious cricket player looking to improve my game. Can you provide details about your elite training program, including costs and selection criteria?',
      status: 'new',
      priority: 'medium',
      submittedAt: '2024-02-05T11:30:00Z',
      category: 'inquiry'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState(false);

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || contact.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || contact.category === filterCategory;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'replied': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'inquiry': return '❓';
      case 'enrollment': return '📝';
      case 'complaint': return '⚠️';
      case 'feedback': return '💬';
      case 'other': return '📋';
      default: return '📋';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const ContactDetailsModal = ({ contact }: { contact: Contact }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
      <Card className="w-full max-w-2xl mx-4 max-h-screen overflow-y-auto animate-bounceIn">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{getCategoryIcon(contact.category)}</span>
              <div>
                <h3 className="text-xl font-bold text-cricket-green">{contact.name}</h3>
                <p className="text-sm text-gray-600">{contact.email}</p>
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
          {/* Contact Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Phone</label>
              <p className="text-cricket-green">{contact.phone}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Category</label>
              <p className="text-cricket-green capitalize">{contact.category}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Priority</label>
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium capitalize ${getPriorityColor(contact.priority)}`}>
                {contact.priority}
              </span>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Status</label>
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(contact.status)}`}>
                {contact.status}
              </span>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Submitted</label>
              <p className="text-cricket-green text-sm">{formatDate(contact.submittedAt)}</p>
            </div>
            {contact.repliedAt && (
              <div>
                <label className="text-sm font-medium text-gray-500">Replied</label>
                <p className="text-cricket-green text-sm">{formatDate(contact.repliedAt)}</p>
              </div>
            )}
          </div>

          {/* Subject */}
          <div>
            <label className="text-sm font-medium text-gray-500 block mb-2">Subject</label>
            <p className="text-gray-800 font-medium">{contact.subject}</p>
          </div>

          {/* Message */}
          <div>
            <label className="text-sm font-medium text-gray-500 block mb-2">Message</label>
            <div className="bg-gray-50 p-4 rounded-lg border">
              <p className="text-gray-700 leading-relaxed">{contact.message}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => setShowDetailsModal(false)}
            >
              Close
            </Button>
            <Button 
              className="flex-1 bg-cricket-orange hover:bg-cricket-orange/90"
              onClick={() => {
                setShowDetailsModal(false);
                setShowReplyModal(true);
              }}
            >
              📧 Reply
            </Button>
            <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
              <option value="new">New</option>
              <option value="replied">Replied</option>
              <option value="resolved">Resolved</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const ReplyModal = ({ contact }: { contact: Contact }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
      <Card className="w-full max-w-2xl mx-4 max-h-screen overflow-y-auto animate-bounceIn">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Reply to {contact.name}</span>
            <button 
              onClick={() => setShowReplyModal(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
              <input
                type="email"
                value={contact.email}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
              <input
                type="text"
                defaultValue={`Re: ${contact.subject}`}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cricket-orange focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
              <textarea
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cricket-orange focus:border-transparent"
                placeholder="Type your reply here..."
              />
            </div>
            
            <div className="flex space-x-3 pt-4">
              <Button 
                type="button"
                onClick={() => setShowReplyModal(false)}
                variant="outline" 
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                className="flex-1 bg-cricket-orange hover:bg-cricket-orange/90"
              >
                📧 Send Reply
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
            <div className="text-3xl mb-2">📞</div>
            <div className="text-2xl font-bold text-cricket-green">{contacts.length}</div>
            <div className="text-sm text-gray-600">Total Contacts</div>
          </CardContent>
        </Card>
        <Card className="card-hover gradient-card shadow-lg animate-bounceIn stagger-1">
          <CardContent className="p-4 text-center">
            <div className="text-3xl mb-2">🆕</div>
            <div className="text-2xl font-bold text-blue-600">{contacts.filter(c => c.status === 'new').length}</div>
            <div className="text-sm text-gray-600">New Messages</div>
          </CardContent>
        </Card>
        <Card className="card-hover gradient-card shadow-lg animate-bounceIn stagger-2">
          <CardContent className="p-4 text-center">
            <div className="text-3xl mb-2">⚠️</div>
            <div className="text-2xl font-bold text-red-600">{contacts.filter(c => c.priority === 'high').length}</div>
            <div className="text-sm text-gray-600">High Priority</div>
          </CardContent>
        </Card>
        <Card className="card-hover gradient-card shadow-lg animate-bounceIn stagger-3">
          <CardContent className="p-4 text-center">
            <div className="text-3xl mb-2">✅</div>
            <div className="text-2xl font-bold text-green-600">{contacts.filter(c => c.status === 'resolved').length}</div>
            <div className="text-sm text-gray-600">Resolved</div>
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
                  placeholder="Search contacts..."
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
                <option value="new">New</option>
                <option value="replied">Replied</option>
                <option value="resolved">Resolved</option>
                <option value="archived">Archived</option>
              </select>
              
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cricket-orange focus:border-transparent"
              >
                <option value="all">All Categories</option>
                <option value="inquiry">Inquiries</option>
                <option value="enrollment">Enrollments</option>
                <option value="complaint">Complaints</option>
                <option value="feedback">Feedback</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contacts List */}
      <Card className="card-hover shadow-lg animate-fadeInUp">
        <CardHeader>
          <CardTitle className="flex items-center">
            <span className="mr-2">📞</span>
            Contact Messages ({filteredContacts.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredContacts.map((contact, index) => (
              <div
                key={contact.id}
                className={`border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 cursor-pointer animate-slideInLeft stagger-${index + 1}`}
                onClick={() => {
                  setSelectedContact(contact);
                  setShowDetailsModal(true);
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getCategoryIcon(contact.category)}</span>
                    <div>
                      <h4 className="font-semibold text-cricket-green">{contact.name}</h4>
                      <p className="text-sm text-gray-600">{contact.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getPriorityColor(contact.priority)}`}>
                      {contact.priority}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(contact.status)}`}>
                      {contact.status}
                    </span>
                  </div>
                </div>
                
                <h5 className="font-medium text-gray-800 mb-2">{contact.subject}</h5>
                <p className="text-sm text-gray-600 line-clamp-2 mb-3">{contact.message}</p>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>📅 {formatDate(contact.submittedAt)}</span>
                  <span className="capitalize">{contact.category}</span>
                </div>
              </div>
            ))}
          </div>
          
          {filteredContacts.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-4">📭</div>
              <p>No contacts found matching your criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      {showDetailsModal && selectedContact && <ContactDetailsModal contact={selectedContact} />}
      {showReplyModal && selectedContact && <ReplyModal contact={selectedContact} />}
    </div>
  );
};

export default ContactsManagement;