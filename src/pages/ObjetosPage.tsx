import React, { useEffect, useState } from "react";
import axios from "axios";
import Topbar from "../components/Topbar";
import Select from "react-select";
import "../styles/Objetos.css";
import ObjetoCard from "../components/ObjetoCard";

type CategoriaOption = {
  value: number; // 👈 ID
  label: string;
};

function Objetos() {
  const [objetos, setObjetos] = useState<any[]>([]);
  const [categorias, setCategorias] = useState<CategoriaOption[]>([]);

  const [buscarTermo, setbuscarTermo] = useState("");
  const [buscaData, setBuscaData] = useState("");
  const [categoriaSelecionada, setCategoriaSelecionada] =
    useState<CategoriaOption | null>(null);

  const token = localStorage.getItem("token");

  // =========================
  // LISTAR OBJETOS
  // =========================
  const listarObjetos = async () => {
    const res = await axios.get("http://localhost:8080/objetos", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const objsComImagens = await Promise.all(
      res.data.map(async (obj: any) => {
        if (!obj.caminhoImagem) return { ...obj, imagemUrl: null };

        try {
          const imgRes = await axios.get(
            `http://localhost:8080/uploads/${obj.caminhoImagem}`,
            {
              headers: { Authorization: `Bearer ${token}` },
              responseType: "blob",
            }
          );

          return {
            ...obj,
            imagemUrl: URL.createObjectURL(imgRes.data),
          };
        } catch {
          return { ...obj, imagemUrl: null };
        }
      })
    );

    setObjetos(objsComImagens);
  };

  // =========================
  // LISTAR CATEGORIAS
  // =========================
  const listarCategorias = async () => {
    const res = await axios.get("http://localhost:8080/categorias", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const options = res.data.map((cat: any) => ({
      value: cat.id,     // 👈 ID AQUI
      label: cat.nome,
    }));

    setCategorias(options);
  };

  // =========================
  // BUSCAR
  // =========================
  const handleBuscar = async () => {
    try {
      let url = "http://localhost:8080/objetos/buscar?";

      if (buscarTermo) url += `termo=${buscarTermo}&`;
      if (buscaData) url += `data=${buscaData}&`;
      if (categoriaSelecionada)
        url += `categoria=${categoriaSelecionada.value}&`; // 👈 ID ENVIADO

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const objsComImagens = await Promise.all(
        res.data.map(async (obj: any) => {
          if (!obj.caminhoImagem) return { ...obj, imagemUrl: null };

          try {
            const imgRes = await axios.get(
              `http://localhost:8080/uploads/${obj.caminhoImagem}`,
              {
                headers: { Authorization: `Bearer ${token}` },
                responseType: "blob",
              }
            );

            return {
              ...obj,
              imagemUrl: URL.createObjectURL(imgRes.data),
            };
          } catch {
            return { ...obj, imagemUrl: null };
          }
        })
      );

      setObjetos(objsComImagens);
    } catch (err) {
      console.error("Erro ao buscar objetos:", err);
    }
  };

  const handleLimpar = () => {
    setbuscarTermo("");
    setBuscaData("");
    setCategoriaSelecionada(null);
    listarObjetos();
  };

  const deletarObjeto = async (id: number) => {
    await axios.delete(`http://localhost:8080/objetos/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setObjetos((prev) => prev.filter((obj) => obj.id !== id));
  };

  useEffect(() => {
    listarObjetos();
    listarCategorias();
  }, []);

  return (
    <div className="home-page">
      <Topbar />

      {/* FILTROS */}
      <div className="filtro-container">
        <input
          type="text"
          placeholder="Buscar por termo"
          value={buscarTermo}
          onChange={(e) => setbuscarTermo(e.target.value)}
        />

        <input
          type="date"
          value={buscaData}
          onChange={(e) => setBuscaData(e.target.value)}
        />

        {/* SELECT CATEGORIA (ID) */}
        <div style={{ width: 220 }}>
          <Select
            options={categorias}
            value={categoriaSelecionada}
            onChange={(option) => setCategoriaSelecionada(option)}
            placeholder="Categoria"
            isClearable
          />
        </div>

        <button onClick={handleBuscar}>Buscar</button>
        <button onClick={handleLimpar}>Limpar</button>
      </div>

      {/* LISTA */}
      <div className="lista-objetos">
        {objetos.map((obj) => (
          <ObjetoCard
            key={obj.id}
            obj={obj}
            onDelete={deletarObjeto}
          />
        ))}
      </div>
    </div>
  );
}

export default Objetos;