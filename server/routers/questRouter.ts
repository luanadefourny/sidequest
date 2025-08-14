import express, { Router } from 'express';
import {
  getQuests,
  getQuest,
} from '../controllers/questController';

const router: Router = express.Router();

router.get('/quests', getQuests);
router.get('/quests/:questId', getQuest);

export default router;