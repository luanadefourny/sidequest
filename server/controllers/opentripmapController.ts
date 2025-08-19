import { Request, Response } from 'express';

const OPENTRIPMAP_KEY = process.env.OPENTRIPMAP_KEY!;

export async function getOpenTripMapEvents(request: Request, response: Response) {
  const { latitude, longitude, radius } = request.query;
  console.log(radius);

  if (!latitude || !longitude) {
    return response.status(400).json({ error: 'Missing coordinates' });
  }

  try {
    console.log(radius);
    const url = `https://api.opentripmap.com/0.1/en/places/radius?radius=${radius}&lon=${longitude}&lat=${latitude}&apikey=${OPENTRIPMAP_KEY}`;
    console.log(url);
    const responseData = await fetch(url as string);

    if (!responseData.ok) {
      return response.status(responseData.status).json({ error: 'Something went wrong' });
    }

    const parsedData = await responseData.json();
    return response.json(parsedData.features);
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
