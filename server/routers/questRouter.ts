import express, { Router } from 'express';
import {
  getQuests,
} from '../controllers/questController';

const router: Router = express.Router();

router.get('/quests', getQuests);

export default router;