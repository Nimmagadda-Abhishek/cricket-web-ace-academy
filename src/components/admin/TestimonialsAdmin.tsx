import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { dbService } from '@/lib/api';
import { toast } from '@/hooks/use-toast';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  image_url: string;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

const TestimonialsAdmin = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  
  // Form state
  const [newTestimonial, setNewTestimonial] = useState({
    name: '',
    role: '',
    content: '',
    rating: 5,
    image_url: '',
    is_featured: false,
    file: null as File | null
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await dbService.testimonials.getTestimonials();
      
      if (response && response.data && response.data.testimonials) {
        setTestimonials(response.data.testimonials);
      } else {
        setTestimonials([]);
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      setError('Failed to load testimonials. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewTestimonial(prev => ({ ...prev, [name]: value }));
  };

  const handleRatingChange = (value: string) => {
    setNewTestimonial(prev => ({ ...prev, rating: parseInt(value) }));
  };

  const handleFeaturedChange = (checked: boolean) => {
    setNewTestimonial(prev => ({ ...prev, is_featured: checked }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewTestimonial(prev => ({ ...prev, file: e.target.files![0] }));
    }
  };

  const resetForm = () => {
    setNewTestimonial({
      name: '',
      role: '',
      content: '',
      rating: 5,
      image_url: '',
      is_featured: false,
      file: null
    });
    setEditMode(false);
  };

  const prepareForEdit = (testimonial: Testimonial) => {
    setNewTestimonial({
      name: testimonial.name,
      role: testimonial.role,
      content: testimonial.content,
      rating: testimonial.rating,
      image_url: testimonial.image_url,
      is_featured: testimonial.is_featured,
      file: null
    });
    setSelectedTestimonial(testimonial);
    setEditMode(true);
  };

  const uploadImage = async () => {
    if (!newTestimonial.file) {
      return newTestimonial.image_url; // Return existing URL if no new file
    }

    try {
      setUploadProgress(0);
      
      // Create a FormData object to upload the file
      const formData = new FormData();
      formData.append('file', newTestimonial.file);
      formData.append('folder', 'testimonials');
      
      // Simulate upload progress
      const uploadInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(uploadInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 300);
      
      // Upload the file to your server
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      clearInterval(uploadInterval);
      setUploadProgress(100);
      
      if (!response.ok) {
        throw new Error('Failed to upload image');
      }
      
      const data = await response.json();
      
      // For development/testing, if the upload endpoint is not available,
      // we'll use a placeholder image URL
      if (data && data.url) {
        return data.url;
      } else {
        // Use a placeholder image for testing
        return `https://picsum.photos/seed/${Date.now()}/300/300`;
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      
      // For development/testing, return a placeholder image URL
      return `https://picsum.photos/seed/${Date.now()}/300/300`;
    }
  };

  const saveTestimonial = async () => {
    if (!newTestimonial.name || !newTestimonial.role || !newTestimonial.content) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    if (!newTestimonial.file && !newTestimonial.image_url && !editMode) {
      toast({
        title: "Error",
        description: "Please select an image",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsUploading(true);
      
      // Upload image if there's a new file
      let imageUrl = newTestimonial.image_url;
      if (newTestimonial.file) {
        imageUrl = await uploadImage();
      }
      
      if (editMode && selectedTestimonial) {
        // Update existing testimonial
        const testimonialData = {
          name: newTestimonial.name,
          role: newTestimonial.role,
          content: newTestimonial.content,
          rating: newTestimonial.rating,
          image_url: imageUrl,
          is_featured: newTestimonial.is_featured
        };
        
        await dbService.testimonials.updateTestimonial(selectedTestimonial.id, testimonialData);

        toast({
          title: "Success",
          description: "Testimonial updated successfully",
          variant: "default"
        });
      } else {
        // Create new testimonial
        const testimonialData = {
          name: newTestimonial.name,
          role: newTestimonial.role,
          content: newTestimonial.content,
          rating: newTestimonial.rating,
          image_url: imageUrl,
          is_featured: newTestimonial.is_featured
        };
        
        await dbService.testimonials.createTestimonial(testimonialData);

        toast({
          title: "Success",
          description: "Testimonial created successfully",
          variant: "default"
        });
      }
      
      // Reset form and refresh testimonials
      resetForm();
      fetchTestimonials();
    } catch (error) {
      console.error('Error saving testimonial:', error);
      toast({
        title: "Error",
        description: "Failed to save testimonial. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const toggleFeatured = async (id: string, currentStatus: boolean) => {
    try {
      await dbService.testimonials.updateTestimonial(id, {
        is_featured: !currentStatus
      });

      toast({
        title: "Success",
        description: `Testimonial ${!currentStatus ? 'featured' : 'unfeatured'} successfully`,
        variant: "default"
      });
      
      fetchTestimonials();
    } catch (error) {
      console.error('Error toggling featured status:', error);
      toast({
        title: "Error",
        description: "Failed to update testimonial. Please try again.",
        variant: "destructive"
      });
    }
  };

  const deleteTestimonial = async (id: string) => {
    try {
      // Delete the testimonial
      await dbService.testimonials.deleteTestimonial(id);

      toast({
        title: "Success",
        description: "Testimonial deleted successfully",
        variant: "default"
      });
      
      // Update the local state to remove the deleted testimonial
      setTestimonials(testimonials.filter(t => t.id !== id));
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      toast({
        title: "Error",
        description: "Failed to delete testimonial. Please try again.",
        variant: "destructive"
      });
    }
  };

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, index) => (
      <span key={index} className={index < rating ? 'text-yellow-400' : 'text-gray-300'}>★</span>
    ));
  };

  const filteredTestimonials = showFeaturedOnly 
    ? testimonials.filter(t => t.is_featured)
    : testimonials;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Testimonials Management</span>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Switch 
                  checked={showFeaturedOnly} 
                  onCheckedChange={setShowFeaturedOnly} 
                  id="featured-filter"
                />
                <Label htmlFor="featured-filter">Featured Only</Label>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-cricket-orange hover:bg-cricket-orange/90">
                    Add New Testimonial
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>{editMode ? 'Edit Testimonial' : 'Add New Testimonial'}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name*</Label>
                        <Input 
                          id="name" 
                          name="name" 
                          value={newTestimonial.name} 
                          onChange={handleInputChange} 
                          placeholder="Enter name" 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="role">Role/Position*</Label>
                        <Input 
                          id="role" 
                          name="role" 
                          value={newTestimonial.role} 
                          onChange={handleInputChange} 
                          placeholder="e.g. Student, Parent, Coach" 
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="content">Testimonial Content*</Label>
                      <Textarea 
                        id="content" 
                        name="content" 
                        value={newTestimonial.content} 
                        onChange={handleInputChange} 
                        placeholder="Enter testimonial content" 
                        rows={4}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="rating">Rating</Label>
                        <div className="flex items-center space-x-2">
                          <Input 
                            id="rating" 
                            type="range" 
                            min="1" 
                            max="5" 
                            value={newTestimonial.rating} 
                            onChange={(e) => handleRatingChange(e.target.value)} 
                            className="w-full"
                          />
                          <span className="text-yellow-400 text-lg">
                            {renderStars(newTestimonial.rating)}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="featured" className="block mb-2">Featured</Label>
                        <div className="flex items-center space-x-2">
                          <Switch 
                            id="featured" 
                            checked={newTestimonial.is_featured} 
                            onCheckedChange={handleFeaturedChange} 
                          />
                          <Label htmlFor="featured">
                            {newTestimonial.is_featured ? 'Yes' : 'No'}
                          </Label>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="image">Profile Image*</Label>
                      {editMode && newTestimonial.image_url && (
                        <div className="mb-2">
                          <img 
                            src={newTestimonial.image_url} 
                            alt="Current profile" 
                            className="h-20 w-20 object-cover rounded-full"
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
                      {newTestimonial.file && (
                        <p className="text-sm text-gray-500">
                          Selected: {newTestimonial.file.name} ({Math.round(newTestimonial.file.size / 1024)} KB)
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
                      onClick={saveTestimonial} 
                      disabled={isUploading}
                      className="bg-cricket-green hover:bg-cricket-green/90"
                    >
                      {isUploading ? 'Saving...' : editMode ? 'Update Testimonial' : 'Add Testimonial'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin text-4xl">⏳</div>
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-500">
              <p>{error}</p>
              <Button 
                onClick={fetchTestimonials} 
                variant="outline" 
                className="mt-4"
              >
                Try Again
              </Button>
            </div>
          ) : filteredTestimonials.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <div className="text-5xl mb-4">⭐</div>
              <p>No testimonials found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTestimonials.map((testimonial) => (
                <Card 
                  key={testimonial.id} 
                  className={`overflow-hidden hover:shadow-lg transition-shadow duration-300 ${
                    testimonial.is_featured ? 'border-2 border-cricket-orange' : ''
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-16 h-16 rounded-full overflow-hidden mr-4 border-2 border-cricket-green">
                        <img
                          src={testimonial.image_url}
                          alt={testimonial.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{testimonial.name}</h3>
                        <p className="text-sm text-gray-600">{testimonial.role}</p>
                        <div className="text-yellow-400 text-sm mt-1">
                          {renderStars(testimonial.rating)}
                        </div>
                      </div>
                    </div>
                    <div className="mb-4">
                      <p className="text-gray-700 italic line-clamp-4">
                        "{testimonial.content}"
                      </p>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedTestimonial(testimonial)}
                        >
                          View
                        </Button>
                        <Button 
                          variant="default" 
                          size="sm"
                          className="bg-cricket-green hover:bg-cricket-green/90"
                          onClick={() => prepareForEdit(testimonial)}
                        >
                          Edit
                        </Button>
                      </div>
                      <div className="flex items-center space-x-2">
                        {testimonial.is_featured && (
                          <Badge className="bg-cricket-orange">Featured</Badge>
                        )}
                        <Switch 
                          checked={testimonial.is_featured} 
                          onCheckedChange={() => toggleFeatured(testimonial.id, testimonial.is_featured)} 
                          aria-label="Toggle featured"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Testimonial Details Dialog */}
      {selectedTestimonial && !editMode && (
        <Dialog open={!!selectedTestimonial && !editMode} onOpenChange={(open) => !open && setSelectedTestimonial(null)}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>Testimonial Details</span>
                {selectedTestimonial.is_featured && (
                  <Badge className="bg-cricket-orange">Featured</Badge>
                )}
              </DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <div className="flex items-center mb-6">
                <div className="w-20 h-20 rounded-full overflow-hidden mr-6 border-2 border-cricket-green">
                  <img 
                    src={selectedTestimonial.image_url} 
                    alt={selectedTestimonial.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{selectedTestimonial.name}</h3>
                  <p className="text-gray-600">{selectedTestimonial.role}</p>
                  <div className="text-yellow-400 text-lg mt-1">
                    {renderStars(selectedTestimonial.rating)}
                  </div>
                </div>
              </div>
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Testimonial</h3>
                <div className="bg-gray-50 p-4 rounded-md italic">
                  "{selectedTestimonial.content}"
                </div>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <div>Created: {new Date(selectedTestimonial.created_at).toLocaleDateString()}</div>
                <div>Last Updated: {new Date(selectedTestimonial.updated_at).toLocaleDateString()}</div>
              </div>
            </div>
            <DialogFooter>
              <div className="flex justify-between w-full">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">Delete</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the testimonial.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => {
                          deleteTestimonial(selectedTestimonial.id);
                          setSelectedTestimonial(null);
                        }}
                        className="bg-red-500 hover:bg-red-600"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <div className="space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={() => toggleFeatured(selectedTestimonial.id, selectedTestimonial.is_featured)}
                  >
                    {selectedTestimonial.is_featured ? 'Unfeature' : 'Feature'}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => prepareForEdit(selectedTestimonial)}
                  >
                    Edit
                  </Button>
                  <Button 
                    variant="default"
                    onClick={() => setSelectedTestimonial(null)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default TestimonialsAdmin;