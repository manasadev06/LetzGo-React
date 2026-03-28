export async function geocodePlace(place) {
  if (!place) return null;

  // VERY IMPORTANT: add city + country
  const query = `${place}, Hyderabad, India`;

  const url =
    `https://nominatim.openstreetmap.org/search?format=json&q=` +
    encodeURIComponent(query);

  const res = await fetch(url, {
    headers: {
      "Accept": "application/json",
      "User-Agent": "bikepooling-app"
    }
  });

  const data = await res.json();

  if (!data || data.length === 0) return null;

  return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
}
