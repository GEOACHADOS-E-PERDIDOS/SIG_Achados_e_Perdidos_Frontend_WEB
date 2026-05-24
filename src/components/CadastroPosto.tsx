import { useState, useRef} from "react";

import CadastroPostoService
from "../services/CadastroPostoService";
import Swal from "sweetalert2";

import {
  MapContainer,
  TileLayer,
  Marker,
  LayersControl,
  useMapEvents,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

type Props = {
  aberto: boolean;
  onClose: () => void;

  onPostoCadastrado: () => void;
};

const { BaseLayer } = LayersControl;

const telefoneRegex = /^[0-9]{8,9}$/;

/* ====================================== */
/* MAPA */
/* ====================================== */

function SelecionadorMapa({
  setPosto
}: any) {

  const [posicao, setPosicao] =
    useState<any>(null);

  useMapEvents({

    click(e) {

      const lat =
        e.latlng.lat;

      const lng =
        e.latlng.lng;

      setPosicao([lat, lng]);

      setPosto((prev: any) => ({
        ...prev,
        latitude: lat,
        longitude: lng,
      }));
    },
  });

  return posicao
    ? <Marker position={posicao} />
    : null;
}

/* ====================================== */
/* COMPONENTE */
/* ====================================== */

export default function CadastroPosto({
  aberto,
  onClose,
  onPostoCadastrado
}: Props) {

  const [posto, setPosto] =
    useState({

      nome: "",

      endereco: "",

      telefone: "",

      email: "",

      latitude: "",

      longitude: ""
    });

  const [imagens, setImagens] = useState<File[]>([]);

  const inputImagemRef = useRef<HTMLInputElement>(null);


  if (!aberto) return null;

  /* ====================================== */
  /* INPUTS */
  /* ====================================== */

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    setPosto({
      ...posto,
      [e.target.name]:
        e.target.value
    });
  };

  const handleImagens = (
  e: React.ChangeEvent<HTMLInputElement>
) => {

  const files = Array.from(
    e.target.files || []
  );

  setImagens(files);
};

const limparImagens = () => {

  setImagens([]);

  if (inputImagemRef.current) {

    inputImagemRef.current.value = "";
  }
};

  /* ====================================== */
  /* SUBMIT */
  /* ====================================== */

  const handleSubmit = async (
    e: React.FormEvent
  ) => {

  e.preventDefault();

  const telefoneRegex = /^[0-9]{8,9}$/;

  if (!telefoneRegex.test(posto.telefone)) {

    Swal.fire({
      title: "Telefone inválido",
      text: "O telefone deve possuir 8 ou 9 dígitos.",
      icon: "warning",
      confirmButtonColor: "#d33",
    });

    return;
  }

  try {

    await CadastroPostoService
      .cadastrarPosto({

          nome: posto.nome,

          endereco: posto.endereco,

          telefone: posto.telefone,

          email: posto.email,

          latitude: parseFloat(
            String(posto.latitude)
          ),

          longitude: parseFloat(
            String(posto.longitude)
          ),

          imagens
        });

    await Swal.fire({
      title: "Sucesso",
      text: "Posto cadastrado com sucesso!",
      icon: "success",
      confirmButtonText: "OK",
      confirmButtonColor: "#3085d6",
    });

      onPostoCadastrado();
      
      onClose();

  } catch (error) {

    console.error(error);

    Swal.fire({
      title: "Erro",
      text: "Erro ao cadastrar posto",
      icon: "error",
      confirmButtonText: "Fechar",
      confirmButtonColor: "#d33",
    });
  }
};

  /* ====================================== */
  /* UI */
  /* ====================================== */

  return (

    <div className="popup-overlay">

      <div className="popup-box">

        <h2>
          Cadastrar Posto
        </h2>

        <form onSubmit={handleSubmit}>

          <input
            name="nome"
            placeholder="Nome"
            onChange={handleChange}
          />

          <input
            name="endereco"
            placeholder="Endereço"
            onChange={handleChange}
          />

          <input
            name="telefone"
            placeholder="Telefone"
            onChange={handleChange}
          />

          <input
            name="email"
            placeholder="Email"
            onChange={handleChange}
          />

          {/* ====================================== */}
          {/* MAPA */}
          {/* ====================================== */}

          <p>
            Clique no mapa para
            marcar a localização:
          </p>

          <MapContainer
            center={[-15.7939, -47.8828]}
            zoom={13}

            style={{
              height: "300px",
              width: "100%",
              marginBottom: "15px",
            }}
          >

            <LayersControl
              position="topright"
            >

              {/* SATÉLITE */}
              <BaseLayer
                checked
                name="Satélite"
              >
                <TileLayer
                  url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                  attribution="Tiles © Esri"
                />
              </BaseLayer>

              {/* MAPA */}
              <BaseLayer
                name="Mapa"
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="© OpenStreetMap"
                />
              </BaseLayer>

            </LayersControl>

            <SelecionadorMapa
              setPosto={setPosto}
            />

            {posto.latitude &&
              posto.longitude && (

                <Marker
                  position={[
                    Number(posto.latitude),
                    Number(posto.longitude),
                  ]}
                />
              )}

          </MapContainer>

          <input
            ref={inputImagemRef}
            type="file"
            multiple
            onChange={handleImagens}
          />

          {imagens.length > 0 && (

            <div
              style={{
                marginTop: "10px",
                position: "relative"
              }}
            >

              <button
                type="button"
                onClick={limparImagens}
                style={{
                  position: "absolute",
                  top: "-8px",
                  right: "-8px",
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%",
                  border: "none",
                  background: "#e53935",
                  color: "white",
                  cursor: "pointer",
                  fontWeight: "bold"
                }}
              >
                ×
              </button>

              <p>Imagens selecionadas:</p>

              <ul>

                {imagens.map((img, index) => (

                  <li key={index}>
                    {img.name}
                  </li>

                ))}

              </ul>

            </div>
          )}

          {/* ====================================== */}
          {/* BOTÕES */}
          {/* ====================================== */}

          <button type="submit">
            Cadastrar
          </button>

          <button
            type="button"
            onClick={onClose}
          >
            Fechar
          </button>

        </form>

      </div>

    </div>
  );
}