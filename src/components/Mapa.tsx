import { MapContainer, TileLayer, WMSTileLayer, LayersControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const { Overlay, BaseLayer } = LayersControl;

function Mapa() {
  return (
    <MapContainer
      center={[-15.7939, -47.8828]}
      zoom={14}
      style={{ height: "100%", width: "100%" }}
    >
      <LayersControl position="bottomleft">

        <BaseLayer checked name="Satélite">
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution="Tiles © Esri"
          />
        </BaseLayer>

        <BaseLayer name="Mapa">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="© OpenStreetMap"
          />
        </BaseLayer>

        <Overlay checked name="Objetos Perdidos">
          <WMSTileLayer
            url="/geoserver/wms"
            layers="Geoachados:objeto_perdido"
            format="image/png"
            transparent={true}
            version="1.1.0"
          />
        </Overlay>
      </LayersControl>


    </MapContainer>
  );
}

export default Mapa;