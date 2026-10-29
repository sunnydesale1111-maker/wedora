import { City } from '../types/vendor';

const MUMBAI_COORDS = { lat: 19.0760, lng: 72.8777 };
const PUNE_COORDS = { lat: 18.5204, lng: 73.8567 };

/**
 * Calculate distance between two coordinates using the Haversine formula (in kilometers)
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Determine the closest supported demo city (Mumbai or Pune) from GPS coordinates
 */
export function getClosestSupportedCity(lat: number, lng: number): City {
  const distMumbai = calculateDistanceKm(lat, lng, MUMBAI_COORDS.lat, MUMBAI_COORDS.lng);
  const distPune = calculateDistanceKm(lat, lng, PUNE_COORDS.lat, PUNE_COORDS.lng);
  return distMumbai <= distPune ? 'Mumbai' : 'Pune';
}

const CITY_STORAGE_KEY = 'wedora_detected_city';

/**
 * Get the currently selected or detected city from localStorage
 */
export function getSavedCity(): City {
  if (typeof window === 'undefined') return 'Pune';
  const saved = localStorage.getItem(CITY_STORAGE_KEY);
  if (saved === 'Mumbai' || saved === 'Pune') {
    return saved;
  }
  return 'Pune'; // Default to Pune for demo consistency
}

/**
 * Save user's selected city to localStorage
 */
export function saveCity(city: City): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(CITY_STORAGE_KEY, city);
    window.dispatchEvent(new CustomEvent('wedora:city_changed', { detail: city }));
  }
}

/**
 * Request browser geolocation and resolve with closest city
 */
export async function detectCityFromGeolocation(): Promise<{
  city: City;
  method: 'GEOLOCATION' | 'DEFAULT';
}> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      resolve({ city: getSavedCity(), method: 'DEFAULT' });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const closest = getClosestSupportedCity(latitude, longitude);
        saveCity(closest);
        resolve({ city: closest, method: 'GEOLOCATION' });
      },
      (err) => {
        reject(err);
      },
      { timeout: 7000, enableHighAccuracy: false }
    );
  });
}
