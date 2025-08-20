import { Request, Response } from 'express';

const OPENTRIPMAP_KEY = process.env.OPENTRIPMAP_KEY!;

export async function getOpenTripMapEvents(request: Request, response: Response) {
  const { latitude, longitude, radius, kinds } = request.query;
  console.log(radius);

  if (!latitude || !longitude) {
    return response.status(400).json({ error: 'Missing coordinates' });
  }

  try {
    // console.log(radius);
    const radiusMeters = Math.min(50000, Math.max(1, Math.floor(Number(radius ?? 10000))));
    const params = new URLSearchParams({
      radius: String(radiusMeters),
      lon: String(longitude),
      lat: String(latitude),
      apikey: OPENTRIPMAP_KEY,
    });
    if (typeof kinds === 'string' && kinds.trim()) params.set('kinds', kinds);

    const url = `https://api.opentripmap.com/0.1/en/places/radius?${params.toString()}`;
    // console.log(url);
    const responseData = await fetch(url);

    if (!responseData.ok) {
      return response.status(responseData.status).json({ error: 'Something went wrong' });
    }

    const parsedData = await responseData.json();
    return response.json(Array.isArray(parsedData?.features) ? parsedData.features : []);
  } catch (error) {
    console.log(error);
    response.status(500).json({ error: 'Some server error in opentripmap controller' });
  }
}

export async function getOpenTripMapEventImage(request: Request, response: Response) {
  const { xid } = request.params;
  const res = await fetch(
    `https://api.opentripmap.com/0.1/en/places/xid/${xid}?apikey=${OPENTRIPMAP_KEY}`,
  );
  const data = await res.json();
  response.json(data);
}
