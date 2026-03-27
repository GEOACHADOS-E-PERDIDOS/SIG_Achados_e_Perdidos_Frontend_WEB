import React, { useEffect, useState } from "react";
import axios from "axios";

interface Objeto {
  id: number;
  nome: string;
  descricao: string;
  caminhoImagem: string;
}

function Achados() {
  const [objetos, setObjetos] = useState<Objeto[]>([]);
  const [loading, setLoading] = useState(true);

  const BASE_URL = "http://localhost:8080/objetos"; // URL do backend
  const token = localStorage.getItem("token"); // ou onde você armazenou o token

  useEffect(() => {
    if (!token) {
      alert("Usuário não autenticado!");
      setLoading(false);
      return;
    }

    axios.get(`${BASE_URL}objetos/achados`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => {
      setObjetos(res.data);
      setLoading(false);
    })
    .catch((err) => {
      console.error(err);
      setLoading(false);
    });
  }, [token]);

  if (loading) return <p>Carregando objetos...</p>;

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <h1>Objetos Achados</h1>
      {objetos.length === 0 && <p>Nenhum objeto encontrado.</p>}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {objetos.map((obj) => (
          <div key={obj.id} style={{
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "10px",
            width: "200px",
            textAlign: "center"
          }}>
            <img 
              src={`${BASE_URL}${obj.caminhoImagem}`} 
              alt={obj.nome} 
              style={{ width: "100%", height: "150px", objectFit: "cover", borderRadius: "4px" }}
            />
            <h3>{obj.nome}</h3>
            <p>{obj.descricao}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Achados;