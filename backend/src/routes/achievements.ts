import express from 'express';
import { protect, restrictTo } from '../middleware/auth';

const router = express.Router();

// Simple achievements endpoint for testing
router.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      achievements: [
        {
          id: 1,
          title: 'State Team Selection',
          description: '5 of our students were selected for the state cricket team in 2023.',
          date: '2023-06-15',
          icon: '🏆',
          color: 'green'
        },
        {
          id: 2,
          title: 'IPL Selection',
          description: 'Two of our academy graduates were picked in the IPL auction.',
          date: '2022-12-20',
          icon: '🏏',
          color: 'orange'
        },
        {
          id: 3,
          title: 'Under-18 National Team',
          description: 'Three students selected for the Under-18 National Cricket Team.',
          date: '2023-08-10',
          icon: '👦',
          color: 'blue'
        }
      ]
    }
  });
});

export default router;