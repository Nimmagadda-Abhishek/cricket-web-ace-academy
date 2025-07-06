import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';
import { ImageUpload } from '@/components/ui/image-upload';

// Define the Achievement type
interface Achievement {
  id: number;
  title: string;
  description: string;
  achievement_date: string;
  icon: string;
  color: string;
  image_url: string;
  category: string;
  display_order: number;
  status: 'active' | 'inactive';
}

// Default empty achievement for the form
const emptyAchievement: Omit<Achievement, 'id'> = {
  title: '',
  description: '',
  achievement_date: new Date().toISOString().split('T')[0],
  icon: '🏆',
  color: 'from-cricket-green to-cricket-green/80',
  image_url: '',
  category: 'Team',
  display_order: 0,
  status: 'active'
};

const AchievementsManagement: React.FC = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Omit<Achievement, 'id'>>(emptyAchievement);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  // Icon options
  const iconOptions = ['🏆', '🏏', '👦', '🎓', '🥇', '🏅', '🎯', '🏢', '⭐', '🔥'];
  
  // Color options
  const colorOptions = [
    { value: 'from-cricket-green to-cricket-green/80', label: 'Green' },
    { value: 'from-cricket-orange to-cricket-orange/80', label: 'Orange' },
    { value: 'from-blue-500 to-blue-600', label: 'Blue' },
    { value: 'from-purple-600 to-purple-700', label: 'Purple' },
    { value: 'from-red-500 to-red-600', label: 'Red' },
    { value: 'from-yellow-500 to-yellow-600', label: 'Yellow' },
    { value: 'from-indigo-500 to-indigo-600', label: 'Indigo' },
    { value: 'from-pink-500 to-pink-600', label: 'Pink' }
  ];

  // Category options
  const categoryOptions = ['Team', 'Professional', 'Youth', 'Academy', 'Tournament', 'Individual', 'Other'];

  // Fetch achievements on component mount
  useEffect(() => {
    fetchAchievements();
  }, []);

  // Fetch achievements from the API
  const fetchAchievements = async () => {
    setIsLoading(true);
    try {
      // Call the API to get achievements
      const response = await api.achievements.getAll();
      
      if (response.status === 'success' && response.data?.achievements) {
        setAchievements(response.data.achievements);
      } else {
        // If API call fails, use mock data
        const mockAchievements: Achievement[] = [
          {
            id: 1,
            title: 'State Team Selection',
            description: '5 of our students were selected for the state cricket team in 2023, showcasing our academy\'s excellence in training.',
            achievement_date: '2023-06-15',
            icon: '🏆',
            color: 'from-cricket-green to-cricket-green/80',
            image_url: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            category: 'Team',
            display_order: 1,
            status: 'active'
          },
          {
            id: 2,
            title: 'IPL Selection',
            description: 'Two of our academy graduates were picked in the IPL auction, marking a significant milestone in their professional careers.',
            achievement_date: '2022-12-20',
            icon: '🏏',
            color: 'from-cricket-orange to-cricket-orange/80',
            image_url: 'https://images.unsplash.com/photo-1624880357913-a8539238245b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            category: 'Professional',
            display_order: 2,
            status: 'active'
          },
          {
            id: 3,
            title: 'Under-18 National Team',
            description: 'Three students selected for the Under-18 National Cricket Team, representing our academy at the highest youth level.',
            achievement_date: '2023-08-10',
            icon: '👦',
            color: 'from-blue-500 to-blue-600',
            image_url: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            category: 'Youth',
            display_order: 3,
            status: 'active'
          },
          {
            id: 4,
            title: 'Best Cricket Academy',
            description: 'Awarded as the Best Cricket Academy in the region for 2023, recognizing our commitment to excellence in cricket training.',
            achievement_date: '2023-01-15',
            icon: '🎓',
            color: 'from-purple-600 to-purple-700',
            image_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            category: 'Academy',
            display_order: 4,
            status: 'active'
          }
        ];
        
        setAchievements(mockAchievements);
        
        toast({
          title: 'Using Mock Data',
          description: 'Could not connect to the database. Using mock data instead.',
          variant: 'default',
        });
      }
    } catch (error) {
      console.error('Error fetching achievements:', error);
      
      // Use mock data if API call fails
      const mockAchievements: Achievement[] = [
        {
          id: 1,
          title: 'State Team Selection (Mock)',
          description: 'This is mock data because the API call failed.',
          achievement_date: '2023-06-15',
          icon: '🏆',
          color: 'from-cricket-green to-cricket-green/80',
          image_url: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          category: 'Team',
          display_order: 1,
          status: 'active'
        },
        {
          id: 2,
          title: 'IPL Selection (Mock)',
          description: 'This is mock data because the API call failed.',
          achievement_date: '2022-12-20',
          icon: '🏏',
          color: 'from-cricket-orange to-cricket-orange/80',
          image_url: 'https://images.unsplash.com/photo-1624880357913-a8539238245b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          category: 'Professional',
          display_order: 2,
          status: 'active'
        }
      ];
      
      setAchievements(mockAchievements);
      
      toast({
        title: 'Error',
        description: 'Failed to fetch achievements. Using mock data instead.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (isEditMode && currentId) {
        // Update existing achievement
        try {
          const response = await api.achievements.update(currentId.toString(), formData);
          
          if (response.status === 'success' && response.data?.achievement) {
            // Update the local state with the response from the API
            setAchievements(prev => 
              prev.map(item => item.id === currentId ? response.data.achievement : item)
            );
            
            toast({
              title: 'Success',
              description: 'Achievement updated successfully!',
            });
          } else {
            // If API call fails, update the local state
            setAchievements(prev => 
              prev.map(item => item.id === currentId ? { ...formData, id: currentId } : item)
            );
            
            toast({
              title: 'Success',
              description: 'Achievement updated successfully (local only)!',
            });
          }
        } catch (apiError) {
          console.error('API error updating achievement:', apiError);
          
          // Update the local state if API call fails
          setAchievements(prev => 
            prev.map(item => item.id === currentId ? { ...formData, id: currentId } : item)
          );
          
          toast({
            title: 'Warning',
            description: 'Achievement updated locally. Database update failed.',
            variant: 'default',
          });
        }
      } else {
        // Create new achievement
        try {
          const response = await api.achievements.create(formData);
          
          if (response.status === 'success' && response.data?.achievement) {
            // Add the new achievement from the API response
            setAchievements(prev => [...prev, response.data.achievement]);
            
            toast({
              title: 'Success',
              description: 'Achievement created successfully!',
            });
          } else {
            // If API call fails, create a mock achievement
            const newId = Math.max(0, ...achievements.map(a => a.id)) + 1;
            setAchievements(prev => [...prev, { ...formData, id: newId }]);
            
            toast({
              title: 'Success',
              description: 'Achievement created successfully (local only)!',
            });
          }
        } catch (apiError) {
          console.error('API error creating achievement:', apiError);
          
          // Create a mock achievement if API call fails
          const newId = Math.max(0, ...achievements.map(a => a.id)) + 1;
          setAchievements(prev => [...prev, { ...formData, id: newId }]);
          
          toast({
            title: 'Warning',
            description: 'Achievement created locally. Database update failed.',
            variant: 'default',
          });
        }
      }

      // Reset form and close dialog
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving achievement:', error);
      toast({
        title: 'Error',
        description: 'Failed to save achievement. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle edit button click
  const handleEdit = (achievement: Achievement) => {
    setFormData({
      title: achievement.title,
      description: achievement.description,
      achievement_date: achievement.achievement_date,
      icon: achievement.icon,
      color: achievement.color,
      image_url: achievement.image_url,
      category: achievement.category,
      display_order: achievement.display_order,
      status: achievement.status
    });
    setCurrentId(achievement.id);
    setIsEditMode(true);
    setIsDialogOpen(true);
  };

  // Handle delete button click
  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this achievement?')) {
      try {
        // Call the API to delete the achievement
        try {
          const response = await api.achievements.delete(id.toString());
          
          if (response.status === 'success') {
            // Update the local state
            setAchievements(prev => prev.filter(item => item.id !== id));
            
            toast({
              title: 'Success',
              description: 'Achievement deleted successfully!',
            });
          } else {
            // If API call fails, still update the local state
            setAchievements(prev => prev.filter(item => item.id !== id));
            
            toast({
              title: 'Warning',
              description: 'Achievement deleted locally. Database update failed.',
              variant: 'default',
            });
          }
        } catch (apiError) {
          console.error('API error deleting achievement:', apiError);
          
          // Update the local state if API call fails
          setAchievements(prev => prev.filter(item => item.id !== id));
          
          toast({
            title: 'Warning',
            description: 'Achievement deleted locally. Database update failed.',
            variant: 'default',
          });
        }
      } catch (error) {
        console.error('Error deleting achievement:', error);
        toast({
          title: 'Error',
          description: 'Failed to delete achievement. Please try again.',
          variant: 'destructive',
        });
      }
    }
  };

  // Reset form to default values
  const resetForm = () => {
    setFormData(emptyAchievement);
    setCurrentId(null);
    setIsEditMode(false);
  };

  // Filter achievements based on search term
  const filteredAchievements = achievements.filter(achievement => 
    achievement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    achievement.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    achievement.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-cricket-green">Achievements Management</h2>
          <p className="text-gray-600">Manage your academy's achievements and milestones</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => {
                resetForm();
                setIsDialogOpen(true);
              }}
              className="bg-cricket-green hover:bg-cricket-green/90"
            >
              Add New Achievement
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{isEditMode ? 'Edit Achievement' : 'Add New Achievement'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g., State Team Selection"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe the achievement..."
                    rows={3}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="achievement_date">Achievement Date</Label>
                    <Input
                      id="achievement_date"
                      name="achievement_date"
                      type="date"
                      value={formData.achievement_date}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => handleSelectChange('category', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categoryOptions.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="icon">Icon</Label>
                    <Select
                      value={formData.icon}
                      onValueChange={(value) => handleSelectChange('icon', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select icon" />
                      </SelectTrigger>
                      <SelectContent>
                        {iconOptions.map((icon) => (
                          <SelectItem key={icon} value={icon}>
                            <span className="text-xl mr-2">{icon}</span> {icon}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="color">Color Theme</Label>
                    <Select
                      value={formData.color}
                      onValueChange={(value) => handleSelectChange('color', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select color" />
                      </SelectTrigger>
                      <SelectContent>
                        {colorOptions.map((color) => (
                          <SelectItem key={color.value} value={color.value}>
                            <div className="flex items-center">
                              <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${color.value} mr-2`}></div>
                              {color.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <ImageUpload
                    label="Achievement Image"
                    folder="achievements"
                    currentImageUrl={formData.image_url}
                    onImageUploaded={(url) => {
                      setFormData(prev => ({ ...prev, image_url: url }));
                    }}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="display_order">Display Order</Label>
                    <Input
                      id="display_order"
                      name="display_order"
                      type="number"
                      min="0"
                      value={formData.display_order}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value: 'active' | 'inactive') => handleSelectChange('status', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    resetForm();
                    setIsDialogOpen(false);
                  }}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-cricket-green hover:bg-cricket-green/90"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : isEditMode ? 'Update Achievement' : 'Add Achievement'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>All Achievements</CardTitle>
            <div className="w-1/3">
              <Input
                placeholder="Search achievements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <p>Loading achievements...</p>
            </div>
          ) : filteredAchievements.length === 0 ? (
            <div className="text-center py-8">
              <p>No achievements found. Add your first achievement!</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAchievements.map((achievement) => (
                  <TableRow key={achievement.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-2">
                        <span className="text-xl">{achievement.icon}</span>
                        <span>{achievement.title}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(achievement.achievement_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{achievement.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={achievement.status === 'active' ? 'default' : 'secondary'}
                        className={achievement.status === 'active' ? 'bg-green-500' : 'bg-gray-500'}
                      >
                        {achievement.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{achievement.display_order}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEdit(achievement)}
                        >
                          Edit
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDelete(achievement.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Achievement Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredAchievements
              .filter(a => a.status === 'active')
              .sort((a, b) => a.display_order - b.display_order)
              .slice(0, 4)
              .map((achievement) => (
                <div key={achievement.id} className="min-w-[250px] flex-shrink-0">
                  <div className="group card-hover border-0 shadow-xl overflow-hidden bg-white relative animate-bounceIn hover:shadow-2xl transition-all duration-500 rounded-xl h-full">
                    {/* Achievement Image */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={achievement.image_url}
                        alt={achievement.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                      
                      {/* Achievement Icon */}
                      <div className={`absolute top-4 right-4 w-12 h-12 bg-gradient-to-br ${achievement.color} rounded-full flex items-center justify-center text-white text-xl shadow-lg`}>
                        {achievement.icon}
                      </div>
                    </div>

                    <div className="p-6">
                      {/* Achievement Title */}
                      <h3 className="text-xl font-bold text-cricket-green mb-2 group-hover:text-cricket-orange transition-colors duration-300">
                        {achievement.title}
                      </h3>
                      
                      {/* Description */}
                      <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-3">
                        {achievement.description}
                      </p>

                      {/* Achievement Date */}
                      <div className="flex items-center text-sm text-cricket-orange">
                        <span className="font-semibold">Achievement Date:</span>
                        <span className="ml-2">
                          {new Date(achievement.achievement_date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AchievementsManagement;