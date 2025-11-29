import express from 'express';
import { getAllGenres } from '../controllers/animeController.js';

export const router = express.Router();

router.get('/', getAllGenres); 

