import { MapContainer, TileLayer, WMSTileLayer, LayersControl } from "react-leaflet";
import { useState } from "react";
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

        <Overlay checked name="Postos de Retirada">
          <WMSTileLayer
            url="/geoserver/wms"
            layers="Geoachados:posto_retirada"
            format="image/png"
            transparent={true}
            version="1.1.0"
          />
        </Overlay>

        <Overlay checked name="Objetos Perdidos">
          <WMSTileLayer
            url="/geoserver/wms"
            layers="Geoachados:objeto_perdido"
            format="image/png"
            transparent={true}
            version="1.1.0"
          />
        </Overlay>

        <Overlay checked name="Objeto Achado">
          <WMSTileLayer
            url="/geoserver/wms"
            layers="Geoachados:view_objeto_achado_map"
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