import { useState, useRef } from "react";

import Select from "react-select";
import type { MultiValue } from "react-select";
import type { CategoriaOption } from "../types/Categoria";

import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

import "../styles/pop_up.css";
import "../styles/CadastroObjeto.css";

import DataInput from "./DateInput";

import { cadastrarObjetoAchado } from "../services/CadastroObjetoAchadoService";

type Props = {
  aberto: boolean;
  onClose: () => void;
  categorias: any[];
  postos: any[];
};

/* ===================== */
/* MAP CLICK */
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
        latitudeAchado: lat,
        longitudeAchado: lng,
      }));
    },
  });

  return posicao ? <Marker position={posicao} /> : null;
}

/* ===================== */
/* COMPONENTE */
/* ===================== */

export default function CadastroObjetoAchado({
  aberto,
  onClose,
  categorias,
  postos,
}: Props) {
  const [objeto, setObjeto] = useState({
    nome: "",
    descricao: "",
    enderecoEncontro: "",
    dataEncontro: "",
    latitudeAchado: "",
    longitudeAchado: "",
  });

  const [dataEncontro, setDataEncontro] = useState<Date | null>(null);

  const [imagens, setImagens] = useState<File[]>([]);
  const inputFileRef = useRef<HTMLInputElement>(null);

  const [categoriasSelecionadas, setCategoriasSelecionadas] = useState<number[]>([]);
  const [postoSelecionado, setPostoSelecionado] = useState<any>(null);

  if (!aberto) return null;

  /* ===================== */
  /* LIMPAR IMAGENS */
  /* ===================== */

  const limparImagens = () => {
    setImagens([]);
    if (inputFileRef.current) inputFileRef.current.value = "";
  };

  /* ===================== */
  /* LIMPAR FORM */
  /* ===================== */

  const limparFormulario = () => {
    setObjeto({
      nome: "",
      descricao: "",
      enderecoEncontro: "",
      dataEncontro: "",
      latitudeAchado: "",
      longitudeAchado: "",
    });

    setDataEncontro(null);
    setCategoriasSelecionadas([]);
    setPostoSelecionado(null);
    limparImagens();
  };

  /* ===================== */
  /* HANDLES */
  /* ===================== */

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setObjeto({
      ...objeto,
      [e.target.name]: e.target.value,
    });
  };

  const handleImagem = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImagens(Array.from(e.target.files || []));
  };

  const handleCategoriasChange = (selecionadas: MultiValue<CategoriaOption>) => {
    setCategoriasSelecionadas(selecionadas.map((c) => c.value));
  };

  const handlePostoChange = (selecionado: any) => {
    setPostoSelecionado(selecionado);
  };

  /* ===================== */
  /* SUBMIT */
  /* ===================== */

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!postoSelecionado) {
      alert("Posto de retirada é obrigatório!");
      return;
    }

    const token = localStorage.getItem("token");

    const dataFormatada = dataEncontro
      ? dataEncontro.toISOString().split("T")[0]
      : "";

    try {
      await cadastrarObjetoAchado({
        objeto: {
          ...objeto,
          dataEncontro: dataFormatada,
        },
        categoriasSelecionadas,
        imagens,
        postoSelecionado,
        token,
      });

      alert("Objeto achado cadastrado com sucesso!");
      limparFormulario();
      onClose();
    } catch (error) {
      console.error(error);
      alert("Erro ao cadastrar objeto achado");
    }
  };

  /* ===================== */
  /* OPTIONS */
  /* ===================== */

  const categoriasOptions = categorias.map((cat) => ({
    value: cat.id,
    label: cat.nome,
  }));

  const postosOptions = postos.map((p) => ({
    value: p.id,
    label: p.nome,
  }));

  /* ===================== */
  /* UI */
  /* ===================== */

  return (
    <div className="popup-overlay">
      <div className="popup-box">
        <h2>Cadastrar Objeto Achado</h2>

        <form onSubmit={handleSubmit}>
          <input name="nome" placeholder="Nome" onChange={handleChange} />
          <input name="descricao" placeholder="Descrição" onChange={handleChange} />
          <input
            name="enderecoEncontro"
            placeholder="Endereço do encontro"
            onChange={handleChange}
          />

          <Select
            isMulti
            options={categoriasOptions}
            onChange={handleCategoriasChange}
            placeholder="Categorias"
          />

          <DataInput selected={dataEncontro} onChange={setDataEncontro} />

          {/* MAPA */}
          <p>Clique no mapa para marcar o local do encontro:</p>

          <MapContainer
            center={[-15.7939, -47.8828]}
            zoom={13}
            style={{ height: "300px", width: "100%", marginBottom: "15px" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <SelecionadorMapa setObjeto={setObjeto} />

            {objeto.latitudeAchado && objeto.longitudeAchado && (
              <Marker
                position={[
                  Number(objeto.latitudeAchado),
                  Number(objeto.longitudeAchado),
                ]}
              />
            )}
          </MapContainer>

          {/* POSTO */}
          <Select
            options={postosOptions}
            value={postoSelecionado}
            onChange={handlePostoChange}
            placeholder="Selecione o posto de retirada"
          />

          {/* IMAGENS */}
          <input
            ref={inputFileRef}
            type="file"
            multiple
            onChange={handleImagem}
          />

          {/* PREVIEW COM X */}
          {imagens.length > 0 && (
            <div
              style={{
                marginTop: "10px",
                position: "relative",
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "8px",
              }}
            >
              <button
                type="button"
                onClick={limparImagens}
                title="Limpar imagens"
                style={{
                  position: "absolute",
                  top: "6px",
                  right: "6px",
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

              <strong>Imagens selecionadas:</strong>

              <ul>
                {imagens.map((img, i) => (
                  <li key={i}>{img.name}</li>
                ))}
              </ul>
            </div>
          )}

          {/* BOTÕES */}
          <div style={{ display: "flex", gap: 10 }}>
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
          </div>
        </form>
      </div>
    </div>
  );
}