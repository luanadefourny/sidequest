 
import { Request, Response } from 'express';
import { TM_KEY } from '../env';

const BASE32 = "0123456789bcdefghjkmnpqrstuvwxyz";
function geohash(lat: number, lon: number, precision = 9) {
  let idx = 0, bit = 0, even = true, hash = "", latMin = -90, latMax = 90, lonMin = -180, lonMax = 180;
  while (hash.length < precision) {
    if (even) { const mid = (lonMin + lonMax) / 2; if (lon > mid) { idx = (idx<<1)+1; lonMin = mid; } else { idx = (idx<<1); lonMax = mid; } }
    else { const mid = (latMin + latMax) / 2; if (lat > mid) { idx = (idx<<1)+1; latMin = mid; } else { idx = (idx<<1); latMax = mid; } }
    even = !even; if (++bit === 5) { hash += BASE32[idx]; bit = 0; idx = 0; }
  }
  return hash;
}
function inFrance(lat: number, lon: number) { return lat >= 41 && lat <= 51.5 && lon >= -5.5 && lon <= 9.7; }

const ODS_BASE = "https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/evenements-publics-openagenda/records";

async function getTicketmasterEvents (req: Request, res: Response) {
  try {

    // accept near="lon,lat" or lat/lng
    const { near, lat, lng, radius, size, segment, start, end, countryCode, locale } = req.query;

    let latitude: number | undefined;
    let longitude: number | undefined;
    if (typeof near === "string") {
      const [lonStr, latStr] = near.split(",");
      longitude = Number(lonStr);
      latitude = Number(latStr);
    } else {
      latitude = Number(lat);
      longitude = Number(lng);
    }
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      res.status(400).json({ error: "lat,lng or near=lon,lat required" });
      return;
    }

    const radiusKm = Math.min(150, Math.max(1, Math.round(Number(radius ?? 15000) / 1000)));
    const limit = Math.min(200, Math.max(1, Number(size ?? 50)));
    const gp = geohash(latitude!, longitude!, 9);

    const params = new URLSearchParams({
      apikey: TM_KEY || '',
      geoPoint: gp,
      radius: String(radiusKm),
      unit: "km",
      size: String(limit),
      sort: "distance,asc",
    });
    if (typeof segment === "string" && segment) params.set("classificationName", segment);
    if (typeof start === "string" && start) params.set("startDateTime", start);
    if (typeof end === "string" && end) params.set("endDateTime", end);
    if (typeof countryCode === "string" && countryCode) params.set("countryCode", countryCode);
    if (typeof locale === "string" && locale) params.set("locale", locale);

    const url = `https://app.ticketmaster.com/discovery/v2/events.json?${params.toString()}`;
    const r = await fetch(url);
    if (!r.ok) {
      const body = await r.text();
      res.status(r.status).json({ error: `ticketmaster ${r.status}`, body });
      return;
    }

    const json = await r.json();
    const events: any[] = Array.isArray(json?._embedded?.events) ? json._embedded.events : [];

    let items = events.map((ev: any) => {
    const venue = ev?._embedded?.venues?.[0];
    const loc = venue?.location;
    const pr = Array.isArray(ev?.priceRanges) && ev.priceRanges.length ? ev.priceRanges[0] : undefined;
    const age = ev?.ageRestrictions?.legalAgeEnforced === true;
    return {
      name: String(ev?.name ?? "Event"),
      type: "event",
      location: {
        type: "Point",
        coordinates: [
          loc?.longitude ? Number(loc.longitude) : Number(longitude),
          loc?.latitude ? Number(loc.latitude) : Number(latitude),
        ],
      },
      ageRestricted: Boolean(age),
      price: typeof pr?.min === "number" ? pr.min : undefined,
      currency: typeof pr?.currency === "string" ? pr.currency : undefined,
      startAt: ev?.dates?.start?.dateTime ? new Date(ev.dates.start.dateTime) : undefined,
      endAt:   ev?.dates?.end?.dateTime   ? new Date(ev.dates.end.dateTime)   : undefined,
      description: typeof ev?.info === "string" ? ev.info : (typeof ev?.pleaseNote === "string" ? ev.pleaseNote : undefined),
      url: typeof ev?.url === "string" ? ev.url : undefined,
      source: "ticketmaster",
      sourceId: String(ev?.id ?? ""),
    };
  });

  //! france is silly: confirmed
  // FR fallback: if TM empty and coords in mainland France, pull OpenAgenda (Opendatasoft)
  if (!items.length && inFrance(latitude!, longitude!)) {
    const paramsODS = new URLSearchParams({
      limit: String(limit),
      "geofilter.distance": `${latitude},${longitude},${radiusKm * 1000}`, // meters
    });
    const rr = await fetch(`${ODS_BASE}?${paramsODS.toString()}`);
    if (rr.ok) {
      const jj: any = await rr.json();
      const rows: any[] = Array.isArray(jj?.results) ? jj.results : [];
      const frItems = rows.map((f) => {
        let latNum: number | undefined, lonNum: number | undefined;
        if (f?.location?.lat && f?.location?.lon) { latNum = f.location.lat; lonNum = f.location.lon; }
        else if (Array.isArray(f?.geo_point_2d) && f.geo_point_2d.length === 2) { latNum = +f.geo_point_2d[0]; lonNum = +f.geo_point_2d[1]; }
        const title = f?.title ?? f?.title_fr ?? f?.titre ?? f?.name ?? "Événement";
        const startStr = f?.date_start ?? f?.start ?? f?.firstdate_begin;
        const endStr   = f?.date_end   ?? f?.end   ?? f?.lastdate_end;
        const link     = f?.link ?? f?.url ?? f?.website;
        const desc     = f?.description ?? f?.summary ?? f?.lead_text;
        return {
          name: String(title),
          type: "event",
          location: {
            type: "Point",
            coordinates: [
              Number.isFinite(lonNum!) ? +lonNum! : +longitude!,
              Number.isFinite(latNum!) ? +latNum! : +latitude!,
            ],
          },
          ageRestricted: false,
          price: undefined,
          currency: undefined,
          startAt: startStr ? new Date(startStr) : undefined,
          endAt:   endStr   ? new Date(endStr)   : undefined,
          description: typeof desc === "string" ? desc : undefined,
          url: typeof link === "string" ? link : undefined,
          source: "openagenda-ods",
          sourceId: String(f?.uid ?? f?.id ?? title),
        };
      });
      items = frItems;
    }
  }

  return res.status(200).json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch Ticketmaster events" });
  }
}

async function getTicketmasterEventDetails (req: Request, res: Response) {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: 'Missing event id' });

    const url = `https://app.ticketmaster.com/discovery/v2/events/${encodeURIComponent(id)}.json?apikey=${TM_KEY}`;
    const r = await fetch(url);
    if (!r.ok) return res.status(r.status).json({ error: `ticketmaster ${r.status}`, body: await r.text() });

    const ev: any = await r.json();
    const venue = ev?._embedded?.venues?.[0];
    const images: any[] = Array.isArray(ev?.images) ? ev.images : [];
    const primaryImage = images.find((i: any) => typeof i?.url === 'string')?.url;

    res.json({
      id: String(ev?.id ?? id),
      name: String(ev?.name ?? 'Event'),
      url: typeof ev?.url === 'string' ? ev.url : undefined,
      info: typeof ev?.info === 'string' ? ev.info : (typeof ev?.pleaseNote === 'string' ? ev.pleaseNote : undefined),
      venueName: typeof venue?.name === 'string' ? venue.name : undefined,
      address: venue?.address?.line1,
      city: venue?.city?.name,
      country: venue?.country?.name,
      image: primaryImage,
      start: ev?.dates?.start?.dateTime ?? ev?.dates?.start?.localDate,
      price: Array.isArray(ev?.priceRanges) && ev.priceRanges[0]?.min,
      currency: Array.isArray(ev?.priceRanges) && ev.priceRanges[0]?.currency,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch TM event details' });
  }
}

export { 
  getTicketmasterEventDetails,
  getTicketmasterEvents,
};