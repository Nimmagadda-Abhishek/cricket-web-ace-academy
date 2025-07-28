import express from 'express';
import { checkDatabaseHealth } from '../config/database';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const health = await checkDatabaseHealth();
    if (health.healthy) {
      res.status(200).json({
        status: 'success',
        message: health.message,
      });
    } else {
      res.status(500).json({
        status: 'error',
        message: health.message,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to check database health',
      error: error instanceof Error ? error.message : String(error),
    });
  }
});

export default router;
