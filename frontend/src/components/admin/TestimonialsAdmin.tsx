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
import { toast } from '@/hooks/use-toast';
import { testimonialsData, Testimonial } from '@/data/testimonials';

const TestimonialsAdmin = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  
  // Form state
  const [newTestimonial, setNewTestimonial] = useState({
    name: '',
    content: '',
    rating: 5,
    is_featured: false
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load testimonials from local data
      setTestimonials(testimonialsData);
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



  const resetForm = () => {
    setNewTestimonial({
      name: '',
      content: '',
      rating: 5,
      is_featured: false
    });
    setEditMode(false);
  };

  const prepareForEdit = (testimonial: Testimonial) => {
    setNewTestimonial({
      name: testimonial.name,
      content: testimonial.content,
      rating: testimonial.rating,
      is_featured: testimonial.is_featured
    });
    setSelectedTestimonial(testimonial);
    setEditMode(true);
  };



  const saveTestimonial = async () => {
    if (!newTestimonial.name || !newTestimonial.content) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      if (editMode && selectedTestimonial) {
        // Update existing testimonial in local state
        const updatedTestimonials = testimonials.map(testimonial =>
          testimonial.id === selectedTestimonial.id
            ? {
                ...testimonial,
                name: newTestimonial.name,
                content: newTestimonial.content,
                rating: newTestimonial.rating,
                is_featured: newTestimonial.is_featured,
                updated_at: new Date().toISOString()
              }
            : testimonial
        );
        setTestimonials(updatedTestimonials);

        toast({
          title: "Success",
          description: "Testimonial updated successfully",
          variant: "default"
        });
      } else {
        // Create new testimonial in local state
        const newTestimonialData: Testimonial = {
          id: (testimonials.length + 1).toString(),
          name: newTestimonial.name,
          content: newTestimonial.content,
          rating: newTestimonial.rating,
          is_featured: newTestimonial.is_featured,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        setTestimonials([...testimonials, newTestimonialData]);

        toast({
          title: "Success",
          description: "Testimonial created successfully",
          variant: "default"
        });
      }

      // Reset form
      resetForm();
    } catch (error) {
      console.error('Error saving testimonial:', error);
      toast({
        title: "Error",
        description: "Failed to save testimonial. Please try again.",
        variant: "destructive"
      });
    }
  };

  const toggleFeatured = async (id: string, currentStatus: boolean) => {
    try {
      // Update testimonial in local state
      const updatedTestimonials = testimonials.map(testimonial =>
        testimonial.id === id
          ? {
              ...testimonial,
              is_featured: !currentStatus,
              updated_at: new Date().toISOString()
            }
          : testimonial
      );
      setTestimonials(updatedTestimonials);

      toast({
        title: "Success",
        description: `Testimonial ${!currentStatus ? 'featured' : 'unfeatured'} successfully`,
        variant: "default"
      });
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
      // Delete the testimonial from local state
      setTestimonials(testimonials.filter(t => t.id !== id));

      toast({
        title: "Success",
        description: "Testimonial deleted successfully",
        variant: "default"
      });
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

                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline" onClick={resetForm}>Cancel</Button>
                    </DialogClose>
                    <Button
                      onClick={saveTestimonial}
                      className="bg-cricket-green hover:bg-cricket-green/90"
                    >
                      {editMode ? 'Update Testimonial' : 'Add Testimonial'}
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
                    <div className="mb-4">
                      <h3 className="font-semibold text-lg">{testimonial.name}</h3>
                      <div className="text-yellow-400 text-sm mt-1">
                        {renderStars(testimonial.rating)}
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
              <div className="mb-6">
                <h3 className="text-xl font-semibold">{selectedTestimonial.name}</h3>
                <div className="text-yellow-400 text-lg mt-1">
                  {renderStars(selectedTestimonial.rating)}
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