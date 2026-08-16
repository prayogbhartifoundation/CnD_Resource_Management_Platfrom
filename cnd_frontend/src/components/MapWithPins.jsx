import { MapContainer, TileLayer, Marker, Tooltip, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Custom Plant Icon
const plantIcon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png", // small marker
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

// Component to auto-fit bounds
const FitBounds = ({ plants }) => {
  const map = useMap();

  if (!plants || plants.length === 0) return null;

  const bounds = L.latLngBounds(
    plants
      .filter((p) => p.mapLocLatLong?.lat && p.mapLocLatLong?.lng)
      .map((p) => [p.mapLocLatLong.lat, p.mapLocLatLong.lng])
  );

  if (bounds.isValid()) {
    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 10 });
  }

  return null;
};

const MapWithPins = ({ plants }) => {
  return (
    <MapContainer
      center={[28.6139, 77.2090]}
  zoom={6}                 // 👈 better default for NCR / North India
  minZoom={4}              // 👈 prevents zooming too far out
  maxZoom={18}             // 👈 prevents over-zoom
  scrollWheelZoom={true}   // 👈 mouse wheel zoom
  zoomControl={true}       // 👈 + / - buttons
  style={{ width: "100%", height: "100%" }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Auto-fit map to all pins */}
      <FitBounds plants={plants} />
      {console.log("plants mappin: ",plants)}
      {/* Show pins */}
      {plants?.map((p) =>
       {
        

        return ( p.mapLocLatLong?.lat && p.mapLocLatLong?.lng ? (
          <Marker
            key={p._id}
            icon={plantIcon}
            position={[p.mapLocLatLong.lat, p.mapLocLatLong.lng]}
          >
            <Tooltip direction="top" offset={[0, -10]} opacity={1} permanent={false}>
              {p.name || "Plant"}
            </Tooltip>
          </Marker>
        ) : null)}
      )}
    </MapContainer>
  );
};

export default MapWithPins;
