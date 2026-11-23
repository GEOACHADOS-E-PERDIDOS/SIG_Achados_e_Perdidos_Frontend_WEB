
import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";

import CadastroPostoService from "../services/CadastroPostoService";
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

function SelecionadorMapa({ setPosto }: any) {
  const [posicao, setPosicao] = useState<any>(null);

  useMapEvents({
    click(e) {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;

      setPosicao([lat, lng]);

      setPosto((prev: any) => ({
        ...prev,
        latitude: lat,
        longitude: lng,
      }));
    },
  });

  return posicao ? <Marker position={posicao} /> : null;
}

export default function CadastroPosto({
  aberto,
  onClose,
  onPostoCadastrado
}: Props) {
  const { t, i18n } = useTranslation();

  const [posto, setPosto] = useState({
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPosto({
      ...posto,
      [e.target.name]: e.target.value
    });
  };

  const handleImagens = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files || []);
    setImagens(files);
  };

  const limparImagens = () => {
    setImagens([]);

    if (inputImagemRef.current) {
      inputImagemRef.current.value = "";
    }
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    const telefoneRegex = /^[0-9]{8,9}$/;

    if (!telefoneRegex.test(posto.telefone)) {
      Swal.fire({
        title: t("cadastroPosto.telefoneInvalido"),
        text: t("cadastroPosto.telefoneInvalidoTexto"),
        icon: "warning",
        confirmButtonColor: "#d33",
      });

      return;
    }

    try {
      await CadastroPostoService.cadastrarPosto({
        nome: posto.nome,
        endereco: posto.endereco,
        telefone: posto.telefone,
        email: posto.email,
        latitude: parseFloat(String(posto.latitude)),
        longitude: parseFloat(String(posto.longitude)),
        imagens
      });

      await Swal.fire({
        title: t("cadastroPosto.sucesso"),
        text: t("cadastroPosto.sucessoTexto"),
        icon: "success",
        confirmButtonText: t("cadastroPosto.ok"),
        confirmButtonColor: "#3085d6",
      });

      onPostoCadastrado();
      limparImagens();
      onClose();

    } catch (error) {
      console.error(error);

      Swal.fire({
        title: t("cadastroPosto.erro"),
        text: t("cadastroPosto.erroTexto"),
        icon: "error",
        confirmButtonText: t("cadastroPosto.fechar"),
        confirmButtonColor: "#d33",
      });
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-box">
        <h2>{t("cadastroPosto.titulo")}</h2>

        <form onSubmit={handleSubmit}>
          <input
            autoComplete="off"
            name="nome"
            placeholder={t("cadastroPosto.nome")}
            onChange={handleChange}
          />

          <input
            autoComplete="off"
            name="endereco"
            placeholder={t("cadastroPosto.endereco")}
            onChange={handleChange}
          />

          <input
            autoComplete="off"
            name="telefone"
            placeholder={t("cadastroPosto.telefone")}
            onChange={handleChange}
          />

          <input
            autoComplete="off"
            name="email"
            placeholder={t("cadastroPosto.email")}
            onChange={handleChange}
          />

          <p className="campo-obrigatorio-info">
            <span>*</span> {t("cadastroPosto.camposObrigatorios")}
          </p>

          <p>
            {t("cadastroPosto.instrucaoMapa")}
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
            <LayersControl position="topright">
              <BaseLayer
                checked
                name={t("cadastroPosto.satelite")}
              >
                <TileLayer
                  url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                  attribution="Tiles © Esri"
                />
              </BaseLayer>

              <BaseLayer name={t("cadastroPosto.mapa")}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="© OpenStreetMap"
                />
              </BaseLayer>
            </LayersControl>

            <SelecionadorMapa setPosto={setPosto} />

            {posto.latitude && posto.longitude && (
              <Marker
                position={[
                  Number(posto.latitude),
                  Number(posto.longitude),
                ]}
              />
            )}
          </MapContainer>

          <input
            autoComplete="off"
            ref={inputImagemRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleImagens}
          />

          {imagens.length > 0 && (
            <div className="imagens-preview">
              <div className="lista-imagens">
                <button
                  type="button"
                  onClick={limparImagens}
                  className="btn-remover"
                  title={t("cadastroPosto.removerImagens")}
                  aria-label={t("cadastroPosto.removerImagens")}
                >
                  ×
                </button>

                <p className="titulo-imagens">
                  {t("cadastroPosto.imagensSelecionadas", {
                    quantidade: imagens.length
                  })}
                </p>

                <ul>
                  {imagens.map((img, index) => (
                    <li key={index} className="item-imagem">
                      📷 {img.name}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <button type="submit">
            {t("cadastroPosto.cadastrar")}
          </button>

          <button
            type="button"
            onClick={() => {
              limparImagens();
              onClose();
            }}
          >
            {t("cadastroPosto.fechar")}
          </button>
        </form>
      </div>
    </div>
  );
}
