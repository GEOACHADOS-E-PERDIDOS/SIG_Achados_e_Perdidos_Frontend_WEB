import { MapContainer, TileLayer, WMSTileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function Mapa() {
  return (
    <MapContainer
      center={[-15.79, -47.88]}
      zoom={13}
      style={{ height: "100%", width: "100%" }}
    >

      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <WMSTileLayer
        url="http://localhost:5538/geoserver/wms"
        layers="Geoachados:objeto"
        format="image/png"
        transparent={true}
      />

    </MapContainer>
  );
}

export default Mapa;