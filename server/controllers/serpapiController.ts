import { Request, Response } from 'express';

const SERPAPI_KEY = process.env.SERPAPI_KEY!;

async function geocodeLocation(latitude: number, longitude: number) {
  const GOOGLE_KEY = process.env.GOOGLE_MAPS_KEY;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.results.length > 0) {
    const locationName = data.results[0].formatted_address;
    return locationName;
  }
}

export async function getSerpEvents(request: Request, response: Response) {
  const { latitude, longitude } = request.query;
  const locationName = await geocodeLocation(Number(latitude), Number(longitude));

  if (!latitude || !longitude) {
    return response.status(400).json({ error: 'Missing coordinates' });
  }

  try {
    const url = `https://serpapi.com/search.json?engine=google_events&q=Events&location=${encodeURIComponent(locationName)}&hl=en&htichips=date:month&api_key=${SERPAPI_KEY}`;

    const responseData = await fetch(url as string);

    if (!responseData.ok) {
      return response.status(responseData.status).json({ error: 'Something went wrong' });
    }

    const parsedData = await responseData.json();
    return response.json(parsedData.events);
  } catch (error) {
    response.status(500).json({ error: 'Some server error in opentripmap controller' });
  }
}

//TODO prolly need to reverse geocode location for each event to unpack into lat and long to use to put pins on the map
