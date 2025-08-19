import { Request, Response } from 'express';

import Quest from '../models/questModel';

const OPENTRIPMAP_KEY = process.env.OPENTRIPMAP_KEY;

async function getQuests(req: Request, res: Response): Promise<void> {
  try {
    //optional query parameters for filtering on the backend
    const {
      type, // 'event' | 'place' | 'activity'
      ageRestricted, // '0' | '1'
      priceMin,
      priceMax, // numbers
      currency, // 'GBP' | 'EUR' | ...
      startAfter,
      endBefore, // ISO dates
      near, // 'lon,lat'
      radius, // meters
      limit, // max results to return (default will be 50)
    } = req.query;

    interface QuestFilter {
      type?: string;
      ageRestricted?: boolean;
      price?: { $gte?: number; $lte?: number };
      currency?: string;
      startAt?: { $gte?: Date };
      endAt?: { $lte?: Date };
      location?: {
        $near: {
          $geometry: { type: string; coordinates: [number, number] };
          $maxDistance: number;
        };
      };
    }

    const quest: QuestFilter = {};

    if (type && typeof type === 'string') quest.type = type;
    if (ageRestricted === '0' || ageRestricted === '1') quest.ageRestricted = ageRestricted === '1';
    if (priceMin || priceMax) {
      quest.price = {};
      if (priceMin) quest.price.$gte = Number(priceMin);
      if (priceMax) quest.price.$lte = Number(priceMax);
    }
    if (currency && typeof currency === 'string') quest.currency = currency.toUpperCase();
    if (startAfter && typeof startAfter === 'string')
      quest.startAt = { ...(quest.startAt || {}), $gte: new Date(startAfter) };
    if (endBefore && typeof endBefore === 'string')
      quest.endAt = { ...(quest.endAt || {}), $lte: new Date(endBefore) };
    if (near && typeof near === 'string') {
      const [longitudeString, latitudeString] = near.split(',');
      const longitude = Number(longitudeString);
      const latitude = Number(latitudeString);
      quest.location = {
        $near: {
          $geometry: { type: 'Point', coordinates: [longitude, latitude] },
          $maxDistance: Number(radius ?? 3000),
        },
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
    console.log(err);
    res.status(500).json({ error: 'Failed to fetch quests' });
  }
}

async function getQuest(req: Request, res: Response): Promise<void> {
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
    console.log(err);
    res.status(500).json({ error: 'Failed to fetch quest' });
  }
}

async function getQuestsLive (req: Request, res: Response): Promise<void> {
  try {
    if (!OPENTRIPMAP_KEY) {
      res.status(500).json({ error: "OPENTRIPMAP_KEY missing" });
      return;
    }

    const { near, radius, limit, kinds } = req.query;
    if (!near || typeof near !== "string") {
      res.status(400).json({ error: "near required as 'lon,lat'" });
      return;
    }
    const [lonStr, latStr] = near.split(",");
    const lon = Number(lonStr);
    const lat = Number(latStr);
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
      res.status(400).json({ error: "invalid coordinates" });
      return;
    }

    const radiusM = Math.min(Math.max(1, Math.floor(Number(radius ?? 5000))), 50000);
    const max = (() => {
      const n = Number(limit);
      return Number.isFinite(n) ? Math.max(1, Math.min(n, 100)) : 50;
    })();

    const kindsParam =
      typeof kinds === "string" && kinds.trim()
        ? `&kinds=${encodeURIComponent(kinds)}`
        : "";

    const url =
      `https://api.opentripmap.com/0.1/en/places/radius?` +
      `radius=${radiusM}&lon=${lon}&lat=${lat}${kindsParam}&limit=${max}&apikey=${OPENTRIPMAP_KEY}`;

    const r = await fetch(url);
    if (!r.ok) {
      res.status(r.status).json({ error: `opentripmap ${r.status}` });
      return;
    }
    const json = await r.json();
    const features: any[] = Array.isArray(json?.features) ? json.features : [];

    const items = features
      .filter((f: any) => Array.isArray(f?.geometry?.coordinates) && f.geometry.coordinates.length === 2)
      .map((f: any) => {
        const [flon, flat] = f.geometry.coordinates as [number, number];
        const p = f.properties ?? {};
        const wikipedia = typeof p.wikipedia === "string" ? `https://${p.wikipedia}` : undefined;
        const wikidata = typeof p.wikidata === "string" ? `https://www.wikidata.org/wiki/${p.wikidata}` : undefined;
        return {
          name: String(p.name ?? "Unknown"),
          type: "place",
          location: { type: "Point", coordinates: [Number(flon), Number(flat)] },
          ageRestricted: false,
          price: undefined,
          currency: undefined,
          startAt: undefined,
          endAt: undefined,
          description: undefined,
          url: wikipedia || wikidata,
          source: "opentripmap",
          sourceId: String(p.xid ?? p.id ?? `${flon},${flat}`),
        };
      });

    res.status(200).json(items);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch live quests" });
  }
}

export { getQuest, getQuests, getQuestsLive };
