import {
  MapContainer,
  TileLayer,
  WMSTileLayer,
  LayersControl,
  Marker
} from "react-leaflet";

import { useState } from "react";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { CircleMarker, Tooltip } from "react-leaflet";
import "../styles/CadastroObjeto.css"

import ClickMapa from "./ClickMapa";

const { Overlay, BaseLayer } = LayersControl;

function Mapa() {

  type ObjetoMapa = {
    id: number;
    nome: string;
    descricao: string;
    latitudeEncontro: number;
    longitudeEncontro: number;
  };


  const [busca, setBusca] = useState("");
  const [resultadoBusca, setResultadoBusca] = useState<ObjetoMapa[]>([]);

  const highlightIcon = new L.Icon({
    iconUrl: "https://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
    iconSize: [32, 32]
  });

  const buscarObjetos = async () => {

  const token = localStorage.getItem("token");

  try {

    const res = await axios.get(
      "http://localhost:8080/objetos/buscar",
      {
        params: {
          termo: busca
        },

        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    setResultadoBusca(res.data);

  } catch (err) {
    console.error("Erro ao buscar objetos:", err);
  }
};

  return (
    <MapContainer
      center={[-15.7939, -47.8828]}
      zoom={14}
      style={{ height: "100%", width: "100%" }}
    >

      <div
          style={{
            position: "absolute",
            zIndex: 1000,
            top: 200,
            right: 10,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "6px",
            background: "white",
            padding: "6px",
            borderRadius: "6px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.2)"
          }}
        >
          <input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar objeto..."
            style={{
              width: "220px",
              padding: "6px",
              border: "1px solid #ccc",
              borderRadius: "4px"
            }}
          />

          <button
            onClick={buscarObjetos}
            style={{
              padding: "6px 10px",
              fontSize: "12px",
              cursor: "pointer"
            }}
          >
            Buscar
          </button>

          <button
            onClick={() => {
              setBusca("");
              setResultadoBusca([]);
            }}
            style={{
              padding: "6px 10px",
              fontSize: "12px",
              cursor: "pointer"
            }}
          >
            Limpar
          </button>
        </div>

      {/* HIGHLIGHT DOS RESULTADOS */}
      {resultadoBusca
        .filter(obj => obj.latitudeEncontro != null && obj.longitudeEncontro != null)
        .map((obj) => (
          <CircleMarker
            key={`c-${obj.id}`}
            center={[obj.latitudeEncontro, obj.longitudeEncontro]}
            radius={45}
            pathOptions={{
              color: "#ffcc00",
              weight: 2,
              fillColor: "#ffcc00",
              fillOpacity: 0.15
            }}
          >
            <Tooltip
                direction="top"
                permanent
                offset={[0, -10]}
                className="map-label"
              >
                {obj.nome}
              </Tooltip>
          </CircleMarker>
        ))}

      <LayersControl position="topright">

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
            layers="Geoachados:view_posto_retirada_map"
            format="image/png"
            transparent={true}
            version="1.1.0"
          />
        </Overlay>

        <Overlay checked name="Objetos Perdidos">
          <WMSTileLayer
            url="/geoserver/wms"
            layers="Geoachados:view_objeto_perdido_map"
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

      <ClickMapa/>

    </MapContainer>
  );
}

export default Mapa;