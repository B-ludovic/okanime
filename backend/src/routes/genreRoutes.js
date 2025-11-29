import express from 'express';
import { getAllGenres } from '../controllers/animeController.js';

const router = express.Router();

router.get('/', getAllGenres); 

export default router;