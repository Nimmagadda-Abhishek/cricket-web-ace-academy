import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { facilities as initialFacilities, Facility } from '@/data/facilities';

const FacilitiesAdmin = () => {
  const [facilities, setFacilities] = useState<Facility[]>(initialFacilities);
  const [filteredFacilities, setFilteredFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeStatus, setActiveStatus] = useState('all');
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  
  // Form state
  const [newFacility, setNewFacility] = useState({
    name: '',
    description: '',
    image_url: '',
    features: [''],
    status: 'available' as 'available' | 'maintenance' | 'upcoming',
    file: null as File | null
  });

  useEffect(() => {
    fetchFacilities();
  }, []);

  useEffect(() => {
    if (activeStatus === 'all') {
      setFilteredFacilities(facilities);
    } else {
      setFilteredFacilities(facilities.filter(facility => facility.status === activeStatus));
    }
  }, [activeStatus, facilities]);

  const fetchFacilities = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setFacilities(initialFacilities);
      setFilteredFacilities(initialFacilities);

    } catch (error) {
      console.error('Error fetching facilities:', error);
      setError('Failed to load facilities. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewFacility(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setNewFacility(prev => ({ ...prev, status: value as 'available' | 'maintenance' | 'upcoming' }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewFacility(prev => ({ ...prev, file: e.target.files![0] }));
    }
  };

  const handleFeatureChange = (index: number, value: string) => {
    const updatedFeatures = [...newFacility.features];
    updatedFeatures[index] = value;
    setNewFacility(prev => ({ ...prev, features: updatedFeatures }));
  };

  const addFeatureField = () => {
    setNewFacility(prev => ({ ...prev, features: [...prev.features, ''] }));
  };

  const removeFeatureField = (index: number) => {
    const updatedFeatures = [...newFacility.features];
    updatedFeatures.splice(index, 1);
    setNewFacility(prev => ({ ...prev, features: updatedFeatures }));
  };

  const resetForm = () => {
    setNewFacility({
      name: '',
      description: '',
      image_url: '',
      features: [''],
      status: 'available',
      file: null
    });
    setEditMode(false);
  };

  const prepareForEdit = (facility: Facility) => {
    setNewFacility({
      name: facility.name,
      description: facility.description,
      image_url: facility.image_url,
      features: facility.features,
      status: facility.status,
      file: null
    });
    setSelectedFacility(facility);
    setEditMode(true);
  };

  const uploadImage = async () => {
    if (!newFacility.file) {
      return newFacility.image_url; // Return existing URL if no new file
    }

    return new Promise<string>((resolve) => {
        setUploadProgress(0);
        const uploadInterval = setInterval(() => {
            setUploadProgress(prev => {
                if (prev >= 100) {
                    clearInterval(uploadInterval);
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        resolve(reader.result as string);
                    };
                    reader.readAsDataURL(newFacility.file as Blob);
                    return 100;
                }
                return prev + 10;
            });
        }, 100);
    });
  };

  const saveFacility = async () => {
    if (!newFacility.name || !newFacility.description) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    if (!newFacility.file && !newFacility.image_url && !editMode) {
      toast({
        title: "Error",
        description: "Please select an image",
        variant: "destructive"
      });
      return;
    }

    const filteredFeatures = newFacility.features.filter(feature => feature.trim() !== '');
    if (filteredFeatures.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one feature",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsUploading(true);
      
      let imageUrl = newFacility.image_url;
      if (newFacility.file) {
        imageUrl = await uploadImage();
      }
      
      if (editMode && selectedFacility) {
        const updatedFacility = {
          ...selectedFacility,
          name: newFacility.name,
          description: newFacility.description,
          image_url: imageUrl,
          features: filteredFeatures,
          status: newFacility.status,
          updated_at: new Date().toISOString()
        };
        
        setFacilities(facilities.map(f => f.id === selectedFacility.id ? updatedFacility : f));

        toast({
          title: "Success",
          description: "Facility updated successfully",
          variant: "default"
        });
      } else {
        const newFacilityData: Facility = {
          id: `${Date.now()}`,
          name: newFacility.name,
          description: newFacility.description,
          image_url: imageUrl,
          features: filteredFeatures,
          status: newFacility.status,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        setFacilities([newFacilityData, ...facilities]);

        toast({
          title: "Success",
          description: "Facility created successfully",
          variant: "default"
        });
      }
      
      resetForm();
      // No need to call fetchFacilities, as we are updating state directly
    } catch (error) {
      console.error('Error saving facility:', error);
      toast({
        title: "Error",
        description: "Failed to save facility. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const deleteFacility = async (id: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      setFacilities(facilities.filter(f => f.id !== id));
      
      toast({
        title: "Success",
        description: "Facility deleted successfully",
        variant: "default"
      });
      
    } catch (error) {
      console.error('Error deleting facility:', error);
      toast({
        title: "Error",
        description: "Failed to delete facility. Please try again.",
        variant: "destructive"
      });
    }
  };

  const statusFilters = [
    { id: 'all', name: 'All Facilities' },
    { id: 'available', name: 'Available' },
    { id: 'maintenance', name: 'Under Maintenance' },
    { id: 'upcoming', name: 'Upcoming' }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge className="bg-green-500">Available</Badge>;
      case 'maintenance':
        return <Badge className="bg-amber-500">Under Maintenance</Badge>;
      case 'upcoming':
        return <Badge className="bg-blue-500">Coming Soon</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Facilities Management</span>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-cricket-orange hover:bg-cricket-orange/90">
                  Add New Facility
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>{editMode ? 'Edit Facility' : 'Add New Facility'}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Facility Name*</Label>
                    <Input 
                      id="name" 
                      name="name" 
                      value={newFacility.name} 
                      onChange={handleInputChange} 
                      placeholder="Enter facility name" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description*</Label>
                    <Textarea 
                      id="description" 
                      name="description" 
                      value={newFacility.description} 
                      onChange={handleInputChange} 
                      placeholder="Enter facility description" 
                      rows={4}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select 
                      value={newFacility.status} 
                      onValueChange={handleSelectChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="available">Available</SelectItem>
                        <SelectItem value="maintenance">Under Maintenance</SelectItem>
                        <SelectItem value="upcoming">Coming Soon</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Features*</Label>
                    {newFacility.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2 mb-2">
                        <Input 
                          value={feature} 
                          onChange={(e) => handleFeatureChange(index, e.target.value)} 
                          placeholder={`Feature ${index + 1}`} 
                        />
                        {newFacility.features.length > 1 && (
                          <Button 
                            type="button" 
                            variant="destructive" 
                            size="sm"
                            onClick={() => removeFeatureField(index)}
                          >
                            ✕
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={addFeatureField}
                    >
                      + Add Feature
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="image">Facility Image*</Label>
                    {editMode && newFacility.image_url && (
                      <div className="mb-2">
                        <img 
                          src={newFacility.image_url} 
                          alt="Current facility image" 
                          className="h-32 object-cover rounded-md"
                        />
                        <p className="text-xs text-gray-500 mt-1">Current image</p>
                      </div>
                    )}
                    <Input 
                      id="image" 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileChange} 
                    />
                    {newFacility.file && (
                      <p className="text-sm text-gray-500">
                        Selected: {newFacility.file.name} ({Math.round(newFacility.file.size / 1024)} KB)
                      </p>
                    )}
                  </div>
                  {isUploading && (
                    <div className="space-y-2">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-cricket-green h-2.5 rounded-full" 
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-center">{uploadProgress}% Uploaded</p>
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline" onClick={resetForm}>Cancel</Button>
                  </DialogClose>
                  <Button 
                    onClick={saveFacility} 
                    disabled={isUploading}
                    className="bg-cricket-green hover:bg-cricket-green/90"
                  >
                    {isUploading ? 'Saving...' : editMode ? 'Update Facility' : 'Add Facility'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <div className="flex justify-start mb-6 overflow-x-auto pb-2">
              <TabsList className="bg-white shadow-md">
                {statusFilters.map(filter => (
                  <TabsTrigger 
                    key={filter.id} 
                    value={filter.id}
                    onClick={() => setActiveStatus(filter.id)}
                    className="px-4 py-2 data-[state=active]:bg-cricket-green data-[state=active]:text-white"
                  >
                    {filter.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <TabsContent value={activeStatus} className="mt-0">
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin text-4xl">⏳</div>
                </div>
              ) : error ? (
                <div className="text-center py-12 text-red-500">
                  <p>{error}</p>
                  <Button 
                    onClick={fetchFacilities} 
                    variant="outline" 
                    className="mt-4"
                  >
                    Try Again
                  </Button>
                </div>
              ) : filteredFacilities.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <div className="text-5xl mb-4">🏢</div>
                  <p>No facilities found in this category</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredFacilities.map((facility) => (
                    <Card 
                      key={facility.id} 
                      className="overflow-hidden hover:shadow-lg transition-shadow duration-300"
                    >
                      <div className="h-48 relative">
                        <img
                          src={facility.image_url}
                          alt={facility.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-70"></div>
                        <div className="absolute top-4 right-4">
                          {getStatusBadge(facility.status)}
                        </div>
                        <div className="absolute bottom-4 left-4 right-4">
                          <h3 className="text-xl font-bold text-white mb-1">{facility.name}</h3>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <div className="mb-4">
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {facility.description}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium text-cricket-green">Features:</h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {facility.features.slice(0, 3).map((feature, index) => (
                              <li key={index} className="flex items-start">
                                <span className="text-cricket-green mr-2">✓</span>
                                <span>{feature}</span>
                              </li>
                            ))}
                            {facility.features.length > 3 && (
                              <li className="text-cricket-green text-sm font-medium">
                                +{facility.features.length - 3} more features
                              </li>
                            )}
                          </ul>
                        </div>
                        <div className="flex justify-between mt-4">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedFacility(facility)}
                          >
                            View Details
                          </Button>
                          <Button 
                            variant="default" 
                            size="sm"
                            className="bg-cricket-green hover:bg-cricket-green/90"
                            onClick={() => prepareForEdit(facility)}
                          >
                            Edit
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Facility Details Dialog */}
      {selectedFacility && !editMode && (
        <Dialog open={!!selectedFacility && !editMode} onOpenChange={(open) => !open && setSelectedFacility(null)}>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>{selectedFacility.name}</span>
                {getStatusBadge(selectedFacility.status)}
              </DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <div className="mb-6 h-64 overflow-hidden rounded-md">
                <img 
                  src={selectedFacility.image_url} 
                  alt={selectedFacility.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Description</h3>
                  <p className="text-gray-600">{selectedFacility.description}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Features</h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {selectedFacility.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-cricket-orange mr-2 text-lg">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <div>Created: {new Date(selectedFacility.created_at).toLocaleDateString()}</div>
                  <div>Last Updated: {new Date(selectedFacility.updated_at).toLocaleDateString()}</div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">Delete Facility</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the facility.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => {
                        deleteFacility(selectedFacility.id);
                        setSelectedFacility(null);
                      }}
                      className="bg-red-500 hover:bg-red-600"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <Button 
                variant="outline" 
                onClick={() => prepareForEdit(selectedFacility)}
              >
                Edit
              </Button>
              <Button 
                variant="default"
                onClick={() => setSelectedFacility(null)}
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default FacilitiesAdmin;
