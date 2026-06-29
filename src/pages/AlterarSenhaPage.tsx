import { useState } from "react";
import { useNavigate } from "react-router-dom";

import logo from "../assets/LOGO_geoachados.png";

import {
    alterarSenha
} from "../services/AlterarSenhaService"
import Swal from "sweetalert2";

function AlterarSenhaPage() {

    const navigate =
        useNavigate();

    const [
        senhaNova,
        setSenhaNova
    ] = useState("");

    const [
        senhaConfirmacao,
        setSenhaConfirmacao
    ] = useState("");

const handleSubmit =
  async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    if (
      senhaNova !==
      senhaConfirmacao
    ) {

      await Swal.fire({
        title: "Atenção",
        text: "As senhas não coincidem",
        icon: "warning",
        confirmButtonText: "OK",
        confirmButtonColor: "#f39c12",
      });

      return;
    }

    try {

      const mensagem =
        await alterarSenha(
          senhaNova
        );

      await Swal.fire({
        title: "Sucesso",
        text: mensagem,
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#3085d6",
      });

      setSenhaNova("");
      setSenhaConfirmacao("");

      localStorage.setItem(
        "isTemp",
        "false"
      );

      navigate(
        "/home"
      );

    } catch (error: any) {

      console.error(
        error
      );

      Swal.fire({
        title: "Erro",
        text:
          error?.response?.data ||
          error?.message ||
          "Erro ao alterar senha",
        icon: "error",
        confirmButtonText: "Fechar",
        confirmButtonColor: "#d33",
      });

    }
};
    return (

        <div className="login-container">

            <img
                src={logo}
                alt="GeoAchados e Perdidos"
                className="logo-login"
            />

            <div className="login-box">

                <form
                    onSubmit={
                        handleSubmit
                    }
                >

                    <h2>
                        Alterar Senha Temporária
                    </h2>

                    <div>

                        <label>
                            Nova Senha
                        </label>

                        <input
						    autoComplete="off"
                            type="password"
                            value={
                                senhaNova
                            }
                            onChange={(e) =>
                                setSenhaNova(
                                    e.target.value
                                )
                            }
                            required
                        />

                    </div>

                    <div>

                        <label>
                            Confirmar Nova Senha
                        </label>

                        <input
						    autoComplete="off"
                            type="password"
                            value={
                                senhaConfirmacao
                            }
                            onChange={(e) =>
                                setSenhaConfirmacao(
                                    e.target.value
                                )
                            }
                            required
                        />

                    </div>

                    <button
                        type="submit"
                    >
                        Alterar Senha
                    </button>

                </form>

            </div>

        </div>
    );
}

export default AlterarSenhaPage;