import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import logo from "../assets/LOGO_geoachados.png";
import { alterarSenha } from "../services/AlterarSenhaService";
import Swal from "sweetalert2";

function AlterarSenhaPage() {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [senhaNova, setSenhaNova] = useState("");
    const [senhaConfirmacao, setSenhaConfirmacao] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (senhaNova !== senhaConfirmacao) {
            await Swal.fire({
                title: t("alterarSenha.atencao"),
                text: t("alterarSenha.senhasNaoCoincidem"),
                icon: "warning",
                confirmButtonText: "OK",
                confirmButtonColor: "#f39c12",
            });

            return;
        }

        try {
            const mensagem = await alterarSenha(senhaNova);

            await Swal.fire({
                title: t("alterarSenha.sucesso"),
                text: mensagem,
                icon: "success",
                confirmButtonText: "OK",
                confirmButtonColor: "#3085d6",
            });

            setSenhaNova("");
            setSenhaConfirmacao("");

            localStorage.setItem("isTemp", "false");

            navigate("/home");
        } catch (error: any) {
            console.error(error);

            await Swal.fire({
                title: t("alterarSenha.erro"),
                text:
                    error?.response?.data ||
                    error?.message ||
                    t("alterarSenha.erroAlterarSenha"),
                icon: "error",
                confirmButtonText: t("alterarSenha.fechar"),
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
                <form onSubmit={handleSubmit}>
                    <h2>{t("alterarSenha.titulo")}</h2>

                    <div>
                        <label>{t("alterarSenha.novaSenha")}</label>

                        <input
                            autoComplete="off"
                            type="password"
                            value={senhaNova}
                            onChange={(e) => setSenhaNova(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label>
                            {t("alterarSenha.confirmarNovaSenha")}
                        </label>

                        <input
                            autoComplete="off"
                            type="password"
                            value={senhaConfirmacao}
                            onChange={(e) =>
                                setSenhaConfirmacao(e.target.value)
                            }
                            required
                        />
                    </div>

                    <button type="submit">
                        {t("alterarSenha.alterar")}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AlterarSenhaPage;
