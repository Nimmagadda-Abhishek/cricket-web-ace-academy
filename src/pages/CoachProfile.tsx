import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { coachesApi } from '@/services/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  CalendarIcon, 
  ClockIcon, 
  TrophyIcon, 
  GraduationCapIcon, 
  StarIcon,
  PhoneIcon,
  MailIcon,
  MapPinIcon
} from 'lucide-react';

interface CoachProfile {
  _id: string;
  name: string;
  email: string;
  phone: string;
  specialization: string[];
  experience: number;
  bio: string;
  image: string;
  certifications: string[];
  contactInfo: {
    emergencyContact: string;
    address: string;
    dateOfBirth: string;
  };
  employment: {
    joinDate: string;
    employmentType: string;
    status: string;
  };
  qualifications: {
    degree: string;
    institution: string;
    year: number;
    cricketLevel: string;
  }[];
  achievements: string[];
  availability: {
    days: string[];
    timeSlots: {
      start: string;
      end: string;
    }[];
  };
  rating: {
    average: number;
    count: number;
    reviews: {
      studentId: string;
      rating: number;
      comment: string;
      date: string;
    }[];
  };
  programs: {
    _id: string;
    title: string;
    currentStudents: number;
    maxStudents: number;
    category: string;
    price: number;
  }[];
}

const CoachProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [coach, setCoach] = useState<CoachProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCoachProfile = async () => {
      try {
        setLoading(true);
        if (id) {
          const response = await coachesApi.getCoachById(id);
          setCoach(response.data.coach);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load coach profile');
        console.error('Error fetching coach profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCoachProfile();
  }, [id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <Skeleton className="h-80 w-full mb-4" />
              <Skeleton className="h-12 w-full mb-2" />
              <Skeleton className="h-6 w-full mb-2" />
              <Skeleton className="h-6 w-3/4 mb-8" />
            </div>
            
            <div className="md:col-span-2">
              <Skeleton className="h-12 w-3/4 mb-4" />
              <Skeleton className="h-6 w-full mb-2" />
              <Skeleton className="h-6 w-full mb-2" />
              <Skeleton className="h-6 w-3/4 mb-8" />
              
              <Skeleton className="h-12 w-full mb-4" />
              <div className="grid grid-cols-2 gap-4 mb-8">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Error Loading Coach Profile</h2>
            <p className="mb-6">{error}</p>
            <Button onClick={() => navigate('/coaches')}>
              View All Coaches
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!coach) {
    return (
      <div>
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Coach Not Found</h2>
            <p className="mb-6">The coach profile you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate('/coaches')}>
              View All Coaches
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      
      <div className="bg-gradient-to-b from-cricket-green/10 to-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Sidebar - Coach Info */}
            <div className="md:col-span-1">
              <Card className="bg-white shadow-xl overflow-hidden">
                <div className="relative h-80">
                  <img 
                    src={coach.image || 'https://via.placeholder.com/400x500?text=Coach+Image'} 
                    alt={coach.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end">
                    <div className="p-4 text-white">
                      <div className="flex items-center mb-1">
                        <StarIcon className="h-5 w-5 text-yellow-400 mr-1" />
                        <span className="font-semibold">{coach.rating.average.toFixed(1)}</span>
                        <span className="text-sm ml-1">({coach.rating.count} reviews)</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <h1 className="text-2xl font-bold text-cricket-green mb-1">{coach.name}</h1>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {coach.specialization.map((spec, index) => (
                      <span 
                        key={index} 
                        className="px-2 py-1 bg-cricket-orange/10 text-cricket-orange text-xs font-medium rounded-full"
                      >
                        {spec.charAt(0).toUpperCase() + spec.slice(1)}
                      </span>
                    ))}
                  </div>
                  
                  <div className="space-y-4 text-sm">
                    <div className="flex items-start space-x-3">
                      <MailIcon className="h-5 w-5 text-cricket-orange flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{coach.email}</span>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <PhoneIcon className="h-5 w-5 text-cricket-orange flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{coach.phone}</span>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <MapPinIcon className="h-5 w-5 text-cricket-orange flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{coach.contactInfo.address}</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <h3 className="font-semibold text-cricket-green mb-3">Availability</h3>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-3">
                        <CalendarIcon className="h-5 w-5 text-cricket-orange flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-medium">Days:</span>{' '}
                          {coach.availability.days.map(day => day.charAt(0).toUpperCase() + day.slice(1)).join(', ')}
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <ClockIcon className="h-5 w-5 text-cricket-orange flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-medium">Time Slots:</span>
                          <ul className="mt-1">
                            {coach.availability.timeSlots.map((slot, index) => (
                              <li key={index}>{slot.start} - {slot.end}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full mt-6 bg-cricket-orange hover:bg-cricket-orange/90"
                    onClick={() => navigate('/contact', { state: { coachId: coach._id, coachName: coach.name } })}
                  >
                    Contact Coach
                  </Button>
                </CardContent>
              </Card>
            </div>
            
            {/* Main Content */}
            <div className="md:col-span-2">
              <div className="mb-8">
                <h2 className="text-3xl font-bold font-poppins heading-gradient mb-4">About {coach.name}</h2>
                <p className="text-lg text-gray-700 leading-relaxed">{coach.bio}</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                  <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
                    <CardContent className="p-4 flex flex-col items-center text-center">
                      <TrophyIcon className="h-8 w-8 text-cricket-orange mb-2" />
                      <h3 className="font-semibold text-gray-700">Experience</h3>
                      <p className="text-sm text-gray-600">{coach.experience} years</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
                    <CardContent className="p-4 flex flex-col items-center text-center">
                      <GraduationCapIcon className="h-8 w-8 text-cricket-orange mb-2" />
                      <h3 className="font-semibold text-gray-700">Certifications</h3>
                      <p className="text-sm text-gray-600">{coach.certifications.length} certifications</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
                    <CardContent className="p-4 flex flex-col items-center text-center">
                      <CalendarIcon className="h-8 w-8 text-cricket-orange mb-2" />
                      <h3 className="font-semibold text-gray-700">Joined</h3>
                      <p className="text-sm text-gray-600">{formatDate(coach.employment.joinDate)}</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
                    <CardContent className="p-4 flex flex-col items-center text-center">
                      <StarIcon className="h-8 w-8 text-cricket-orange mb-2" />
                      <h3 className="font-semibold text-gray-700">Rating</h3>
                      <p className="text-sm text-gray-600">{coach.rating.average.toFixed(1)} / 5</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              {/* Coach Details Tabs */}
              <Tabs defaultValue="programs" className="mb-8">
                <TabsList className="grid grid-cols-4 mb-8">
                  <TabsTrigger value="programs">Programs</TabsTrigger>
                  <TabsTrigger value="qualifications">Qualifications</TabsTrigger>
                  <TabsTrigger value="achievements">Achievements</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>
                
                <TabsContent value="programs" className="bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-2xl font-bold mb-6 text-cricket-green">Programs by {coach.name}</h2>
                  
                  {coach.programs.length === 0 ? (
                    <p className="text-gray-600">No programs currently assigned to this coach.</p>
                  ) : (
                    <div className="grid md:grid-cols-2 gap-6">
                      {coach.programs.map((program) => (
                        <Card key={program._id} className="hover:shadow-lg transition-shadow">
                          <CardContent className="p-4">
                            <h3 className="text-lg font-semibold text-cricket-green mb-2">{program.title}</h3>
                            
                            <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
                              <span>Category:</span>
                              <span className="font-medium">{program.category.charAt(0).toUpperCase() + program.category.slice(1)}</span>
                            </div>
                            
                            <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
                              <span>Price:</span>
                              <span className="font-medium">₹{program.price.toLocaleString()}</span>
                            </div>
                            
                            <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
                              <span>Enrollment:</span>
                              <span className="font-medium">{program.currentStudents}/{program.maxStudents}</span>
                            </div>
                            
                            <Button 
                              variant="outline" 
                              className="w-full"
                              onClick={() => navigate(`/programs/${program._id}`)}
                            >
                              View Program
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="qualifications" className="bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-2xl font-bold mb-6 text-cricket-green">Qualifications & Education</h2>
                  
                  {coach.qualifications.length === 0 ? (
                    <p className="text-gray-600">No qualifications listed for this coach.</p>
                  ) : (
                    <div className="space-y-6">
                      {coach.qualifications.map((qualification, index) => (
                        <div key={index} className="border-l-4 border-cricket-orange pl-4 py-1">
                          <h3 className="text-lg font-semibold text-cricket-green">{qualification.degree}</h3>
                          <p className="text-gray-700">{qualification.institution}</p>
                          <div className="flex justify-between mt-1 text-sm text-gray-600">
                            <span>Year: {qualification.year}</span>
                            <span>Level: {qualification.cricketLevel.charAt(0).toUpperCase() + qualification.cricketLevel.slice(1)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="mt-8">
                    <h3 className="text-xl font-semibold mb-4 text-cricket-green">Certifications</h3>
                    
                    {coach.certifications.length === 0 ? (
                      <p className="text-gray-600">No certifications listed for this coach.</p>
                    ) : (
                      <ul className="list-disc pl-5 space-y-2">
                        {coach.certifications.map((certification, index) => (
                          <li key={index} className="text-gray-700">{certification}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="achievements" className="bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-2xl font-bold mb-6 text-cricket-green">Achievements & Accolades</h2>
                  
                  {coach.achievements.length === 0 ? (
                    <p className="text-gray-600">No achievements listed for this coach.</p>
                  ) : (
                    <div className="grid md:grid-cols-2 gap-4">
                      {coach.achievements.map((achievement, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <TrophyIcon className="h-5 w-5 text-cricket-orange flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{achievement}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="reviews" className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-cricket-green">Student Reviews</h2>
                    <div className="flex items-center">
                      <StarIcon className="h-6 w-6 text-yellow-400 mr-1" />
                      <span className="text-xl font-bold">{coach.rating.average.toFixed(1)}</span>
                      <span className="text-gray-600 ml-1">({coach.rating.count} reviews)</span>
                    </div>
                  </div>
                  
                  {coach.rating.reviews.length === 0 ? (
                    <p className="text-gray-600">No reviews yet for this coach.</p>
                  ) : (
                    <div className="space-y-6">
                      {coach.rating.reviews.map((review, index) => (
                        <div key={index} className="border-b border-gray-100 pb-6 last:border-0">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-cricket-orange/20 rounded-full flex items-center justify-center text-cricket-orange mr-3">
                                S
                              </div>
                              <div>
                                <p className="font-medium">Student</p>
                                <p className="text-xs text-gray-500">{formatDate(review.date)}</p>
                              </div>
                            </div>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <StarIcon 
                                  key={i} 
                                  className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`} 
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-700">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default CoachProfile;