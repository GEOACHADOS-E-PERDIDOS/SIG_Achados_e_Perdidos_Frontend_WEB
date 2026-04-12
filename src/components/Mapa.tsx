import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function Mapa() {
  return (
    <MapContainer
      center={[-15.79, -47.88]} // Brasília (ajusta se quiser)
      zoom={13}
      style={{ height: "100%", width: "100%" }}
    >

      {/* 🌍 Mapa base */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* 📍 Seus dados do GeoServer */}
      <TileLayer
        url="http://localhost:8080/geoserver/geoachados/wms"
        params={{
          layers: "geoachados:objetos",
          format: "image/png",
          transparent: true
        }}
      />

    </MapContainer>
  );
}

export default Mapa;