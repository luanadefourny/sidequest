import { Request, Response } from 'express';

import Quest from '../models/questModel';

const OPENTRIPMAP_KEY = process.env.OPENTRIPMAP_KEY;
const TICKETMASTER_KEY = process.env.TICKETMASTER_KEY;

// helpers for Ticketmaster proximity
const BASE32 = "0123456789bcdefghjkmnpqrstuvwxyz";
function geohash(lat: number, lon: number, precision = 9) {
  let idx = 0, bit = 0, even = true, hash = "";
  let latMin = -90, latMax = 90, lonMin = -180, lonMax = 180;
  while (hash.length < precision) {
    if (even) {
      const lonMid = (lonMin + lonMax) / 2;
      if (lon > lonMid) { idx = (idx << 1) + 1; lonMin = lonMid; }
      else { idx = (idx << 1); lonMax = lonMid; }
    } else {
      const latMid = (latMin + latMax) / 2;
      if (lat > latMid) { idx = (idx << 1) + 1; latMin = latMid; }
      else { idx = (idx << 1); latMax = latMid; }
    }
    even = !even;
    if (++bit === 5) { hash += BASE32[idx]; bit = 0; idx = 0; }
  }
  return hash;
}
function inFrance(lat: number, lon: number) { return lat >= 41 && lat <= 51.5 && lon >= -5.5 && lon <= 9.7; }

type QuestDTO = {
  name: string;
  type: 'event' | 'place';
  location: { type: 'Point'; coordinates: [number, number] };
  ageRestricted: boolean;
  price?: number;
  currency?: string;
  url?: string;
  startAt?: string; // ISO
  endAt?: string;   // ISO
  description?: string;
  source?: string;
  sourceId?: string;
  clientId?: string;
  venueName?: string;
  image?: string;
};


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

    const radiusMeters = Math.min(Math.max(1, Math.floor(Number(radius ?? 5000))), 50000);
    const maxResults = Number.isFinite(Number(limit)) ? Math.max(1, Math.min(Number(limit), 100)) : 50;

    const kindsParam =
      typeof kinds === "string" && kinds.trim()
        ? `&kinds=${encodeURIComponent(kinds)}`
        : "";

    const opentripmapUrl =
      `https://api.opentripmap.com/0.1/en/places/radius?` +
      `radius=${radiusMeters}&lon=${lon}&lat=${lat}${kindsParam}&limit=${maxResults}&apikey=${OPENTRIPMAP_KEY}`;

    const opentripmapRes = await fetch(opentripmapUrl);
    if (!opentripmapRes.ok) {
      res.status(opentripmapRes.status).json({ error: `opentripmap ${opentripmapRes.status}` });
      return;
    }
    const opentripmapJson = await opentripmapRes.json();

    const opentripmapFeatures: any[] = Array.isArray(opentripmapJson?.features) ? opentripmapJson.features : [];

    const placeItems: QuestDTO[] = opentripmapFeatures
      .filter((feature: any) => Array.isArray(feature?.geometry?.coordinates) && feature.geometry.coordinates.length === 2)
      .map((feature: any): QuestDTO => {
        const [featureLon, featureLat] = feature.geometry.coordinates as [number, number];
        const props = feature.properties ?? {};
        const wikiUrl =
          typeof props.wikipedia === 'string' ? `https://${props.wikipedia}` :
          typeof props.wikidata  === 'string' ? `https://www.wikidata.org/wiki/${props.wikidata}` :
          undefined;

        const item: QuestDTO = {
          name: String(props.name ?? 'Unknown'),
          type: 'place',
          location: { type: 'Point', coordinates: [Number(featureLon), Number(featureLat)] },
          ageRestricted: false,
          url: wikiUrl,
          source: 'opentripmap',
          sourceId: String(props.xid ?? props.id ?? `${featureLon},${featureLat}`),
          clientId: undefined,
        };
        item.clientId = `otm:${item.sourceId}`;
        return item;
      });

    const includeEvents =
      !(req.query.includeEvents === '0' || req.query.includeEvents === 'false');
    const segment =
      typeof req.query.segment === 'string' ? req.query.segment : undefined;

    let allItems: QuestDTO[] = placeItems;

    if (includeEvents && TICKETMASTER_KEY) {
      // ticketmaster events
      const radiusKm = Math.min(150, Math.max(1, Math.round(radiusMeters / 1000)));
      const geoHash = geohash(lat, lon, 9);

      const ticketmasterParams = new URLSearchParams({
        apikey: String(TICKETMASTER_KEY),
        geopoint: geoHash,
        radius: String(radiusKm),
        unit: 'km',
        size: String(maxResults),
        sort: 'distance,asc',
      });
      if (segment) ticketmasterParams.set('classificationName', segment);

      const ticketmasterUrl = `https://app.ticketmaster.com/discovery/v2/events.json?${ticketmasterParams.toString()}`;
      const ticketmasterRes = await fetch(ticketmasterUrl);
      const ticketmasterJson = ticketmasterRes.ok ? await ticketmasterRes.json() : null;
      const ticketmasterEvents: any[] = Array.isArray(ticketmasterJson?._embedded?.events)
        ? ticketmasterJson._embedded.events
        : [];

      let eventItems: QuestDTO[] = ticketmasterEvents.map((event: any): QuestDTO => {
        const venue = event?._embedded?.venues?.[0];
        const loc = venue?.location;
        const priceRange = Array.isArray(event?.priceRanges) && event.priceRanges.length ? event.priceRanges[0] : undefined;
        const isAgeRestricted = event?.ageRestrictions?.legalAgeEnforced === true;
        const images: any[] = Array.isArray(event?.images) ? event.images : [];
        const primaryImage = images.find(i => typeof i?.url === 'string')?.url;

        const item: QuestDTO = {
          name: String(event?.name ?? 'Event'),
          type: 'event',
          location: {
            type: 'Point',
            coordinates: [
              loc?.longitude ? Number(loc.longitude) : Number(lon),
              loc?.latitude ? Number(loc.latitude) : Number(lat),
            ],
          },
          ageRestricted: Boolean(isAgeRestricted),
          source: 'ticketmaster',
          sourceId: String(event?.id ?? ''),
          clientId: undefined,
          venueName: typeof venue?.name === 'string' ? venue.name : undefined,
          image: typeof primaryImage === 'string' ? primaryImage : undefined,
        };

        if (typeof priceRange?.min === 'number') item.price = priceRange.min;
        if (typeof priceRange?.currency === 'string') item.currency = priceRange.currency;
        const startIso = event?.dates?.start?.dateTime ? String(event.dates.start.dateTime) : undefined;
        const endIso   = event?.dates?.end?.dateTime   ? String(event.dates.end.dateTime)   : undefined;
        if (startIso) item.startAt = startIso;
        if (endIso)   item.endAt   = endIso;
        const desc = typeof event?.info === 'string' ? event.info : (typeof event?.pleaseNote === 'string' ? event.pleaseNote : undefined);
        if (desc) item.description = desc;
        if (typeof event?.url === 'string') item.url = event.url;
        item.clientId = `tm:${item.sourceId}`;
        return item;
      });

      // France fallback
      const countryCode = typeof req.query.countryCode === 'string' ? req.query.countryCode.toUpperCase(): undefined;
      if (!eventItems.length && countryCode === 'FR' && inFrance(lat, lon)) {
        const ODS_BASE = 'https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/evenements-publics-openagenda/records';
        const odsParams = new URLSearchParams({
          limit: String(maxResults),
          'geofilter.distance': `${lat},${lon},${radiusKm * 1000}`,
        });
        const odsRes = await fetch(`${ODS_BASE}?${odsParams.toString()}`);
        if (odsRes.ok) {
          const odsJson: any = await odsRes.json();
          const odsRows: any[] = Array.isArray(odsJson?.results) ? odsJson.results : [];
          eventItems = odsRows.map((f): QuestDTO => {
            const hasPoint = f?.location?.lat && f?.location?.lon;
            const arrayPoint = Array.isArray(f?.geo_point_2d) && f.geo_point_2d.length === 2;
            const latNum = hasPoint ? Number(f.location.lat) : (arrayPoint ? Number(f.geo_point_2d[0]) : undefined);
            const lonNum = hasPoint ? Number(f.location.lon) : (arrayPoint ? Number(f.geo_point_2d[1]) : undefined);

            const title = f?.title ?? f?.title_fr ?? f?.titre ?? f?.name ?? 'Événement';
            const startStr = f?.date_start ?? f?.start ?? f?.firstdate_begin;
            const endStr   = f?.date_end   ?? f?.end   ?? f?.lastdate_end;
            const link     = f?.link ?? f?.url ?? f?.website;
            const summary  = f?.description ?? f?.summary ?? f?.lead_text;

            const item: QuestDTO = {
              name: String(title),
              type: 'event',
              location: {
                type: 'Point',
                coordinates: [
                  Number.isFinite(lonNum as number) ? Number(lonNum) : Number(lon),
                  Number.isFinite(latNum as number) ? Number(latNum) : Number(lat),
                ],
              },
              ageRestricted: false,
              source: 'openagenda-ods',
              sourceId: String(f?.uid ?? f?.id ?? String(title)),
              clientId: undefined,
            };

            if (typeof link === 'string') item.url = link;
            if (typeof summary === 'string') item.description = summary;
            if (startStr) item.startAt = String(startStr);
            if (endStr)   item.endAt   = String(endStr);
            item.clientId = `oa:${item.sourceId}`;
            return item;
          });
        }
      }

      allItems = [...placeItems, ...eventItems];
    }


    const deduped = (() => {
      const byKey = new Map<string, QuestDTO>();
      for (const quest of allItems) {
        const stableKey =
          quest.clientId ??
          `${quest.source ?? 'ext'}:${quest.sourceId ?? quest.name}:${quest.location.coordinates.join(',')}`;
        if (!byKey.has(stableKey)) byKey.set(stableKey, quest);
      }
      return Array.from(byKey.values());
    })();

    res.status(200).json(deduped);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch live quests" });
  }
}

export { getQuest, getQuests, getQuestsLive };
