import axios from 'axios'

import { extractAxiosError } from '../helperFunctions';

const api = axios.create({
  baseURL: '/api/opentripmap',
  headers: { 'Content-Type': 'application/json' }
})

async function getApiData (latitude: number, longitude: number, radius: number) {
  try {
    const { data } = await api.get(`?latitude=${latitude}&longitude=${longitude}&radius=${radius}`);
    console.log('apiservice call: ', data);
    return data;    
  } catch (error) {
    extractAxiosError(error, 'getApiData');
  }
}

async function getApiFeatureDetails (feature: any) {
  try {
    const { data } = await api.get(`/details/${feature.properties.xid}`);
    console.log('api details: ', data);
    return data;
  } catch (error) {
    extractAxiosError(error, 'getApiFeatureDetails');
  }
}

export { getApiData };