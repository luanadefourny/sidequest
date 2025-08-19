import express, { Router } from 'express';

import {
  getOpenTripMapEventImage,
  getOpenTripMapEvents,
} from '../controllers/opentripmapController';
import { getQuestsLive } from '../controllers/questController';
import { getSerpEvents } from '../controllers/serpapiController';

const router: Router = express.Router();

router.get('/api/opentripmap', getOpenTripMapEvents);
router.get('/api/serpapi', getSerpEvents);
router.get('/api/opentripmap/details/:xid', getOpenTripMapEventImage);

router.get('/api/quests/live', getQuestsLive);

export default router;
