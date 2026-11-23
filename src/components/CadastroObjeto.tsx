
import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";

import Select from "react-select";
import type { MultiValue } from "react-select";

import { cadastrarObjeto } from "../services/CadastroObjetoService";
import type { CategoriaOption } from "../types/Categoria";

import DataInput from "./DateInput";
import "../styles/CadastroObjeto.css";

import {
  MapContainer,
  TileLayer,
  Marker,
  LayersControl,
  useMapEvents,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";
import "../styles/pop_up.css";

import Swal from "sweetalert2";

type Props = {
  aberto: boolean;
  onClose: () => void;
  categorias: any[];
  onObjetoCadastrado: () => void;
};

/* ===================== */
/* MAPA */
/* ===================== */

function SelecionadorMapa({ setObjeto }: any) {
  const [posicao, setPosicao] = useState<any>(null);

  useMapEvents({
    click(e) {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;

      setPosicao([lat, lng]);

      setObjeto((prev: any) => ({
        ...prev,
        latitude: lat,
        longitude: lng,
      }));
    },
  });

  return posicao ? <Marker position={posicao} /> : null;
}

export default function CadastroObjeto({
  aberto,
  onClose,
  categorias,
  onObjetoCadastrado,
}: Props) {
  const { t, i18n } = useTranslation();

  const [objeto, setObjeto] = useState({
    nome: "",
    descricao: "",
    enderecoPerdido: "",
    dataPerdido: "",
    latitude: "",
    longitude: "",
  });

  const [dataPerdido, setDataPerdido] = useState<Date | null>(null);

  const [imagens, setImagens] = useState<File[]>([]);
  const inputImagemRef = useRef<HTMLInputElement>(null);

  const [categoriasSelecionadas, setCategoriasSelecionadas] = useState<number[]>([]);

  if (!aberto) return null;

  const limparImagens = () => {
    setImagens([]);

    if (inputImagemRef.current) {
      inputImagemRef.current.value = "";
    }
  };

  const limparFormulario = () => {
    setObjeto({
      nome: "",
      descricao: "",
      enderecoPerdido: "",
      dataPerdido: "",
      latitude: "",
      longitude: "",
    });

    setDataPerdido(null);
    setCategoriasSelecionadas([]);
    limparImagens();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setObjeto({
      ...objeto,
      [e.target.name]: e.target.value,
    });
  };

  const handleImagens = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImagens(files);
  };

  const handleCategoriasChange = (
    selecionadas: MultiValue<CategoriaOption>
  ) => {
    setCategoriasSelecionadas(selecionadas.map((cat) => cat.value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    const dataFormatada = dataPerdido
      ? dataPerdido.toISOString().split("T")[0]
      : "";

    try {
      await cadastrarObjeto({
        objeto: {
          ...objeto,
          dataPerdido: dataFormatada,
        },
        categoriasSelecionadas,
        imagens,
        token,
      });

      await Swal.fire({
        title: t("cadastroObjeto.sucesso"),
        text: t("cadastroObjeto.sucessoTexto"),
        icon: "success",
        confirmButtonText: t("cadastroObjeto.ok"),
        confirmButtonColor: "#3085d6",
      });

      onObjetoCadastrado();

      limparFormulario();

      onClose();
    } catch (error) {
      console.error(error);

      Swal.fire({
        title: t("cadastroObjeto.erro"),
        text: t("cadastroObjeto.erroTexto"),
        icon: "error",
        confirmButtonText: t("cadastroObjeto.fechar"),
        confirmButtonColor: "#d33",
        customClass: {
          popup: "swal-popup",
        },
      });
    }
  };

  const categoriasOptions = categorias.map((cat) => ({
    value: cat.id,
    label: cat.nome,
  }));

  return (
    <div className="popup-overlay">
      <div className="popup-box">
        <h2>{t("cadastroObjeto.titulo")}</h2>

        <form onSubmit={handleSubmit}>
          <input
            autoComplete="off"
            name="nome"
            placeholder={t("cadastroObjeto.nome")}
            onChange={handleChange}
          />

          <input
            autoComplete="off"
            name="descricao"
            placeholder={t("cadastroObjeto.descricao")}
            onChange={handleChange}
          />

          <input
            autoComplete="off"
            name="enderecoPerdido"
            placeholder={t("cadastroObjeto.enderecoPerdido")}
            onChange={handleChange}
          />

          <Select
            isMulti
            options={categoriasOptions}
            onChange={handleCategoriasChange}
            menuPortalTarget={document.body}
            styles={{
              menuPortal: (base) => ({
                ...base,
                zIndex: 9999,
              }),
            }}
            placeholder={t("cadastroObjeto.categorias")}
            noOptionsMessage={() =>
              i18n.language === "en-US"
                ? "No options found"
                : "Nenhuma opção encontrada"
            }
          />

          <DataInput
            selected={dataPerdido}
            onChange={setDataPerdido}
          />

          <p className="campo-obrigatorio-info">
            <span>*</span> {t("cadastroObjeto.camposObrigatorios")}
          </p>

          <p>{t("cadastroObjeto.instrucaoMapa")}</p>

          <MapContainer
            center={[-15.7939, -47.8828]}
            zoom={13}
            className="map-container"
          >
            <LayersControl position="topright">
              <LayersControl.BaseLayer
                checked
                name={t("cadastroObjeto.satelite")}
              >
                <TileLayer
                  url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                  attribution="Tiles © Esri"
                />
              </LayersControl.BaseLayer>

              <LayersControl.BaseLayer
                name={t("cadastroObjeto.mapa")}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="© OpenStreetMap"
                />
              </LayersControl.BaseLayer>
            </LayersControl>

            <SelecionadorMapa setObjeto={setObjeto} />

            {objeto.latitude && objeto.longitude && (
              <Marker
                position={[
                  Number(objeto.latitude),
                  Number(objeto.longitude),
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
            aria-label={t("cadastroObjeto.selecionarImagens")}
          />

          {imagens.length > 0 && (
            <div className="imagens-preview">
              <div className="lista-imagens">
                <button
                  type="button"
                  onClick={limparImagens}
                  className="btn-remover"
                  aria-label={t("cadastroObjeto.removerImagens")}
                >
                  ×
                </button>

                <p className="titulo-imagens">
                  {t("cadastroObjeto.imagensSelecionadas", {
                    quantidade: imagens.length,
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
            {t("cadastroObjeto.cadastrar")}
          </button>

          <button
            type="button"
            onClick={() => {
              limparFormulario();
              onClose();
            }}
          >
            {t("cadastroObjeto.fechar")}
          </button>
        </form>
      </div>
    </div>
  );
}
