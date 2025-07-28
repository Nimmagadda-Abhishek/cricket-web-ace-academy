import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { programsApi } from '@/services/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { CalendarIcon, ClockIcon, MapPinIcon, UsersIcon, CheckCircleIcon, BadgeIndianRupeeIcon } from 'lucide-react';

interface ProgramDetails {
  _id: string;
  title: string;
  description: string;
  ageGroup: string;
  duration: string;
  price: number;
  maxStudents: number;
  currentStudents: number;
  features: string[];
  status: string;
  coach: {
    _id: string;
    name: string;
    specialization: string[];
    rating: {
      average: number;
    };
  };
  schedule: {
    days: string[];
    time: string;
    venue: string;
    sessionDuration: number;
  };
  equipment: {
    provided: string[];
    required: string[];
  };
  level: string;
  category: string;
  startDate: string;
  icon: string;
  image: string;
  prerequisites: string[];
  certificationProvided: boolean;
  discount?: {
    type: string;
    value: number;
    validUntil: string;
    description: string;
  };
}

const ProgramDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [program, setProgram] = useState<ProgramDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProgramDetails = async () => {
      try {
        setLoading(true);
        if (id) {
          const response = await programsApi.getProgramById(id);
          setProgram(response.data.program);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load program details');
        console.error('Error fetching program details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProgramDetails();
  }, [id]);

  const handleEnrollNow = () => {
    if (program) {
      navigate(`/checkout/${program._id}`, { state: { program } });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const calculateDiscount = (price: number, discount?: { type: string; value: number }) => {
    if (!discount) return price;
    
    if (discount.type === 'percentage') {
      return price - (price * (discount.value / 100));
    } else if (discount.type === 'fixed') {
      return price - discount.value;
    }
    
    return price;
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <Skeleton className="h-12 w-3/4 mb-4" />
              <Skeleton className="h-6 w-full mb-2" />
              <Skeleton className="h-6 w-full mb-2" />
              <Skeleton className="h-6 w-3/4 mb-8" />
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
              
              <Skeleton className="h-64 w-full" />
            </div>
            
            <div>
              <Skeleton className="h-96 w-full mb-4" />
              <Skeleton className="h-12 w-full" />
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
            <h2 className="text-2xl font-bold mb-4">Error Loading Program</h2>
            <p className="mb-6">{error}</p>
            <Button onClick={() => navigate('/programs')}>
              View All Programs
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!program) {
    return (
      <div>
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Program Not Found</h2>
            <p className="mb-6">The program you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate('/programs')}>
              View All Programs
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const discountedPrice = calculateDiscount(program.price, program.discount);
  const hasDiscount = discountedPrice < program.price;

  return (
    <div>
      <Navbar />
      
      <div className="bg-gradient-to-b from-cricket-green/10 to-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="md:col-span-2">
              <div className="mb-8">
                <div className="flex items-center mb-2">
                  <span className="text-3xl mr-3">{program.icon}</span>
                  <h1 className="text-4xl font-bold font-poppins gradient-text-programs">{program.title}</h1>
                </div>
                <p className="text-xl text-gray-600 mb-4">{program.description}</p>
                
                <div className="flex flex-wrap gap-3 mb-6">
                  <span className="px-3 py-1 bg-cricket-orange/10 text-cricket-orange text-sm font-medium rounded-full">
                    {program.level.charAt(0).toUpperCase() + program.level.slice(1)}
                  </span>
                  <span className="px-3 py-1 bg-cricket-green/10 text-cricket-green text-sm font-medium rounded-full">
                    {program.category.charAt(0).toUpperCase() + program.category.slice(1)}
                  </span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                    {program.ageGroup}
                  </span>
                  {program.certificationProvided && (
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm font-medium rounded-full">
                      Certification Provided
                    </span>
                  )}
                </div>
              </div>
              
              {/* Program Highlights */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="p-4 flex flex-col items-center text-center">
                    <CalendarIcon className="h-8 w-8 text-cricket-orange mb-2" />
                    <h3 className="font-semibold text-gray-700">Start Date</h3>
                    <p className="text-sm text-gray-600">{formatDate(program.startDate)}</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="p-4 flex flex-col items-center text-center">
                    <ClockIcon className="h-8 w-8 text-cricket-orange mb-2" />
                    <h3 className="font-semibold text-gray-700">Duration</h3>
                    <p className="text-sm text-gray-600">{program.duration}</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="p-4 flex flex-col items-center text-center">
                    <MapPinIcon className="h-8 w-8 text-cricket-orange mb-2" />
                    <h3 className="font-semibold text-gray-700">Venue</h3>
                    <p className="text-sm text-gray-600">{program.schedule.venue}</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="p-4 flex flex-col items-center text-center">
                    <UsersIcon className="h-8 w-8 text-cricket-orange mb-2" />
                    <h3 className="font-semibold text-gray-700">Availability</h3>
                    <p className="text-sm text-gray-600">
                      {program.currentStudents}/{program.maxStudents} Enrolled
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              {/* Program Details Tabs */}
              <Tabs defaultValue="details" className="mb-8">
                <TabsList className="grid grid-cols-4 mb-8">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="schedule">Schedule</TabsTrigger>
                  <TabsTrigger value="equipment">Equipment</TabsTrigger>
                  <TabsTrigger value="coach">Coach</TabsTrigger>
                </TabsList>
                
                <TabsContent value="details" className="bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-2xl font-bold mb-4 text-cricket-green">Program Features</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {program.features.map((feature, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <CheckCircleIcon className="h-5 w-5 text-cricket-orange flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  {program.prerequisites.length > 0 && (
                    <div className="mt-8">
                      <h3 className="text-xl font-semibold mb-3 text-cricket-green">Prerequisites</h3>
                      <ul className="list-disc pl-5 space-y-2">
                        {program.prerequisites.map((prerequisite, index) => (
                          <li key={index} className="text-gray-700">{prerequisite}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="schedule" className="bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-2xl font-bold mb-4 text-cricket-green">Training Schedule</h2>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <CalendarIcon className="h-5 w-5 text-cricket-orange flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold">Days:</span>{' '}
                        {program.schedule.days.map(day => day.charAt(0).toUpperCase() + day.slice(1)).join(', ')}
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <ClockIcon className="h-5 w-5 text-cricket-orange flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold">Time:</span> {program.schedule.time}
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <MapPinIcon className="h-5 w-5 text-cricket-orange flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold">Venue:</span> {program.schedule.venue}
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <ClockIcon className="h-5 w-5 text-cricket-orange flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold">Session Duration:</span> {program.schedule.sessionDuration} minutes
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="equipment" className="bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-2xl font-bold mb-4 text-cricket-green">Equipment</h2>
                  
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-3 text-cricket-orange">Provided by Academy</h3>
                    <ul className="list-disc pl-5 space-y-2">
                      {program.equipment.provided.map((item, index) => (
                        <li key={index} className="text-gray-700">{item}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-cricket-orange">Required from Student</h3>
                    <ul className="list-disc pl-5 space-y-2">
                      {program.equipment.required.map((item, index) => (
                        <li key={index} className="text-gray-700">{item}</li>
                      ))}
                    </ul>
                  </div>
                </TabsContent>
                
                <TabsContent value="coach" className="bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-2xl font-bold mb-4 text-cricket-green">Program Coach</h2>
                  
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 bg-cricket-orange/20 rounded-full flex items-center justify-center text-cricket-orange text-2xl mr-4">
                      {program.coach.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{program.coach.name}</h3>
                      <p className="text-gray-600">{program.coach.specialization.join(', ')}</p>
                      <div className="flex items-center mt-1">
                        <span className="text-yellow-500">★</span>
                        <span className="ml-1">{program.coach.rating.average.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                  

                </TabsContent>
              </Tabs>
              
              {/* Program Image */}
              <div className="rounded-lg overflow-hidden shadow-lg mb-8">
                <img 
                  src={program.image} 
                  alt={program.title} 
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
            
            {/* Sidebar - Enrollment Card */}
            <div>
              <Card className="bg-white shadow-xl sticky top-24">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-4 text-cricket-green">Enrollment Details</h2>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                      <span className="text-gray-600">Program Fee:</span>
                      <div className="flex items-center">
                        <BadgeIndianRupeeIcon className="h-4 w-4 mr-1 text-cricket-green" />
                        <span className={`text-xl font-bold ${hasDiscount ? 'line-through text-gray-400' : 'text-cricket-green'}`}>
                          {program.price.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    
                    {hasDiscount && (
                      <>
                        <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                          <span className="text-gray-600">Discount:</span>
                          <span className="text-green-600 font-semibold">
                            {program.discount?.type === 'percentage' 
                              ? `${program.discount.value}%` 
                              : `₹${program.discount?.value.toLocaleString()}`}
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                          <span className="text-gray-600">Discounted Price:</span>
                          <div className="flex items-center">
                            <BadgeIndianRupeeIcon className="h-4 w-4 mr-1 text-cricket-orange" />
                            <span className="text-2xl font-bold text-cricket-orange">
                              {discountedPrice.toLocaleString()}
                            </span>
                          </div>
                        </div>
                        
                        {program.discount?.validUntil && (
                          <div className="bg-yellow-50 p-3 rounded-md text-sm text-yellow-800">
                            <p className="font-semibold">Limited Time Offer!</p>
                            <p>Valid until {formatDate(program.discount.validUntil)}</p>
                          </div>
                        )}
                      </>
                    )}
                    
                    <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-semibold">{program.duration}</span>
                    </div>
                    
                    <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                      <span className="text-gray-600">Age Group:</span>
                      <span className="font-semibold">{program.ageGroup}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Availability:</span>
                      <span className={`font-semibold ${program.currentStudents >= program.maxStudents ? 'text-red-600' : 'text-green-600'}`}>
                        {program.currentStudents >= program.maxStudents 
                          ? 'Full' 
                          : `${program.maxStudents - program.currentStudents} spots left`}
                      </span>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full bg-cricket-orange hover:bg-cricket-orange/90 text-white py-3 rounded-lg font-semibold text-lg"
                    disabled={program.currentStudents >= program.maxStudents}
                    onClick={handleEnrollNow}
                  >
                    {program.currentStudents >= program.maxStudents ? 'Program Full' : 'Enroll Now'}
                  </Button>
                  
                  {program.currentStudents >= program.maxStudents && (
                    <p className="text-center text-sm mt-3 text-gray-600">
                      This program is currently full. Please check back later or explore our other programs.
                    </p>
                  )}
                  
                  <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600 mb-2">Need more information?</p>
                    <Link 
                      to="/contact" 
                      className="text-cricket-green hover:text-cricket-orange transition-colors font-medium"
                    >
                      Contact us for details
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Related Programs Section - Can be added later */}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ProgramDetails;