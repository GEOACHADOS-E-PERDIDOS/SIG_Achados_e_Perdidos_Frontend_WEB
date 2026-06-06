import { useState } from "react";
import "../styles/UsuarioCard.css";
import { tornarAdmin, resetarSenha, tornarPosto } from "../services/UsuarioCardService";
import Swal from "sweetalert2";

type Usuario = {
  id: number;
  nome: string;
  email: string;
  role: string;
  dataCadastro?: string;
};

type Props = {
  usuario: Usuario;
  onActionSuccess: () => void; // 1. DECLARE A NOVA PROP AQUI
};

export default function UsuarioCard({ usuario, onActionSuccess }: Props) { // 2. CAPTURE ELA AQUI
  const [popupAberto, setPopupAberto] = useState(false);

  const handleTornarAdmin = async () => {
    const resultado = await Swal.fire({
      title: "Confirmar Ação",
      text: `Deseja realmente tornar ${usuario.nome} um administrador?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sim, tornar Admin",
      cancelButtonText: "Cancelar",
    });

    if (resultado.isConfirmed) {
      try {
        await tornarAdmin(usuario.id);

        await Swal.fire({
          title: "Sucesso",
          text: "Usuário promovido para admin!",
          icon: "success",
          confirmButtonText: "OK",
          confirmButtonColor: "#3085d6",
        });

        setPopupAberto(false);
        
        onActionSuccess(); // 3. DISPARE O GATILHO AQUI APÓS O OK DO USUÁRIO

      } catch (error) {
        console.error(error);
        Swal.fire({
          title: "Erro",
          text: "Erro ao promover usuário",
          icon: "error",
          confirmButtonText: "Fechar",
          confirmButtonColor: "#d33",
        });
      }
    }
  };

  const handleTornarPosto = async () => {
    const resultado = await Swal.fire({
      title: "Confirmar Ação",
      text: `Deseja realmente vincular ${usuario.nome} a um posto?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sim, tornar Posto",
      cancelButtonText: "Cancelar",
    });

    if (resultado.isConfirmed) {
      try {
        await tornarPosto(usuario.id);

        await Swal.fire({
          title: "Sucesso",
          text: "Usuário promovido para posto!",
          icon: "success",
          confirmButtonText: "OK",
          confirmButtonColor: "#3085d6",
        });

        setPopupAberto(false);

        onActionSuccess();

      } catch (error) {
        console.error(error);

        Swal.fire({
          title: "Erro",
          text: "Erro ao promover usuário para posto",
          icon: "error",
          confirmButtonText: "Fechar",
          confirmButtonColor: "#d33",
        });
      }
    }
  };


  const handleResetarSenha = async () => {
    const resultado = await Swal.fire({
      title: "Resetar Senha",
      text: `Deseja realmente gerar uma nova senha para ${usuario.nome}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sim, resetar",
      cancelButtonText: "Cancelar",
    });

    if (resultado.isConfirmed) {
      try {
        const resposta = await resetarSenha(usuario.id);

        await Swal.fire({
          title: "Sucesso!",
          text: resposta || "O link/senha de recuperação foi enviado para o usuário.",
          icon: "success",
          confirmButtonText: "OK",
          confirmButtonColor: "#3085d6",
        });

        setPopupAberto(false);
      

      } catch (error) {
        console.error(error);
        Swal.fire({
          title: "Erro",
          text: "Erro ao resetar senha",
          icon: "error",
          confirmButtonText: "Fechar",
          confirmButtonColor: "#d33",
        });
      }
    }
  };

  return (
    <>
      <div className="usuario-card" onClick={() => setPopupAberto(true)}>
        <div className="card-text">
          <h3>{usuario.nome}</h3>
          <p><strong>Email:</strong> {usuario.email}</p>
          <p><strong>Admin:</strong> {usuario.role === "ADMIN" ? "Sim" : "Não"}</p>
          {usuario.dataCadastro && (
            <p>
              <strong>Cadastro:</strong>{" "}
              {new Date(usuario.dataCadastro).toLocaleDateString("pt-BR")}
            </p>
          )}
        </div>
      </div>

      {popupAberto && (
        <div className="popup-overlay">
          <div className="popup-box usuario-popup">
            <h2>Usuário</h2>
            <p><strong>Nome:</strong> {usuario.nome}</p>
            <p><strong>Email:</strong> {usuario.email}</p>
            <p><strong>Role:</strong> {usuario.role}</p>

            {usuario.role !== "ADMIN" && (
              <button className="admin-btn" onClick={handleTornarAdmin}>
                Tornar Admin
              </button>
            )}

            <button
                className="admin-btn"onClick={handleTornarPosto}>
                Tornar Posto
              </button>

            <button className="admin-btn" onClick={handleResetarSenha}>
              Resetar Senha
            </button>

            <button className="fechar-btn" onClick={() => setPopupAberto(false)}>
              Fechar
            </button>
          </div>
        </div>
      )}
    </>
  );
}