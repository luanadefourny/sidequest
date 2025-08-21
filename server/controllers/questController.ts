import { Request, Response } from 'express';

import Quest from '../models/questModel';

const OPENTRIPMAP_KEY = process.env.OPENTRIPMAP_KEY;
const TICKETMASTER_KEY = process.env.TICKETMASTER_KEY;

const INCLUDE_KINDS = [
  'amusements',
  'architecture',
  'cultural',
  'historic',
  'beaches',
  'geological_formations',
  'natural_springs',
  'nature_reserves',
  'waterfalls',
  'view_points',
  'sport',
];
const EXCLUDE_KINDS = [
  'monuments',
  'foods',
  'accomodations',
  'adult',
  'urban_environment',
  'industrial_facilities',
  'rivers',
  'religion',
  'banks',
  'shops',
  'transport',
  'other_buildings_and_structures',
  // 'monuments_and_memorials',
];

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

function distanceMeters(lon1: number, lat1: number, lon2: number, lat2: number) {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const R = 6371000;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

// ---- pagination helpers ----
const OTM_PAGE_SIZE = 500;    // OpenTripMap max per request
const OTM_MAX_PAGES = 50;      // safety cap
const TM_PAGE_SIZE  = 200;    // Ticketmaster practical max
const TM_MAX_PAGES  = 10;      // safety cap

async function fetchOtmPaged(lon: number, lat: number, radiusMeters: number, kindsCsv: string, wanted: number, maxPages = OTM_MAX_PAGES) {
  let offset = 0;
  let acc: any[] = [];
  const hardMax = Number.isFinite(wanted) ? Math.max(1, Math.floor(wanted)) : Number.MAX_SAFE_INTEGER;
  const softCap = Math.min(hardMax, OTM_PAGE_SIZE * maxPages);
  while (acc.length < softCap) {
    const limit = Math.min(OTM_PAGE_SIZE, softCap - acc.length);
    const url = `https://api.opentripmap.com/0.1/en/places/radius?radius=${radiusMeters}&lon=${lon}&lat=${lat}` +
                `${kindsCsv ? `&kinds=${kindsCsv}` : ''}&limit=${limit}&offset=${offset}&apikey=${OPENTRIPMAP_KEY}`;
    const r = await fetch(url);
    if (!r.ok) break;
    const j = await r.json();
    const feats = Array.isArray(j?.features) ? j.features : [];
    acc = acc.concat(feats);
    if (feats.length < limit) break; // no more data
    offset += feats.length;
  }
  return acc;
}

async function fetchTmPaged(baseParams: URLSearchParams, pageLimit: number) {
  let page = 0;
  let acc: any[] = [];
  while (page < pageLimit) {
    baseParams.set('page', String(page));
    const r = await fetch(`https://app.ticketmaster.com/discovery/v2/events.json?${baseParams.toString()}`);
    if (!r.ok) break;
    const j: any = await r.json();
    const evs: any[] = Array.isArray(j?._embedded?.events) ? j._embedded.events : [];
    acc = acc.concat(evs);
    if (!j?._links?.next) break;
    page += 1;
  }
  return acc;
}


type QuestDTO = {
  _id: string;
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
  // clientId?: string;
  venueName?: string;
  image?: string;
};


async function getQuests(req: Request, res: Response): Promise<void> {
  try {
    //optional query parameters for filtering on the backend
    const {
      type, // 'event' | 'place'
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

    const requestedLimitRaw = Number(limit);
    const requestedLimit = Number.isFinite(requestedLimitRaw)
      ? Math.max(1, Math.floor(requestedLimitRaw))
      : 200; // default when client omits limit

    const quests = await Quest.find(quest).limit(requestedLimit);

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
      res.status(500).json({ error: 'OPENTRIPMAP_KEY missing' });
      return;
    }

    const { near, radius, limit, kinds } = req.query;
    // console.log('kinds: ',kinds);

    if (!near || typeof near !== 'string') {
      res.status(400).json({ error: "near required as 'lon,lat'" });
      return;
    }

    const [lonStr, latStr] = near.split(',');
    const lon = Number(lonStr);
    const lat = Number(latStr);
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
      res.status(400).json({ error: 'invalid coordinates' });
      return;
    }

    // Inputs
    const requestedLimitRaw = Number(limit);
    const requestedLimit = Number.isFinite(requestedLimitRaw)
      ? Math.max(1, Math.floor(requestedLimitRaw))
      : Number.MAX_SAFE_INTEGER;

    const radiusMeters = Math.min(Math.max(1, Math.floor(Number(radius ?? 5000))), 50000);

    // Optional: only today's events when todayOnly=1|true (default ON unless client disables)
    const todayQuery = String(req.query.todayOnly ?? '1').toLowerCase();
    const todayOnly = !(todayQuery === '0' || todayQuery === 'false');

    // Compute YYYY-MM-DD in server local time for comparing with Ticketmaster's localDate
    function ymdLocal(d = new Date()) {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${y}-${m}-${day}`;
    }
    const todayYMD = ymdLocal();

    // Per-source paging budgets (can be overridden via query: otmPages, tmPages; both clamped by env defaults)
    const qOtm = Math.floor(Number(req.query.otmPages));
    const qTm  = Math.floor(Number(req.query.tmPages));
    const otmPageBudget = Number.isFinite(qOtm) && qOtm > 0 ? Math.min(qOtm, OTM_MAX_PAGES) : OTM_MAX_PAGES;
    const tmPageBudget  = Number.isFinite(qTm)  && qTm  > 0 ? Math.min(qTm,  TM_MAX_PAGES)  : TM_MAX_PAGES;
    // Build OTM URL
    const kindsParams = INCLUDE_KINDS.length ? INCLUDE_KINDS.join(',') : (typeof kinds === 'string' && kinds.trim() ? kinds : '');
    // const otmUrl =
    //   // `https://api.opentripmap.com/0.1/en/places/radius?` +
    //   // `radius=${radiusMeters}&lon=${lon}&lat=${lat}${kindsParam}&limit=${otmLimit}&apikey=${OPENTRIPMAP_KEY}`;
    //   // `https://api.opentripmap.com/0.1/en/places/radius?radius=${radiusMeters}&lon=${lon}&lat=${lat}&kinds=architecture,cultural,historic,beaches,geological_formations,natural_springs,nature_reserves,waterfalls,view_points,sport,foods,shops&limit=${otmLimit}&apikey=${OPENTRIPMAP_KEY}`;
    //   `https://api.opentripmap.com/0.1/en/places/radius?radius=${radiusMeters}&lon=${lon}&lat=${lat}&kinds=${kindsParams}&limit=${otmLimit}&apikey=${OPENTRIPMAP_KEY}`;

    // // Build TM URL (if key present)
    // let tmUrl: string | null = null;

    // Fetch OTM paged
    const otmFeatures: any[] = await fetchOtmPaged(lon, lat, radiusMeters, kindsParams, requestedLimit, otmPageBudget);
    // Prepare TM params and fetch paged if key present
    let tmAll: any[] = [];

    if (TICKETMASTER_KEY) {
      const radiusKm = Math.min(150, Math.max(1, Math.round(radiusMeters / 1000)));
      const geoHash = geohash(lat, lon, 9);

      const tmParams = new URLSearchParams({
        apikey: String(TICKETMASTER_KEY),
        geoPoint: geoHash,
        radius: String(radiusKm),
        unit: 'km',
        // size: String(tmSize),
        size: String(TM_PAGE_SIZE),
        sort: 'distance,asc',
      });

      // tmUrl = `https://app.ticketmaster.com/discovery/v2/events.json?${tmParams.toString()}`;
      tmAll = await fetchTmPaged(tmParams, tmPageBudget);
    }
    // console.log('tmUrl: ', tmUrl);
    // Fetch in parallel
    // const [otmRes, tmRes] = await Promise.all([
    //   fetch(otmUrl),
    //   tmUrl ? fetch(tmUrl) : Promise.resolve(null),
    // ]);

    // if (!otmRes.ok) {
    //   res.status(otmRes.status).json({ error: `opentripmap ${otmRes.status}` });
    //   return;
    // }

    // const otmJson = await otmRes.json();
    // const otmFeatures: any[] = Array.isArray(otmJson?.features) ? otmJson.features : [];

    const placeItems: QuestDTO[] = otmFeatures
      .filter((f: any) => Array.isArray(f?.geometry?.coordinates) && f.geometry.coordinates.length === 2)
      .filter((f: any) => {
        if (!INCLUDE_KINDS.length) return true;
        const kindsString = typeof f?.properties?.kinds === 'string' ? f.properties.kinds.split(',') : [];
        return !kindsString.some((kind: string) => EXCLUDE_KINDS.includes(kind));
      })
      .filter((f: any) => typeof f?.properties?.name === 'string' && f.properties.name.trim().length > 0)
      .map((f: any): QuestDTO => {
        const [fLon, fLat] = f.geometry.coordinates as [number, number];
        const props = f.properties ?? {};
        const wikiUrl =
          typeof props.wikipedia === 'string' ? `https://${props.wikipedia}` :
          typeof props.wikidata === 'string'  ? `https://www.wikidata.org/wiki/${props.wikidata}` :
          undefined;

        return {
          name: String(props.name ?? 'Unknown'),
          type: 'place',
          location: { type: 'Point', coordinates: [Number(fLon), Number(fLat)] },
          ageRestricted: false,
          url: wikiUrl,
          source: 'opentripmap',
          sourceId: String(props.xid ?? props.id ?? `${fLon},${fLat}`),
          _id: `otm:${String(props.xid ?? props.id ?? `${fLon},${fLat}`)}`,
        };
      });

    let eventItems: QuestDTO[] = [];
    // if (tmRes) {
    //   const tmJson = tmRes.ok ? await tmRes.json() : null;
    //   const tmAll: any[] = Array.isArray(tmJson?._embedded?.events) ? tmJson._embedded.events : [];

    const tmEvents: any[] = todayOnly
      ? tmAll.filter((ev: any) => {
          const ld = ev?.dates?.start?.localDate;
          if (typeof ld === 'string') return ld === todayYMD;
          const dt = ev?.dates?.start?.dateTime;
          return typeof dt === 'string' ? dt.slice(0, 10) === todayYMD : false;
        })
      : tmAll;

    eventItems = tmEvents.map((ev: any): QuestDTO => {
      const venue = ev?._embedded?.venues?.[0];
      const loc = venue?.location;
      const priceRange = Array.isArray(ev?.priceRanges) && ev.priceRanges.length ? ev.priceRanges[0] : undefined;
      const isAgeRestricted = ev?.ageRestrictions?.legalAgeEnforced === true;
      const images: any[] = Array.isArray(ev?.images) ? ev.images : [];
      const primaryImage = images.find((i: any) => typeof i?.url === 'string')?.url;

      const quest: QuestDTO = {
        name: String(ev?.name ?? 'Event'),
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
        sourceId: String(ev?.id ?? ''),
        _id: `tm:${String(ev?.id ?? '')}`,
        venueName: typeof venue?.name === 'string' ? venue.name : undefined,
        image: typeof primaryImage === 'string' ? primaryImage : undefined,
      };

      const startIso = ev?.dates?.start?.dateTime ? String(ev.dates.start.dateTime) : undefined;
      const endIso   = ev?.dates?.end?.dateTime   ? String(ev.dates.end.dateTime)   : undefined;
      if (startIso) quest.startAt = startIso;
      if (endIso)   quest.endAt   = endIso;
      const desc = typeof ev?.info === 'string' ? ev.info : (typeof ev?.pleaseNote === 'string' ? ev.pleaseNote : undefined);
      if (desc) quest.description = desc;
      if (typeof priceRange?.min === 'number') quest.price = priceRange.min;
      if (typeof priceRange?.currency === 'string') quest.currency = priceRange.currency;
      if (typeof ev?.url === 'string') quest.url = ev.url;

      return quest;
    });
  
    
    function withinRadius(quest: QuestDTO) {
      const [questLon, questLat] = quest.location.coordinates;
      return distanceMeters(lon, lat, questLon, questLat) <= radiusMeters;
    }
    let merged: QuestDTO[] = [...placeItems, ...eventItems].filter(withinRadius);
    merged.sort((a, b) => {
      const [aLon, aLat] = a.location.coordinates;
      const [bLon, bLat] = b.location.coordinates;
      const da = distanceMeters(lon, lat, aLon, aLat);
      const db = distanceMeters(lon, lat, bLon, bLat);
      return da - db;
    });
    merged = merged.slice(0, requestedLimit);

    console.log('questcontroller: ', {
      radiusMeters,
      otmFetched: otmFeatures.length,
      // tmFetched: (tmRes ? (Array.isArray(tmJson?._embedded?.events) ? tmJson._embedded.events.length : 0) : 0),
      afterKindsFilter: placeItems.length,
      mergedWithinRadius: merged.length,
    });

    res.status(200).json(merged);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Failed to fetch live quests' });
  }
}

export { getQuest, getQuests, getQuestsLive };
