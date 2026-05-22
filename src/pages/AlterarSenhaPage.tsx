import { useState } from "react";
import { useNavigate } from "react-router-dom";

import logo from "../assets/LOGO_geoachados.png";

import {
    alterarSenha
} from "../services/AlterarSenhaService"

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

                alert(
                    "As senhas não coincidem"
                );

                return;
            }

            try {

                const mensagem =
                    await alterarSenha(
                        senhaNova
                    );

                alert(
                    mensagem
                );

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

                alert(
                    error?.response?.data ||
                    error?.message ||
                    "Erro ao alterar senha"
                );

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