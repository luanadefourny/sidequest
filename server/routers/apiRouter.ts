import express, { Router } from 'express';
import { getOpenTripMapEventImage, getOpenTripMapEvents } from '../controllers/opentripmapController';
import { getSerpEvents } from '../controllers/serpapiController';

const router: Router = express.Router();

router.get('/api/opentripmap', getOpenTripMapEvents);
router.get('/api/serpapi', getSerpEvents);
router.get('/api/opentripmap/details/:xid', getOpenTripMapEventImage);

export default router;