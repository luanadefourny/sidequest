import type { Request, Response } from "express";

// Opendatasoft Explore v2.1 — OpenAgenda public events dataset
// Docs: geofilter.distance in meters, where/order_by filters. 
// https://help.opendatasoft.com/apis/ods-explore-v2/  |  dataset: evenements-publics-openagenda
const BASE = "https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/evenements-publics-openagenda/records";

export async function getFranceEvents(req: Request, res: Response): Promise<void> {
  try {
    const { near, lat, lng, radius, limit } = req.query;

    let latitude: number | undefined;
    let longitude: number | undefined;
    if (typeof near === "string") {
      const [lonStr, latStr] = near.split(",");
      longitude = Number(lonStr);
      latitude  = Number(latStr);
    } else {
      latitude  = Number(lat);
      longitude = Number(lng);
    }
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      res.status(400).json({ error: "lat,lng or near=lon,lat required" });
      return;
    }

    const radiusM = Math.min(50000, Math.max(500, Math.floor(Number(radius ?? 20000))));
    const max     = Math.min(200, Math.max(1, Number(limit ?? 50)));

    const params = new URLSearchParams({
      limit: String(max),
      "geofilter.distance": `${latitude},${longitude},${radiusM}`, // meters
    });

    const url = `${BASE}?${params.toString()}`;
    const r = await fetch(url);
    if (!r.ok) {
      const body = await r.text();
      res.status(r.status).json({ error: `openagenda ${r.status}`, body });
      return;
    }
    const json: any = await r.json();
    const rows: any[] = Array.isArray(json?.results) ? json.results : [];
    const items = rows.map((f) => {
    let latNum: number | undefined, lonNum: number | undefined;
    if (f?.location?.lat && f?.location?.lon) { latNum = f.location.lat; lonNum = f.location.lon; }
    else if (Array.isArray(f?.geo_point_2d) && f.geo_point_2d.length === 2) { latNum = +f.geo_point_2d[0]; lonNum = +f.geo_point_2d[1]; }

    const title = f?.title ?? f?.title_fr ?? f?.titre ?? f?.name ?? "Événement";
    const startStr = f?.date_start ?? f?.start ?? f?.firstdate_begin;
    const endStr   = f?.date_end   ?? f?.end   ?? f?.lastdate_end;
    const link     = f?.link ?? f?.url ?? f?.website;

    return {
      name: String(title),
      type: "event",
      location: { type: "Point", coordinates: [Number.isFinite(lonNum!) ? +lonNum! : +longitude!, Number.isFinite(latNum!) ? +latNum! : +latitude!] },
      ageRestricted: false,
      price: undefined,
      currency: undefined,
      startAt: startStr ? new Date(startStr) : undefined,
      endAt:   endStr   ? new Date(endStr)   : undefined,
      description: typeof f?.description === "string" ? f.description : (typeof f?.summary === "string" ? f.summary : undefined),
      url: typeof link === "string" ? link : undefined,
      source: "openagenda-ods",
      sourceId: String(f?.uid ?? f?.id ?? title),
    };
  });

    res.status(200).json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch France events" });
  }
}