import express, { Router } from 'express';

import { getFranceEvents } from '../controllers/franceEventsController';
import {
  getOpenTripMapEventImage,
  getOpenTripMapEvents,
} from '../controllers/opentripmapController';
import { getQuestsLive } from '../controllers/questController';
import { getTicketmasterEventDetails, getTicketmasterEvents } from '../controllers/ticketmasterController';

const router: Router = express.Router();

router.get('/api/opentripmap', getOpenTripMapEvents);
router.get('/api/opentripmap/details/:xid', getOpenTripMapEventImage);

router.get('/api/ticketmaster', getTicketmasterEvents);
router.get('/api/ticketmaster/:id', getTicketmasterEventDetails);
router.get('/api/france/events', getFranceEvents);

// router.get('/api/quests/live', getQuestsLive);

export default router;
