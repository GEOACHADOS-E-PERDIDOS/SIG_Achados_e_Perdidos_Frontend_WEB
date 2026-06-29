import {
  MapContainer,
  TileLayer,
  WMSTileLayer,
  LayersControl,
  CircleMarker,
  Tooltip,
  useMapEvents
} from "react-leaflet";

import { useState, useEffect } from "react";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import "../styles/CadastroObjeto.css";

import ClickMapa from "./ClickMapa";

const { Overlay, BaseLayer } = LayersControl;

type ObjetoMapa = {
  id: number;
  nome: string;
  descricao: string;
  latitudeEncontro: number;
  longitudeEncontro: number;
  status?: string;
};

type PostoMapa = {
  id: number;
  nome: string;
  endereco: string;
  latitude: number;
  longitude: number;
};

type Props = {
  refreshKey: number;
};

/* ===================================================== */
/* CAPTURA EVENTOS DAS LAYERS */
/* ===================================================== */

function LayerEvents({
  setMostrarPerdidos,
  setMostrarAchados,
  limparResultados,
}: any) {

  useMapEvents({

    overlayadd(e: any) {

      if (e.name === "Objetos Perdidos") {
        setMostrarPerdidos(true);
      }

      if (e.name === "Objeto Achado") {
        setMostrarAchados(true);
      }
    },

    overlayremove(e: any) {

      if (e.name === "Objetos Perdidos") {

        setMostrarPerdidos(false);

        limparResultados("PERDIDO");
      }

      if (e.name === "Objeto Achado") {

        setMostrarAchados(false);

        limparResultados("DISPONIVEL");
      }
    },
  });

  return null;
}

function Mapa({ refreshKey }: Props) {

  const [busca, setBusca] = useState("");

  const [resultadoBusca, setResultadoBusca] =
    useState<ObjetoMapa[]>([]);

  const [resultadoBuscaPostos, setResultadoBuscaPostos] =
    useState<PostoMapa[]>([])

  /* ===================================================== */
  /* CONTROLE DE LAYERS */
  /* ===================================================== */

  const [mostrarPerdidos, setMostrarPerdidos] =
    useState(true);

  const [mostrarAchados, setMostrarAchados] =
    useState(true);

  /* ===================================================== */
  /* BUSCA */
  /* ===================================================== */

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

      

      /* ===================================== */
      /* FILTRA CONFORME LAYERS ATIVAS */
      /* ===================================== */

      const objetosFiltrados = res.data.filter(
        (obj: ObjetoMapa) => {

          if (
            obj.status === "PERDIDO" &&
            !mostrarPerdidos
          ) {
            return false;
          }

          if (
            obj.status === "DISPONIVEL" &&
            !mostrarAchados
          ) {
            return false;
          }

          return true;
        }
      );

      setResultadoBusca(objetosFiltrados);

    } catch (err) {

      console.error(
        "Erro ao buscar objetos:",
        err
      );
    }
  };

  const buscarPostos = async () => {

  const token = localStorage.getItem("token");

  try {

    const res = await axios.get(
      "http://localhost:8080/postos",
      {
        params: {
          termo: busca
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    setResultadoBuscaPostos(res.data);

  } catch (err) {

    console.error("Erro ao buscar postos:", err);
  }
};

const buscar = async () => {
  await Promise.all([
    buscarObjetos(),
    buscarPostos()
  ]);
};

  /* ===================================================== */
  /* ESCONDER RESULTADOS AO DESLIGAR LAYER */
  /* ===================================================== */

  const limparResultados = (
    tipo: string
  ) => {

    setResultadoBusca((prev) =>
      prev.filter((obj) => {

        if (
          tipo === "PERDIDO"
        ) {
          return obj.status !== "PERDIDO";
        }

        if (
          tipo === "DISPONIVEL"
        ) {
          return obj.status !== "DISPONIVEL";
        }

        return true;
      })
    );
  };

  /* ===================================================== */
  /* FILTRAGEM AUTOMÁTICA */
  /* ===================================================== */

  useEffect(() => {

    setResultadoBusca((prev) =>
      prev.filter((obj) => {

        if (
          obj.status === "PERDIDO" &&
          !mostrarPerdidos
        ) {
          return false;
        }

        if (
          obj.status === "DISPONIVEL" &&
          !mostrarAchados
        ) {
          return false;
        }

        return true;
      })
    );

  }, [
    mostrarPerdidos,
    mostrarAchados
  ]);

  return (

    <MapContainer
      center={[-15.7939, -47.8828]}
      zoom={14}
      style={{
        height: "100%",
        width: "100%"
      }}
    >

      {/* ===================================================== */}
      {/* EVENTOS DE LAYERS */}
      {/* ===================================================== */}

      <LayerEvents
        setMostrarPerdidos={
          setMostrarPerdidos
        }

        setMostrarAchados={
          setMostrarAchados
        }

        limparResultados={
          limparResultados
        }
      />

      {/* ===================================================== */}
      {/* BLOCO DE BUSCA */}
      {/* ===================================================== */}

      <div
        style={{
          position: "absolute",

          zIndex: 1000,

          top: 20,

          left: "50%",

          transform:
            "translateX(-50%)",

          display: "flex",

          flexDirection: "row",

          alignItems: "center",

          gap: "10px",

          background: "white",

          padding: "20px",

          borderRadius: "10px",

          boxShadow:
            "0 2px 6px rgba(0,0,0,0.2)"
        }}
      >

        <input
						autoComplete="off"
          value={busca}

          onChange={(e) =>
            setBusca(e.target.value)
          }

          onKeyDown={(e) => {

            if (e.key === "Enter") {

              buscar();
            }
          }}

          placeholder="Buscar objeto..."

          style={{

            width: "220px",

            padding: "10px",

            border:
              "1px solid #ccc",

            borderRadius: "4px"
          }}
        />

        <button
          onClick={buscar}

          style={{

            padding: "6px 10px",

            fontSize: "15px",

            cursor: "pointer"
          }}
        >
          Buscar
        </button>

        <button
          onClick={() => {

            setBusca("");

            setResultadoBusca([]);
            setResultadoBuscaPostos([]);
          }}

          style={{

            padding: "6px 10px",

            fontSize: "15px",

            cursor: "pointer"
          }}
        >
          Limpar
        </button>

      </div>

      {/* ===================================================== */}
      {/* RESULTADOS DA BUSCA */}
      {/* ===================================================== */}

      {resultadoBusca

        .filter(
          (obj) =>
            obj.latitudeEncontro != null &&
            obj.longitudeEncontro != null
        )

        .map((obj) => (

          <CircleMarker
            key={`c-${obj.id}`}

            center={[
              obj.latitudeEncontro,
              obj.longitudeEncontro
            ]}

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

        {resultadoBuscaPostos
  .filter(
    (posto) =>
      posto.latitude != null &&
      posto.longitude != null
  )
  .map((posto) => (

    <CircleMarker
      key={`p-${posto.id}`}
      center={[
        posto.latitude,
        posto.longitude
      ]}
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
        {posto.nome}
      </Tooltip>
    </CircleMarker>

))}

      {/* ===================================================== */}
      {/* LAYERS */}
      {/* ===================================================== */}

      <LayersControl position="topright">

        <BaseLayer
          checked
          name="Satélite"
        >
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

        {/* POSTOS */}

        <Overlay
          checked
          name="Postos de Retirada"
        >
          <WMSTileLayer
            key={`postos-${refreshKey}`}
            url="/geoserver/wms"

            layers="Geoachados:view_posto_retirada_map"

            format="image/png"

            transparent={true}

            version="1.1.0"
          />
        </Overlay>

        {/* OBJETOS PERDIDOS */}

        <Overlay
          checked
          name="Objetos Perdidos"
        >
          <WMSTileLayer
            key={`perdidos-${refreshKey}`}
            url="/geoserver/wms"

            layers="Geoachados:view_objeto_perdido_map"

            format="image/png"

            transparent={true}

            version="1.1.0"
            
          />
        </Overlay>

        {/* OBJETOS ACHADOS */}

        <Overlay
          checked
          name="Objeto Achado"
        >
          <WMSTileLayer
            key={`achados-${refreshKey}`}
            url="/geoserver/wms"

            layers="Geoachados:view_objeto_achado_map"

            format="image/png"

            transparent={true}

            version="1.1.0"
          />
        </Overlay>

      </LayersControl>

      <ClickMapa />

    </MapContainer>
  );
}

export default Mapa;