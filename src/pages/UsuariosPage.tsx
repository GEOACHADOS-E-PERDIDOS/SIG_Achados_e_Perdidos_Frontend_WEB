import React, { useEffect, useState } from "react";
import axios from "axios";
import Topbar from "../components/Topbar";
import deleteIcon from "../assets/delete.svg";
import { useNavigate } from "react-router-dom";
import "../styles/Objetos.css"; // você pode criar UsuarioPage.css se quiser

interface Usuario {
  id: number;
  name: string;
  email: string;
  isAdmin: boolean;
  dataCadastro: string;
}

function UsuariosPage() {
  const navigate = useNavigate();
  const [menuAberto, setMenuAberto] = useState(false);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const token = localStorage.getItem("token");

  const irParaHome = () => navigate("/home");
  const sair = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // Buscar todos os usuários
  const listarUsuarios = async () => {
    try {
      const res = await axios.get("http://localhost:8080/usuario", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsuarios(res.data);
    } catch (error) {
      console.error("Erro ao listar usuários:", error);
    }
  };

  // Deletar usuário
  const deletarUsuario = async (id: number) => {
    if (!window.confirm("Deseja realmente deletar este usuário?")) return;

    try {
      await axios.delete(`http://localhost:8080/usuario/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsuarios(usuarios.filter((u) => u.id !== id));
    } catch (error) {
      console.error("Erro ao deletar usuário:", error);
      alert("Não foi possível deletar o usuário.");
    }
  };

  useEffect(() => {
    listarUsuarios();
  }, []);

  return (
    <div className="home-page">
      {/* TOPO */}
      <Topbar />

      {/* LISTA DE USUÁRIOS */}
      <div className="lista-objetos">
        {usuarios.map((user) => (
          <div key={user.id} className="card-objeto">
            <div className="card-text">
              <h3>{user.name}</h3>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Admin:</strong> {user.isAdmin ? "Sim" : "Não"}</p>
              <p><strong>Cadastro:</strong> {new Date(user.dataCadastro).toLocaleDateString("pt-BR")}</p>
            </div>

            {/* Ícone de deletar */}
            <div
              style={{ cursor: "pointer", padding: "5px", fontSize: "20px" }}
              title="Deletar usuário"
              onClick={() => deletarUsuario(user.id)}
            >
              <img src={deleteIcon} alt="Deletar" style={{ width: "24px" }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UsuariosPage;