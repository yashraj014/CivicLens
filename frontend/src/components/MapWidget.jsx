import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

// NEW: The invisible component that controls the camera
const FlyToLocation = ({ position }) => {
  const map = useMap(); // Grabs the map instance
  
  useEffect(() => {
    if (position) {
      // flyTo takes the coordinates and the zoom level (16 is nice and close)
      map.flyTo(position, 16, { animate: true, duration: 1.5 });
    }
  }, [position, map]);

  return null; // It doesn't draw anything on the screen
};

// We now accept 'selectedPosition' from the Dashboard
const MapWidget = ({ issues = [], selectedPosition }) => {
  const centerPosition = [25.5358, 84.8511];

  return (
    <MapContainer center={centerPosition} zoom={14} className="h-full w-full z-0">
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {/* Mount our invisible camera controller */}
      <FlyToLocation position={selectedPosition} />
      
      {issues.map((issue) => (
        <Marker key={issue.id} position={[issue.latitude, issue.longitude]}>
          <Popup>
            <div className="font-bold text-blue-600">{issue.title}</div>
            <div className="text-sm">{issue.category} - {issue.status}</div>
          </Popup>
        </Marker>
      ))}

    </MapContainer>
  );
};

export default MapWidget;