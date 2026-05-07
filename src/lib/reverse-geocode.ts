type GeoResult = { city: string; country: string; countryCode: string };

// Simple in-memory cache so we don't hit the API for the same coords twice
const cache = new Map<string, GeoResult>();

/**
 * Reverse geocode a lat/lng pair using the free BigDataCloud client API.
 * Returns { city, country, countryCode } or null on failure.
 */
export async function reverseGeocode(
  latitude: number,
  longitude: number,
): Promise<GeoResult | null> {
  const key = `${latitude.toFixed(4)},${longitude.toFixed(4)}`;
  if (cache.has(key)) return cache.get(key)!;

  try {
    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const json = (await res.json()) as {
      city?: string;
      locality?: string;
      principalSubdivision?: string;
      countryName?: string;
      countryCode?: string;
    };
    const result: GeoResult = {
      city: json.city || json.locality || json.principalSubdivision || "Unknown",
      country: json.countryName ?? "",
      countryCode: json.countryCode ?? "",
    };
    cache.set(key, result);
    return result;
  } catch {
    return null;
  }
}
