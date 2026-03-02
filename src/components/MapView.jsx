import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import { useEffect, useState } from "react";
import { geocodePlace } from "../utils/geocode";
import { getRoute } from "../utils/getRoute";

function FitBounds({ points }) {
  const map = useMap();

  useEffect(() => {
    if (!map || points.length < 2) return;

    setTimeout(() => {
      map.fitBounds(points, { padding: [40, 40] });
    }, 100);
  }, [map, points]);

  return null;
}

export default function MapView({ pickupText, destinationText }) {
  const [pickup, setPickup] = useState(null);
  const [destination, setDestination] = useState(null);
  const [route, setRoute] = useState(null);

  useEffect(() => {
    async function load() {
      const p = await geocodePlace(pickupText);
      const d = await geocodePlace(destinationText);

      setPickup(p);
      setDestination(d);

      if (p && d) {
        const r = await getRoute(p, d);
        setRoute(r);
      }
    }
    load();
  }, [pickupText, destinationText]);

  if (!pickup || !destination) {
    return <div style={{ height: 350 }}>Loading map…</div>;
  }

  const points = [pickup, destination];

  return (
    <MapContainer
      key={`${pickup[0]}-${pickup[1]}-${destination[0]}-${destination[1]}`}
      center={pickup}
      zoom={10}
      style={{ height: "350px", width: "100%", borderRadius: "14px" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker position={pickup}>
        <Popup>Pickup</Popup>
      </Marker>

      <Marker position={destination}>
        <Popup>Drop</Popup>
      </Marker>

      {route && <Polyline positions={route} color="blue" weight={4} />}

      <FitBounds points={points} />
    </MapContainer>
  );
}
