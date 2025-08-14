import { Request, Response } from 'express';
import Quest from '../models/questModel';

async function getQuests (req: Request, res: Response): Promise<void> {
  try {
    //optional query parameters for filtering on the backend
    const {
      type,                           // 'event' | 'place' | 'activity'
      ageRestricted,                  // '0' | '1'
      priceMin, priceMax,             // numbers
      currency,                       // 'GBP' | 'EUR' | ...
      startAfter, endBefore,          // ISO dates
      near,                           // 'lon,lat'
      radius,                         // meters
      limit,                          // max results to return (default will be 50)
    } = req.query as Record< string, string | undefined>; //TODO using 'as' is bad practice

    interface QuestFilter {
      type?: string;
      ageRestricted?: string;
      price?: { $gte?: number; $lte?: number };
      currency?: string;
      startAt?: { $gte?: Date };
      endAt?: { $lte?: Date };
      'location.location'?: {
        $near: {
          $geometry: { type: string; coordinates: [number, number] };
          $maxDistance: number;
        };
      };
    }

    const quest: QuestFilter = {};

    if (type) quest.type = type;
    if (ageRestricted === '0' || ageRestricted === '1') quest.ageRestricted = ageRestricted;
    if (priceMin || priceMax) {
      quest.price = {};
      if (priceMin) quest.price.$gte = Number(priceMin);
      if (priceMax) quest.price.$lte = Number(priceMax);
    }
    if (currency) quest.currency = currency.toUpperCase();
    if (startAfter) quest.startAt = { ...(quest.startAt || {}), $gte: new Date(startAfter) };
    if (endBefore) quest.endAt = { ...(quest.endAt || {}), $lte: new Date(endBefore) };
    if (near) {
      const [longitudeString, latitudeString] = near.split(',');
      const longitude = Number(longitudeString);
      const latitude = Number(latitudeString);
      quest['location.location'] = {
        $near: {
          $geometry: { type: 'Point', coordinates: [longitude, latitude] },
          $maxDistance: Number(radius ?? 3000)
        }
      };
    }

    // const quests = await Quest.find(quest);
    const amountOfQuestsToReturn = (() => {
      const n = Number(limit);
      if (!Number.isFinite(n)) return 20; //defaults to 50
      return Math.max(1, Math.min(n, 100)); //will never return more than 100 or less than 1
    })();

    const quests = await Quest.find(quest).limit(amountOfQuestsToReturn);

    res.status(200).json(quests);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch quests' });
  }
}

async function getQuest (req: Request, res: Response): Promise<void> {
  const { questId } = req.params;
  if (!questId) {
    res.status(400).json({ error: 'Missing questId parameter' });
    return;
  }
  
  try {
    const quest = await Quest.findById(questId);
    if (!quest) {
      res.status(404).json({ error: 'Quest not found' });
      return;
    }
    res.status(200).json(quest);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch quest' });
  }
}

export {
  getQuests,
  getQuest,
}