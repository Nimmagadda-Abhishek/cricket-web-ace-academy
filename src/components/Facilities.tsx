import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Facility {
  id: string;
  name: string;
  description: string;
  image_url: string;
  features: string[];
  status: 'available' | 'maintenance' | 'upcoming';
  created_at: string;
}

const Facilities = () => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [filteredFacilities, setFilteredFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeStatus, setActiveStatus] = useState('all');
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [error, setError] = useState<string | null>(null);

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
      
      const { data, error } = await supabase
        .from('facilities')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setFacilities(data || []);
      setFilteredFacilities(data || []);
    } catch (error) {
      console.error('Error fetching facilities:', error);
      setError('Failed to load facilities. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const statusFilters = [
    { id: 'all', name: 'All Facilities' },
    { id: 'available', name: 'Available' },
    { id: 'maintenance', name: 'Under Maintenance' },
    { id: 'upcoming', name: 'Upcoming' }
  ];

  const openDetails = (facility: Facility) => {
    setSelectedFacility(facility);
    document.body.style.overflow = 'hidden';
  };

  const closeDetails = () => {
    setSelectedFacility(null);
    document.body.style.overflow = 'auto';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">Available</span>;
      case 'maintenance':
        return <span className="bg-amber-500 text-white text-xs px-2 py-1 rounded-full">Under Maintenance</span>;
      case 'upcoming':
        return <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">Coming Soon</span>;
      default:
        return null;
    }
  };

  return (
    <section id="facilities" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold gradient-text-facilities mb-4">Our Facilities</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our world-class cricket facilities designed to provide the best training environment for players of all levels.
          </p>
        </div>

        <Tabs defaultValue="all" className="w-full mb-8">
          <div className="flex justify-center mb-6">
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredFacilities.map((facility) => (
                  <Card 
                    key={facility.id} 
                    className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
                    onClick={() => openDetails(facility)}
                  >
                    <div className="h-56 relative">
                      <img
                        src={facility.image_url}
                        alt={facility.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-70"></div>
                      <div className="absolute top-4 right-4">
                        {getStatusBadge(facility.status)}
                      </div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-xl font-bold text-white mb-1">{facility.name}</h3>
                        <p className="text-white/80 text-sm line-clamp-2">
                          {facility.description}
                        </p>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-cricket-green">Key Features:</h4>
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
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Facility Details Modal */}
      {selectedFacility && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4"
          onClick={closeDetails}
        >
          <div 
            className="max-w-4xl w-full bg-white rounded-lg overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-72">
              <img 
                src={selectedFacility.image_url} 
                alt={selectedFacility.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 flex space-x-2">
                {getStatusBadge(selectedFacility.status)}
                <button 
                  onClick={closeDetails}
                  className="bg-black bg-opacity-50 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-opacity-70 transition-all"
                >
                  ✕
                </button>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent py-6 px-6">
                <h2 className="text-3xl font-bold text-white">{selectedFacility.name}</h2>
              </div>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-cricket-green mb-2">About this Facility</h3>
                <p className="text-gray-700">{selectedFacility.description}</p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-cricket-green mb-3">Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {selectedFacility.features.map((feature, index) => (
                    <div key={index} className="flex items-start">
                      <span className="text-cricket-orange mr-2 text-lg">✓</span>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mt-8 flex justify-end">
                <Button onClick={closeDetails}>Close</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Facilities;