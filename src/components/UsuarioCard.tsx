import { useState } from "react";
import "../styles/UsuarioCard.css";

type Usuario = {
  id: number;
  nome: string;
  email: string;
  role: string;
  dataCadastro?: string;
};

type Props = {
  usuario: Usuario;
  onTornarAdmin: (id: number) => Promise<void>;
};

export default function UsuarioCard({
  usuario,
  onTornarAdmin,
}: Props) {

  const [popupAberto,
    setPopupAberto] = useState(false);

  const [confirmacaoAberta,
    setConfirmacaoAberta] = useState(false);

  const handleConfirmar = async () => {

    try {

      await onTornarAdmin(usuario.id);

      alert("Usuário promovido para admin!");

      setConfirmacaoAberta(false);

      setPopupAberto(false);

    } catch (error) {

      console.error(error);

      alert("Erro ao promover usuário");
    }
  };

  return (
    <>

      {/* Card */}
      <div
        className="usuario-card"
        onClick={() => setPopupAberto(true)}
      >

         <div className="card-text">

    <h3>{usuario.nome}</h3>

    <p>
      <strong>Email:</strong>
      {usuario.email}
    </p>

    <p>
      <strong>Admin:</strong>
      {usuario.role === "ADMIN"
        ? "Sim"
        : "Não"}
    </p>

    {usuario.dataCadastro && (
      <p>
        <strong>Cadastro:</strong>

        {new Date(
          usuario.dataCadastro
        ).toLocaleDateString("pt-BR")}
      </p>
    )}

  </div>

      </div>

      {/* Popup principal */}
      {popupAberto && (

        <div className="popup-overlay">

          <div className="popup-box usuario-popup">

            <h2>Usuário</h2>

            <p>
              <strong>Nome:</strong>
              {usuario.nome}
            </p>

            <p>
              <strong>Email:</strong>
              {usuario.email}
            </p>

            <p>
              <strong>Role:</strong>
              {usuario.role}
            </p>

            {usuario.role !== "ADMIN" && (

              <button
                className="admin-btn"
                onClick={() => setConfirmacaoAberta(true)}
              >
                Tornar Admin
              </button>
            )}

            <button
              className="fechar-btn"
              onClick={() => setPopupAberto(false)}
            >
              Fechar
            </button>

          </div>

        </div>
      )}

      {/* Popup confirmação */}
      {confirmacaoAberta && (

        <div className="popup-overlay">

          <div className="popup-box confirmar-popup">

            <h3>
              Deseja realmente tornar
              este usuário administrador?
            </h3>

            <div className="confirmar-botoes">

              <button
                className="confirmar-btn"
                onClick={handleConfirmar}
              >
                Confirmar
              </button>

              <button
                className="cancelar-btn"
                onClick={() => setConfirmacaoAberta(false)}
              >
                Cancelar
              </button>

            </div>

          </div>

        </div>
      )}

    </>
  );
}