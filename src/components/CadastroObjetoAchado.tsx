import { useState } from "react";

import Select from "react-select";

import type { MultiValue } from "react-select";
import type {  CategoriaOption } from "../types/Categoria";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "../styles/pop_up.css"


import DataInput from "./DateInput";

import {
  cadastrarObjetoAchado
} from "../services/CadastroObjetoAchadoService";

import "../styles/CadastroObjeto.css";

type Props = {
  aberto: boolean;
  onClose: () => void;
  categorias: any[];
  postos: any[];
};

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
        longitudeAchado: lng
      }));
    }
  });

  return posicao ? <Marker position={posicao} /> : null;
}



export default function CadastroObjetoAchado({
  aberto,
  onClose,
  categorias,
  postos
}: Props) {

  const [objeto, setObjeto] = useState({
    nome: "",
    descricao: "",
    enderecoEncontro: "",
    dataEncontro: "",
    latitudeAchado: "",
    longitudeAchado: ""
  });

  const [dataEncontro, setDataEncontro] =
    useState<Date | null>(null);

  const [imagem, setImagem] =
    useState<File | null>(null);

  const [categoriasSelecionadas,
    setCategoriasSelecionadas] =
    useState<number[]>([]);

  const [postoSelecionado,
    setPostoSelecionado] =
    useState<any>(null);

  if (!aberto) return null;

  const limparFormulario = () => {

    setObjeto({
      nome: "",
      descricao: "",
      enderecoEncontro: "",
      dataEncontro: "",
      latitudeAchado: "",
      longitudeAchado: ""
    });

    setDataEncontro(null);

    setImagem(null);

    setCategoriasSelecionadas([]);

    setPostoSelecionado(null);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    setObjeto({
      ...objeto,
      [e.target.name]: e.target.value
    });
  };

  const handleImagem = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    if (e.target.files?.[0]) {
      setImagem(e.target.files[0]);
    }
  };

  const handleCategoriasChange = (
    selecionadas: MultiValue<CategoriaOption>
  ) => {

    const ids = selecionadas.map(
      (cat) => cat.value
    );

    setCategoriasSelecionadas(ids);
  };

  const handlePostoChange = (
    selecionado: any
  ) => {

    setPostoSelecionado(selecionado);
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {

    e.preventDefault();

    if (!postoSelecionado) {

      alert(
        "Posto de retirada é obrigatório!"
      );

      return;
    }

    const token =
      localStorage.getItem("token");

    const dataFormatada =
      dataEncontro
        ? dataEncontro
            .toISOString()
            .split("T")[0]
        : "";

    try {

      await cadastrarObjetoAchado({
        objeto: {
          ...objeto,
          dataEncontro: dataFormatada
        },

        categoriasSelecionadas,

        imagem,

        postoSelecionado,

        token,
      });

      alert(
        "Objeto achado cadastrado com sucesso!"
      );

      limparFormulario();

      onClose();

    } catch (error) {

      console.error(error);

      alert(
        "Erro ao cadastrar objeto achado"
      );
    }
  };

  const categoriasOptions =
    categorias.map((cat) => ({
      value: cat.id,
      label: cat.nome
    }));

  const postosOptions =
    postos.map((p) => ({
      value: p.id,
      label: p.nome,
      latitude: p.latitude,
      longitude: p.longitude
    }));

  return (
    <div className="popup-overlay">

      <div className="popup-box">

        <h2>
          Cadastrar Objeto Achado
        </h2>

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
            placeholder="Endereço do encontro"
            onChange={handleChange}
          />

          {/* Categorias */}
          <Select
            isMulti
            options={categoriasOptions}
            onChange={handleCategoriasChange}
            placeholder="Categorias"
          />

          {/* Data */}
          <DataInput
            selected={dataEncontro}
            onChange={setDataEncontro}
          />

          <p>Clique no mapa para marcar o local do encontro:</p>

          <MapContainer
            center={[-15.7939, -47.8828]}
            zoom={13}
            style={{
              height: "300px",
              width: "100%",
              marginBottom: "15px"
            }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <SelecionadorMapa setObjeto={setObjeto} />

            {objeto.latitudeAchado && objeto.longitudeAchado && (
              <Marker
                position={[
                  Number(objeto.latitudeAchado),
                  Number(objeto.longitudeAchado)
                ]}
              />
            )}
          </MapContainer>

          {/* Posto de retirada */}
          <Select
            options={postosOptions}
            value={postoSelecionado}
            onChange={handlePostoChange}
            placeholder="Selecione o posto de retirada"
          />

          <input
            type="file"
            onChange={handleImagem}
          />

          <div
            style={{
              display: "flex",
              gap: 10
            }}
          >

            <button type="submit">
              Cadastrar
            </button>

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