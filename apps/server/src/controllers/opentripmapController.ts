import { Request, Response } from 'express';
import { OTM_KEY } from '../env';

export async function getOpenTripMapEvents(request: Request, response: Response) {
  const { latitude, longitude, radius, kinds } = request.query;

  if (!latitude || !longitude) {
    return response.status(400).json({ error: 'Missing coordinates' });
  }

  try {
    const radiusMeters = Math.min(50000, Math.max(1, Math.floor(Number(radius))));
    const params = new URLSearchParams({
      radius: String(radiusMeters),
      lon: String(longitude),
      lat: String(latitude),
      apikey: OTM_KEY || '',
    });
    if (typeof kinds === 'string' && kinds.trim()) params.set('kinds', kinds);

    const url = `https://api.opentripmap.com/0.1/en/places/radius?${params.toString()}`;
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
    `https://api.opentripmap.com/0.1/en/places/xid/${xid}?apikey=${OTM_KEY}`,
  );
  const data = await res.json();
  response.json(data);
}
