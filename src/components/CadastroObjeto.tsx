import { useState, useRef } from "react";

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
  useMapEvents,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";
import "../styles/pop_up.css"
import "../styles/CadastroObjeto.css"

type Props = {
  aberto: boolean;
  onClose: () => void;
  categorias: any[];
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

/* ===================== */
/* COMPONENTE */
/* ===================== */

export default function CadastroObjeto({
  aberto,
  onClose,
  categorias,
}: Props) {
  /* ===================== */
  /* STATE */
  /* ===================== */

  const [objeto, setObjeto] = useState({
    nome: "",
    descricao: "",
    enderecoEncontro: "",
    dataPerdido: "",
    latitude: "",
    longitude: "",
  });

  const [dataPerdido, setDataPerdido] = useState<Date | null>(null);

  const [imagens, setImagens] = useState<File[]>([]);
  const inputImagemRef = useRef<HTMLInputElement>(null);

  const [categoriasSelecionadas, setCategoriasSelecionadas] = useState<number[]>([]);

  if (!aberto) return null;

  /* ===================== */
  /* LIMPAR IMAGENS */
  /* ===================== */

  const limparImagens = () => {
    setImagens([]);

    if (inputImagemRef.current) {
      inputImagemRef.current.value = "";
    }
  };

  /* ===================== */
  /* LIMPAR FORM */
  /* ===================== */

  const limparFormulario = () => {
    setObjeto({
      nome: "",
      descricao: "",
      enderecoEncontro: "",
      dataPerdido: "",
      latitude: "",
      longitude: "",
    });

    setDataPerdido(null);
    setCategoriasSelecionadas([]);
    limparImagens();
  };

  /* ===================== */
  /* INPUTS */
  /* ===================== */

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

  /* ===================== */
  /* SUBMIT */
  /* ===================== */

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

      alert("Objeto cadastrado com sucesso!");

      limparFormulario();
      onClose();
    } catch (error) {
      console.error(error);
      alert("Erro ao cadastrar objeto");
    }
  };

  /* ===================== */
  /* OPTIONS */
  /* ===================== */

  const categoriasOptions = categorias.map((cat) => ({
    value: cat.id,
    label: cat.nome,
  }));

  /* ===================== */
  /* UI */
  /* ===================== */

  return (
    <div className="popup-overlay">
      <div className="popup-box">
        <h2>Cadastrar Objeto</h2>

        <form onSubmit={handleSubmit}>
          <input
            name="nome"
            placeholder="Nome"
            onChange={handleChange}
          />

          <input
            name="descricao"
            placeholder="Descrição"
            onChange={handleChange}
          />

          <input
            name="enderecoEncontro"
            placeholder="Região ou ponto de referência do local da perda"
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
          />

          <DataInput
            selected={dataPerdido}
            onChange={setDataPerdido}
          />

          {/* ===================== */}
          {/* MAPA (ÚNICA FONTE DE LAT/LNG) */}
          {/* ===================== */}

          <p>Clique no mapa para marcar a localização:</p>

          <MapContainer
            center={[-15.7939, -47.8828]}
            zoom={13}
            style={{
              height: "300px",
              width: "100%",
              marginBottom: "15px",
            }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

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

          {/* ===================== */}
          {/* IMAGENS */}
          {/* ===================== */}

          <input
            ref={inputImagemRef}
            type="file"
            multiple
            onChange={handleImagens}
          />

          {imagens.length > 0 && (
            <div style={{ marginTop: "10px", position: "relative" }}>
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
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                ×
              </button>

              <p>Imagens selecionadas:</p>

              <ul>
                {imagens.map((img, index) => (
                  <li key={index}>{img.name}</li>
                ))}
              </ul>
            </div>
          )}

          {/* ===================== */}
          {/* BOTÕES */}
          {/* ===================== */}

          <button type="submit">Cadastrar</button>

          <button
            type="button"
            onClick={() => {
              limparFormulario();
              onClose();
            }}
          >
            Fechar
          </button>
        </form>
      </div>
    </div>
  );
}