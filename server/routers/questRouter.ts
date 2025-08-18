import express, { Router } from 'express';

import { getQuest, getQuests } from '../controllers/questController';

const router: Router = express.Router();

router.get('/quests', getQuests);
router.get('/quests/:questId', getQuest);

export default router;
