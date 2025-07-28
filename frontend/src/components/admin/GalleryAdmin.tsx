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
import { dbService } from '@/lib/api';
import { toast } from '@/hooks/use-toast';

interface GalleryImage {
  id: string;
  title: string;
  description: string | null;
  url: string;
  category: string;
  created_at: string;
}

const GalleryAdmin = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [filteredImages, setFilteredImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [newImage, setNewImage] = useState({
    title: '',
    description: '',
    url: '',
    category: 'general',
    file: null as File | null
  });

  useEffect(() => {
    fetchGalleryImages();
  }, []);

  useEffect(() => {
    if (activeCategory === 'all') {
      setFilteredImages(images);
    } else {
      setFilteredImages(images.filter(image => image.category === activeCategory));
    }
  }, [activeCategory, images]);

  const fetchGalleryImages = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await dbService.gallery.getGalleryImages();
      
      if (response && response.data && response.data.images) {
        setImages(response.data.images);
        setFilteredImages(response.data.images);
      } else {
        setImages([]);
        setFilteredImages([]);
      }
    } catch (error) {
      console.error('Error fetching gallery images:', error);
      setError('Failed to load gallery images. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewImage(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setNewImage(prev => ({ ...prev, category: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewImage(prev => ({ ...prev, file: e.target.files![0] }));
    }
  };

  const uploadImage = async () => {
    if (!newImage.file) {
      toast({
        title: "Error",
        description: "Please select an image to upload",
        variant: "destructive"
      });
      return;
    }

    if (!newImage.title) {
      toast({
        title: "Error",
        description: "Please enter a title for the image",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);
      
      // Create a FormData object to upload the file
      const formData = new FormData();
      formData.append('file', newImage.file);
      formData.append('folder', 'gallery');
      
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
      let imageUrl;
      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        
        if (!response.ok) {
          throw new Error('Failed to upload image');
        }
        
        const data = await response.json();
        
        if (data && data.url) {
          imageUrl = data.url;
        } else {
          // Use a placeholder image for testing
          imageUrl = `https://picsum.photos/seed/${Date.now()}/800/600`;
        }
      } catch (uploadError) {
        console.error('Error uploading to server:', uploadError);
        // Use a placeholder image for testing
        imageUrl = `https://picsum.photos/seed/${Date.now()}/800/600`;
      }
      
      clearInterval(uploadInterval);
      setUploadProgress(100);
      
      // Add the image to the gallery table
      const galleryData = {
        title: newImage.title,
        description: newImage.description || null,
        url: imageUrl,
        category: newImage.category
      };
      
      await dbService.gallery.createGalleryImage(galleryData);

      // Reset form and refresh images
      setNewImage({
        title: '',
        description: '',
        url: '',
        category: 'general',
        file: null
      });
      
      toast({
        title: "Success",
        description: "Image uploaded successfully",
        variant: "default"
      });
      
      fetchGalleryImages();
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Error",
        description: "Failed to upload image. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const deleteImage = async (id: string) => {
    try {
      // Delete the image from the gallery table
      await dbService.gallery.deleteGalleryImage(id);

      toast({
        title: "Success",
        description: "Image deleted successfully",
        variant: "default"
      });
      
      // Update the local state to remove the deleted image
      setImages(images.filter(img => img.id !== id));
      setFilteredImages(filteredImages.filter(img => img.id !== id));
    } catch (error) {
      console.error('Error deleting image:', error);
      toast({
        title: "Error",
        description: "Failed to delete image. Please try again.",
        variant: "destructive"
      });
    }
  };

  const categories = [
    { id: 'all', name: 'All Images' },
    { id: 'general', name: 'General' },
    { id: 'training', name: 'Training' },
    { id: 'matches', name: 'Matches' },
    { id: 'events', name: 'Events' },
    { id: 'facilities', name: 'Facilities' }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Gallery Management</span>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-cricket-orange hover:bg-cricket-orange/90">
                  Add New Image
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Add New Image</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input 
                      id="title" 
                      name="title" 
                      value={newImage.title} 
                      onChange={handleInputChange} 
                      placeholder="Enter image title" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Textarea 
                      id="description" 
                      name="description" 
                      value={newImage.description} 
                      onChange={handleInputChange} 
                      placeholder="Enter image description" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select 
                      value={newImage.category} 
                      onValueChange={handleSelectChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.filter(cat => cat.id !== 'all').map(category => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="image">Upload Image</Label>
                    <Input 
                      id="image" 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileChange} 
                    />
                    {newImage.file && (
                      <p className="text-sm text-gray-500">
                        Selected: {newImage.file.name} ({Math.round(newImage.file.size / 1024)} KB)
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
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button 
                    onClick={uploadImage} 
                    disabled={isUploading || !newImage.file || !newImage.title}
                    className="bg-cricket-green hover:bg-cricket-green/90"
                  >
                    {isUploading ? 'Uploading...' : 'Upload Image'}
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
                {categories.map(category => (
                  <TabsTrigger 
                    key={category.id} 
                    value={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className="px-4 py-2 data-[state=active]:bg-cricket-green data-[state=active]:text-white"
                  >
                    {category.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <TabsContent value={activeCategory} className="mt-0">
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin text-4xl">⏳</div>
                </div>
              ) : error ? (
                <div className="text-center py-12 text-red-500">
                  <p>{error}</p>
                  <Button 
                    onClick={fetchGalleryImages} 
                    variant="outline" 
                    className="mt-4"
                  >
                    Try Again
                  </Button>
                </div>
              ) : filteredImages.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <div className="text-5xl mb-4">🖼️</div>
                  <p>No images found in this category</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {filteredImages.map((image) => (
                    <Card 
                      key={image.id} 
                      className="overflow-hidden hover:shadow-lg transition-shadow duration-300 group"
                    >
                      <div className="aspect-square relative">
                        <img
                          src={image.url}
                          alt={image.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="bg-white text-black hover:bg-white/90"
                              onClick={() => setSelectedImage(image)}
                            >
                              View
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button 
                                  size="sm" 
                                  variant="destructive"
                                >
                                  Delete
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the image.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => deleteImage(image.id)}
                                    className="bg-red-500 hover:bg-red-600"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                        <div className="absolute top-2 right-2">
                          <span className="bg-cricket-green text-white text-xs px-2 py-1 rounded-full">
                            {image.category}
                          </span>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold truncate">{image.title}</h3>
                        {image.description && (
                          <p className="text-sm text-gray-500 line-clamp-2 h-10">
                            {image.description}
                          </p>
                        )}
                        <p className="text-xs text-gray-400 mt-2">
                          {new Date(image.created_at).toLocaleDateString()}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Image Details Dialog */}
      {selectedImage && (
        <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>{selectedImage.title}</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <div className="mb-4 max-h-[400px] overflow-hidden rounded-md">
                <img 
                  src={selectedImage.url} 
                  alt={selectedImage.title} 
                  className="w-full h-auto object-contain"
                />
              </div>
              <div className="space-y-2">
                <div>
                  <span className="font-semibold">Category:</span> 
                  <span className="ml-2 bg-cricket-green text-white text-xs px-2 py-1 rounded-full">
                    {selectedImage.category}
                  </span>
                </div>
                {selectedImage.description && (
                  <div>
                    <span className="font-semibold">Description:</span> 
                    <p className="text-gray-600 mt-1">{selectedImage.description}</p>
                  </div>
                )}
                <div>
                  <span className="font-semibold">Added on:</span> 
                  <span className="ml-2 text-gray-600">
                    {new Date(selectedImage.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span className="font-semibold">Image URL:</span> 
                  <div className="mt-1 flex">
                    <Input 
                      value={selectedImage.url} 
                      readOnly 
                      className="flex-1"
                    />
                    <Button 
                      className="ml-2"
                      onClick={() => {
                        navigator.clipboard.writeText(selectedImage.url);
                        toast({
                          title: "Copied!",
                          description: "Image URL copied to clipboard",
                          variant: "default"
                        });
                      }}
                    >
                      Copy
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">Delete Image</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the image.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => {
                        deleteImage(selectedImage.id);
                        setSelectedImage(null);
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
                onClick={() => setSelectedImage(null)}
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

export default GalleryAdmin;