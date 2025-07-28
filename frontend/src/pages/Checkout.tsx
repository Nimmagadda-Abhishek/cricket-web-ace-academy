import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { programsApi, paymentsApi } from '@/services/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/components/ui/use-toast';
import { BadgeIndianRupeeIcon, CreditCardIcon, CheckCircleIcon, AlertCircleIcon } from 'lucide-react';

interface ProgramDetails {
  _id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  ageGroup: string;
  icon: string;
  discount?: {
    type: string;
    value: number;
    validUntil: string;
    description: string;
  };
}

interface StudentInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  emergencyContact: string;
  emergencyContactName: string;
  emergencyContactRelation: string;
  medicalConditions: string;
}

interface PaymentInfo {
  method: 'card' | 'upi' | 'netbanking';
  cardNumber?: string;
  cardExpiry?: string;
  cardCvv?: string;
  cardName?: string;
  upiId?: string;
  bankName?: string;
}

const Checkout: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [program, setProgram] = useState<ProgramDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<number>(1);
  const [studentInfo, setStudentInfo] = useState<StudentInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    emergencyContact: '',
    emergencyContactName: '',
    emergencyContactRelation: '',
    medicalConditions: '',
  });
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    method: 'card',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
    cardName: '',
    upiId: '',
    bankName: '',
  });
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);
  const [processingPayment, setProcessingPayment] = useState<boolean>(false);
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);

  useEffect(() => {
    const fetchProgramDetails = async () => {
      try {
        setLoading(true);
        
        // If program data was passed via location state, use it
        if (location.state?.program) {
          setProgram(location.state.program);
          setLoading(false);
          return;
        }
        
        // Otherwise fetch from API
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
  }, [id, location.state]);

  const calculateDiscount = (price: number, discount?: { type: string; value: number }) => {
    if (!discount) return price;
    
    if (discount.type === 'percentage') {
      return price - (price * (discount.value / 100));
    } else if (discount.type === 'fixed') {
      return price - discount.value;
    }
    
    return price;
  };

  const handleStudentInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setStudentInfo(prev => ({ ...prev, [name]: value }));
  };

  const handlePaymentInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaymentInfo(prev => ({ ...prev, [name]: value }));
  };

  const handlePaymentMethodChange = (value: 'card' | 'upi' | 'netbanking') => {
    setPaymentInfo(prev => ({ ...prev, method: value }));
  };

  const validateStudentInfo = () => {
    const requiredFields = [
      'firstName', 'lastName', 'email', 'phone', 
      'dateOfBirth', 'address', 'city', 'state', 'pincode',
      'emergencyContact', 'emergencyContactName', 'emergencyContactRelation'
    ];
    
    const missingFields = requiredFields.filter(field => !studentInfo[field as keyof StudentInfo]);
    
    if (missingFields.length > 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return false;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(studentInfo.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return false;
    }
    
    // Validate phone format
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(studentInfo.phone.replace(/[^0-9]/g, ''))) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid 10-digit phone number.",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };

  const validatePaymentInfo = () => {
    if (!termsAccepted) {
      toast({
        title: "Terms & Conditions",
        description: "Please accept the terms and conditions to proceed.",
        variant: "destructive",
      });
      return false;
    }
    
    if (paymentInfo.method === 'card') {
      if (!paymentInfo.cardNumber || !paymentInfo.cardExpiry || !paymentInfo.cardCvv || !paymentInfo.cardName) {
        toast({
          title: "Missing Card Information",
          description: "Please fill in all card details.",
          variant: "destructive",
        });
        return false;
      }
      
      // Basic card validation
      if (paymentInfo.cardNumber.replace(/\s/g, '').length !== 16) {
        toast({
          title: "Invalid Card Number",
          description: "Please enter a valid 16-digit card number.",
          variant: "destructive",
        });
        return false;
      }
    } else if (paymentInfo.method === 'upi') {
      if (!paymentInfo.upiId) {
        toast({
          title: "Missing UPI ID",
          description: "Please enter your UPI ID.",
          variant: "destructive",
        });
        return false;
      }
    } else if (paymentInfo.method === 'netbanking') {
      if (!paymentInfo.bankName) {
        toast({
          title: "Missing Bank Selection",
          description: "Please select your bank.",
          variant: "destructive",
        });
        return false;
      }
    }
    
    return true;
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (validateStudentInfo()) {
        setStep(2);
        window.scrollTo(0, 0);
      }
    }
  };

  const handlePreviousStep = () => {
    if (step === 2) {
      setStep(1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmitPayment = async () => {
    if (!validatePaymentInfo()) return;
    
    try {
      setProcessingPayment(true);
      
      // In a real application, you would call your payment API here
      // For this demo, we'll simulate a payment process
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate successful payment
      setPaymentSuccess(true);
      
      // In a real app, you would process the enrollment after payment
      // const enrollmentResponse = await paymentsApi.processEnrollment({
      //   programId: program?._id,
      //   studentInfo,
      //   paymentInfo: { method: paymentInfo.method },
      // });
      
      // Scroll to top to show success message
      window.scrollTo(0, 0);
      
    } catch (err: any) {
      toast({
        title: "Payment Failed",
        description: err.message || "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessingPayment(false);
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <Skeleton className="h-12 w-3/4 mb-8" />
              <Skeleton className="h-8 w-1/2 mb-4" />
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div>
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
              <div className="mb-6">
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div>
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            </div>
            
            <div>
              <Skeleton className="h-64 w-full mb-4" />
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
            <h2 className="text-2xl font-bold mb-4">Error Loading Checkout</h2>
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
            <p className="mb-6">The program you're trying to enroll in doesn't exist or has been removed.</p>
            <Button onClick={() => navigate('/programs')}>
              View All Programs
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (paymentSuccess) {
    return (
      <div>
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Card className="bg-white shadow-xl">
            <CardContent className="pt-6 px-6 pb-0 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircleIcon className="h-10 w-10 text-green-600" />
              </div>
              
              <h1 className="text-3xl font-bold text-cricket-green mb-4">Payment Successful!</h1>
              <p className="text-lg text-gray-700 mb-6">
                Thank you for enrolling in <span className="font-semibold">{program.title}</span>. 
                Your payment has been processed successfully.
              </p>
              
              <div className="bg-gray-50 p-6 rounded-lg mb-6 inline-block">
                <h2 className="text-xl font-semibold mb-4">Enrollment Details</h2>
                <div className="text-left space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Student Name:</span>
                    <span className="font-medium">{studentInfo.firstName} {studentInfo.lastName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Program:</span>
                    <span className="font-medium">{program.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount Paid:</span>
                    <span className="font-medium">₹{calculateDiscount(program.price, program.discount).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Method:</span>
                    <span className="font-medium">{paymentInfo.method === 'card' ? 'Credit/Debit Card' : paymentInfo.method === 'upi' ? 'UPI' : 'Net Banking'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transaction ID:</span>
                    <span className="font-medium">TXN{Math.random().toString(36).substring(2, 10).toUpperCase()}</span>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-600 mb-8">
                A confirmation email has been sent to <span className="font-medium">{studentInfo.email}</span> with all the details.
              </p>
            </CardContent>
            
            <CardFooter className="flex flex-col sm:flex-row gap-4 justify-center pb-6">
              <Button 
                variant="outline" 
                onClick={() => navigate('/programs')}
              >
                Explore More Programs
              </Button>
              <Button 
                onClick={() => navigate('/')}
              >
                Return to Home
              </Button>
            </CardFooter>
          </Card>
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
          <h1 className="text-3xl font-bold font-poppins heading-gradient mb-8">
            {step === 1 ? 'Student Information' : 'Payment Details'}
          </h1>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="md:col-span-2">
              {step === 1 ? (
                <Card className="bg-white shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-xl text-cricket-green">Student Details</CardTitle>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input 
                          id="firstName" 
                          name="firstName" 
                          value={studentInfo.firstName}
                          onChange={handleStudentInfoChange}
                          placeholder="Enter first name"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input 
                          id="lastName" 
                          name="lastName" 
                          value={studentInfo.lastName}
                          onChange={handleStudentInfoChange}
                          placeholder="Enter last name"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input 
                        id="email" 
                        name="email" 
                        type="email"
                        value={studentInfo.email}
                        onChange={handleStudentInfoChange}
                        placeholder="Enter email address"
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input 
                          id="phone" 
                          name="phone" 
                          value={studentInfo.phone}
                          onChange={handleStudentInfoChange}
                          placeholder="Enter phone number"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                        <Input 
                          id="dateOfBirth" 
                          name="dateOfBirth" 
                          type="date"
                          value={studentInfo.dateOfBirth}
                          onChange={handleStudentInfoChange}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="address">Address *</Label>
                      <Input 
                        id="address" 
                        name="address" 
                        value={studentInfo.address}
                        onChange={handleStudentInfoChange}
                        placeholder="Enter street address"
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City *</Label>
                        <Input 
                          id="city" 
                          name="city" 
                          value={studentInfo.city}
                          onChange={handleStudentInfoChange}
                          placeholder="Enter city"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="state">State *</Label>
                        <Input 
                          id="state" 
                          name="state" 
                          value={studentInfo.state}
                          onChange={handleStudentInfoChange}
                          placeholder="Enter state"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="pincode">PIN Code *</Label>
                        <Input 
                          id="pincode" 
                          name="pincode" 
                          value={studentInfo.pincode}
                          onChange={handleStudentInfoChange}
                          placeholder="Enter PIN code"
                          required
                        />
                      </div>
                    </div>
                    
                    <Separator className="my-4" />
                    
                    <h3 className="text-lg font-semibold text-cricket-green">Emergency Contact Information</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="emergencyContactName">Contact Name *</Label>
                        <Input 
                          id="emergencyContactName" 
                          name="emergencyContactName" 
                          value={studentInfo.emergencyContactName}
                          onChange={handleStudentInfoChange}
                          placeholder="Enter emergency contact name"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="emergencyContactRelation">Relationship *</Label>
                        <Input 
                          id="emergencyContactRelation" 
                          name="emergencyContactRelation" 
                          value={studentInfo.emergencyContactRelation}
                          onChange={handleStudentInfoChange}
                          placeholder="E.g., Parent, Spouse, etc."
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="emergencyContact">Emergency Phone Number *</Label>
                      <Input 
                        id="emergencyContact" 
                        name="emergencyContact" 
                        value={studentInfo.emergencyContact}
                        onChange={handleStudentInfoChange}
                        placeholder="Enter emergency phone number"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="medicalConditions">Medical Conditions (if any)</Label>
                      <Input 
                        id="medicalConditions" 
                        name="medicalConditions" 
                        value={studentInfo.medicalConditions}
                        onChange={handleStudentInfoChange}
                        placeholder="List any medical conditions or allergies"
                      />
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex justify-end">
                    <Button 
                      onClick={handleNextStep}
                      className="bg-cricket-orange hover:bg-cricket-orange/90"
                    >
                      Continue to Payment
                    </Button>
                  </CardFooter>
                </Card>
              ) : (
                <Card className="bg-white shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-xl text-cricket-green">Payment Method</CardTitle>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    <RadioGroup 
                      value={paymentInfo.method} 
                      onValueChange={(value) => handlePaymentMethodChange(value as 'card' | 'upi' | 'netbanking')}
                      className="space-y-4"
                    >
                      <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-gray-50">
                        <RadioGroupItem value="card" id="card" />
                        <Label htmlFor="card" className="flex items-center cursor-pointer">
                          <CreditCardIcon className="h-5 w-5 mr-2 text-cricket-orange" />
                          Credit / Debit Card
                        </Label>
                      </div>
                      
                      <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-gray-50">
                        <RadioGroupItem value="upi" id="upi" />
                        <Label htmlFor="upi" className="flex items-center cursor-pointer">
                          <span className="text-cricket-orange font-bold mr-2">UPI</span>
                          UPI Payment
                        </Label>
                      </div>
                      
                      <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-gray-50">
                        <RadioGroupItem value="netbanking" id="netbanking" />
                        <Label htmlFor="netbanking" className="flex items-center cursor-pointer">
                          <span className="text-cricket-orange font-bold mr-2">₹</span>
                          Net Banking
                        </Label>
                      </div>
                    </RadioGroup>
                    
                    <Separator className="my-4" />
                    
                    {paymentInfo.method === 'card' && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="cardName">Name on Card *</Label>
                          <Input 
                            id="cardName" 
                            name="cardName" 
                            value={paymentInfo.cardName}
                            onChange={handlePaymentInfoChange}
                            placeholder="Enter name as on card"
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="cardNumber">Card Number *</Label>
                          <Input 
                            id="cardNumber" 
                            name="cardNumber" 
                            value={paymentInfo.cardNumber}
                            onChange={handlePaymentInfoChange}
                            placeholder="1234 5678 9012 3456"
                            required
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="cardExpiry">Expiry Date *</Label>
                            <Input 
                              id="cardExpiry" 
                              name="cardExpiry" 
                              value={paymentInfo.cardExpiry}
                              onChange={handlePaymentInfoChange}
                              placeholder="MM/YY"
                              required
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="cardCvv">CVV *</Label>
                            <Input 
                              id="cardCvv" 
                              name="cardCvv" 
                              value={paymentInfo.cardCvv}
                              onChange={handlePaymentInfoChange}
                              placeholder="123"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {paymentInfo.method === 'upi' && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="upiId">UPI ID *</Label>
                          <Input 
                            id="upiId" 
                            name="upiId" 
                            value={paymentInfo.upiId}
                            onChange={handlePaymentInfoChange}
                            placeholder="yourname@upi"
                            required
                          />
                        </div>
                        
                        <div className="bg-yellow-50 p-4 rounded-lg">
                          <div className="flex items-start">
                            <AlertCircleIcon className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
                            <p className="text-sm text-yellow-800">
                              You will receive a payment request on your UPI app. Please complete the payment within 5 minutes.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {paymentInfo.method === 'netbanking' && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="bankName">Select Bank *</Label>
                          <select 
                            id="bankName"
                            name="bankName"
                            value={paymentInfo.bankName}
                            onChange={(e) => setPaymentInfo(prev => ({ ...prev, bankName: e.target.value }))}
                            className="w-full p-2 border rounded-md"
                            required
                          >
                            <option value="">Select your bank</option>
                            <option value="SBI">State Bank of India</option>
                            <option value="HDFC">HDFC Bank</option>
                            <option value="ICICI">ICICI Bank</option>
                            <option value="Axis">Axis Bank</option>
                            <option value="Kotak">Kotak Mahindra Bank</option>
                            <option value="PNB">Punjab National Bank</option>
                          </select>
                        </div>
                        
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <div className="flex items-start">
                            <AlertCircleIcon className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                            <p className="text-sm text-blue-800">
                              You will be redirected to your bank's website to complete the payment.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-start space-x-2 mt-6">
                      <Checkbox 
                        id="terms" 
                        checked={termsAccepted}
                        onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                      />
                      <Label htmlFor="terms" className="text-sm">
                        I agree to the <a href="#" className="text-cricket-orange hover:underline">Terms & Conditions</a> and <a href="#" className="text-cricket-orange hover:underline">Privacy Policy</a>. I understand that this payment is for program enrollment and is subject to the academy's refund policy.
                      </Label>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex justify-between">
                    <Button 
                      variant="outline" 
                      onClick={handlePreviousStep}
                    >
                      Back to Student Info
                    </Button>
                    
                    <Button 
                      onClick={handleSubmitPayment}
                      className="bg-cricket-orange hover:bg-cricket-orange/90"
                      disabled={processingPayment}
                    >
                      {processingPayment ? 'Processing...' : 'Complete Payment'}
                    </Button>
                  </CardFooter>
                </Card>
              )}
            </div>
            
            {/* Order Summary */}
            <div>
              <Card className="bg-white shadow-xl sticky top-24">
                <CardHeader>
                  <CardTitle className="text-xl text-cricket-green">Order Summary</CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3 pb-4 border-b border-gray-100">
                    <div className="w-12 h-12 bg-cricket-orange/20 rounded-full flex items-center justify-center text-cricket-orange text-xl">
                      {program.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold">{program.title}</h3>
                      <p className="text-sm text-gray-600">{program.ageGroup}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Program Fee:</span>
                      <div className="flex items-center">
                        <BadgeIndianRupeeIcon className="h-4 w-4 mr-1 text-cricket-green" />
                        <span className={`font-semibold ${hasDiscount ? 'line-through text-gray-400' : 'text-cricket-green'}`}>
                          {program.price.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    
                    {hasDiscount && (
                      <>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Discount:</span>
                          <span className="text-green-600 font-semibold">
                            {program.discount?.type === 'percentage' 
                              ? `${program.discount.value}%` 
                              : `₹${program.discount?.value.toLocaleString()}`}
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Discounted Price:</span>
                          <div className="flex items-center">
                            <BadgeIndianRupeeIcon className="h-4 w-4 mr-1 text-cricket-orange" />
                            <span className="font-semibold text-cricket-orange">
                              {discountedPrice.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </>
                    )}
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Registration Fee:</span>
                      <div className="flex items-center">
                        <BadgeIndianRupeeIcon className="h-4 w-4 mr-1 text-cricket-green" />
                        <span className="font-semibold text-cricket-green">1,000</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">GST (18%):</span>
                      <div className="flex items-center">
                        <BadgeIndianRupeeIcon className="h-4 w-4 mr-1 text-cricket-green" />
                        <span className="font-semibold text-cricket-green">
                          {Math.round(discountedPrice * 0.18).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between items-center font-bold">
                    <span>Total Amount:</span>
                    <div className="flex items-center">
                      <BadgeIndianRupeeIcon className="h-5 w-5 mr-1 text-cricket-orange" />
                      <span className="text-xl text-cricket-orange">
                        {Math.round(discountedPrice + 1000 + (discountedPrice * 0.18)).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg mt-4">
                    <h4 className="font-semibold mb-2">Program Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Duration:</span>
                        <span>{program.duration}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Age Group:</span>
                        <span>{program.ageGroup}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Checkout;