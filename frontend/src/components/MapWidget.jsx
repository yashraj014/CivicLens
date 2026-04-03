import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
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

// 1. Accept the 'issues' prop
const MapWidget = ({ issues = [] }) => {
  const centerPosition = [25.5358, 84.8511];

  return (
    <MapContainer center={centerPosition} zoom={14} className="h-full w-full z-0">
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {/* 2. Loop through the issues array and drop a marker for each one */}
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