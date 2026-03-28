function haversine(a, b) {
  const R = 6371; // km
  const dLat = (b[0] - a[0]) * Math.PI / 180;
  const dLng = (b[1] - a[1]) * Math.PI / 180;

  const lat1 = a[0] * Math.PI / 180;
  const lat2 = b[0] * Math.PI / 180;

  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);

  return 2 * R * Math.asin(Math.sqrt(x));
}

export function isPickupOnRoute(pickup, route, thresholdKm = 0.5) {
  return route.some(point => haversine(pickup, point) <= thresholdKm);
}
