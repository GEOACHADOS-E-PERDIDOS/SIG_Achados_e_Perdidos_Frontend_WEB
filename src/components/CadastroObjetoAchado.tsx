import { useState, useRef } from "react";

import Select from "react-select";
import type { MultiValue } from "react-select";
import type { CategoriaOption } from "../types/Categoria";

import {
  MapContainer,
  TileLayer,
  Marker,
  LayersControl,
  useMapEvents,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

import "../styles/pop_up.css";
import "../styles/CadastroObjetoAchado.css";

import DataInput from "./DateInput";

import { cadastrarObjetoAchado } from "../services/CadastroObjetoAchadoService";
import Swal from "sweetalert2";

type Props = {
  aberto: boolean;
  onClose: () => void;
  categorias: any[];
  postos: any[];
  onObjetoCadastrado: () => void;
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
        longitudeAchado: lng,
      }));
    },
  });

  return posicao ? <Marker position={posicao} /> : null;
}

export default function CadastroObjetoAchado({
  aberto,
  onClose,
  categorias,
  postos,
  onObjetoCadastrado,
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

  const limparImagens = () => {
    setImagens([]);

    if (inputFileRef.current) {
      inputFileRef.current.value = "";
    }
  };

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setObjeto({
      ...objeto,
      [e.target.name]: e.target.value,
    });
  };

  const handleImagem = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImagens(Array.from(e.target.files || []));
  };

  const handleCategoriasChange = (
    selecionadas: MultiValue<CategoriaOption>
  ) => {
    setCategoriasSelecionadas(selecionadas.map((c) => c.value));
  };

  const handlePostoChange = (selecionado: any) => {
    setPostoSelecionado(selecionado);
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {

    e.preventDefault();

    if (!postoSelecionado) {

      await Swal.fire({
        title: "Atenção",
        text: "Posto de retirada é obrigatório!",
        icon: "warning",
        confirmButtonText: "OK",
        confirmButtonColor: "#f39c12",
      });

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


      await Swal.fire({
        title: "Sucesso",
        text: "Objeto cadastrado com sucesso!",
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#3085d6",
      });


      onObjetoCadastrado();
      limparFormulario();
      onClose();

    } catch (error) {

      console.error(error);

      Swal.fire({
        title: "Erro",
        text: "Erro ao cadastrar objeto",
        icon: "error",
        confirmButtonText: "Fechar",
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

  const postosOptions = postos.map((p) => ({
    value: p.id,
    label: p.nome,
  }));

  const categoriaEletronicosSelecionada =
  categorias.some(
    (cat: any) =>
      cat.id === categoriasSelecionadas[0] &&
      cat.nome === "Eletrônicos"
  );

  const postosFiltrados =
    categoriaEletronicosSelecionada
      ? postos.filter((posto: any) =>
          posto.nome
            .toLowerCase()
            .includes("delegacia")
        )
      : postos;

  return (
    <div className="popup-overlay">
      <div className="popup-box">
        <h2>Cadastrar Objeto Achado</h2>

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
            placeholder="Local onde o objeto foi encontrado"
            onChange={handleChange}
          />

          <Select
            isMulti
            options={categoriasOptions}
            onChange={handleCategoriasChange}
            placeholder="Categorias"
            menuPortalTarget={document.body}
            styles={{
              menuPortal: (base) => ({
                ...base,
                zIndex: 9999,
              }),

              menu: (base) => ({
                ...base,
                zIndex: 9999,
              }),
            }}
          />

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

              <LayersControl position="topright">

                {/* SATÉLITE */}
                <LayersControl.BaseLayer
                  checked
                  name="Satélite"
                >
                  <TileLayer
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                    attribution="Tiles © Esri"
                  />
                </LayersControl.BaseLayer>

                {/* MAPA */}
                <LayersControl.BaseLayer
                  name="Mapa"
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="© OpenStreetMap"
                  />
                </LayersControl.BaseLayer>

              </LayersControl>

              <SelecionadorMapa
                setObjeto={setObjeto}
              />

              {objeto.latitudeAchado &&
                objeto.longitudeAchado && (

                  <Marker
                    position={[
                      Number(objeto.latitudeAchado),
                      Number(objeto.longitudeAchado),
                    ]}
                  />
                )}

            </MapContainer>

          <Select
            options={postosFiltrados.map((posto: any) => ({
              value: posto.id,
              label: posto.nome,
            }))}

            value={postoSelecionado}

            onChange={handlePostoChange}

            placeholder="Selecione o posto de retirada"
          />

          <input
            ref={inputFileRef}
            type="file"
            multiple
            onChange={handleImagem}
          />

          {imagens.length > 0 && (
            <div className="imagens-preview">
              <div className="lista-imagens">

                <button
                  type="button"
                  onClick={limparImagens}
                  className="btn-remover"
                >
                  ×
                </button>

                <p className="titulo-imagens">
                  Imagens selecionadas ({imagens.length})
                </p>

                <ul>
                  {imagens.map((img, i) => (
                    <li key={i} className="item-imagem">
                      📷 {img.name}
                    </li>
                  ))}
                </ul>

              </div>
            </div>
          )}

          <div className="botoes-container">
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