export interface Testimonial {
  id: string;
  name: string;
  role?: string;
  content: string;
  rating: number;
  image_url?: string;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export const testimonialsData: Testimonial[] = [
  {
    id: '1',
    name: 'Rahul Sharma',
    content: 'The cricket academy has transformed my game completely. The coaches are excellent and the facilities are top-notch. I\'ve improved my batting and bowling skills significantly.',
    rating: 5,
    is_featured: true,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    name: 'Priya Patel',
    content: 'My son has been coming here for 6 months and the progress is amazing. The staff is very professional and caring. Highly recommend this academy!',
    rating: 5,
    is_featured: true,
    created_at: '2024-01-20T14:30:00Z',
    updated_at: '2024-01-20T14:30:00Z'
  },
  {
    id: '3',
    name: 'Amit Kumar',
    content: 'Great coaching and friendly environment. The academy focuses on both technical skills and mental aspects of the game. Very satisfied with the training.',
    rating: 4,
    is_featured: false,
    created_at: '2024-01-25T09:15:00Z',
    updated_at: '2024-01-25T09:15:00Z'
  },
  {
    id: '4',
    name: 'Sneha Reddy',
    content: 'The best cricket academy in the area. Individual attention to each student and excellent coaching methodology. My fielding has improved tremendously.',
    rating: 5,
    is_featured: true,
    created_at: '2024-02-01T16:45:00Z',
    updated_at: '2024-02-01T16:45:00Z'
  },
  {
    id: '5',
    name: 'Vikram Singh',
    content: 'Professional coaching with modern techniques. My daughter enjoys every session and has made great friends here. The academy maintains high standards.',
    rating: 4,
    is_featured: false,
    created_at: '2024-02-05T11:20:00Z',
    updated_at: '2024-02-05T11:20:00Z'
  },
  {
    id: '6',
    name: 'Karan Mehta',
    content: 'Excellent facilities and dedicated coaches. The training programs are well-structured and help in developing all aspects of cricket. Worth every penny!',
    rating: 5,
    is_featured: false,
    created_at: '2024-02-10T13:10:00Z',
    updated_at: '2024-02-10T13:10:00Z'
  }
];

export default testimonialsData;
