
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import logo from "../assets/LOGO_geoachados.png";
import RecuperarSenhaPageService from "../services/RecuperarSenhaPageService";
import Swal from "sweetalert2";

function RecuperarSenhaPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [email, setEmail] = useState<string>("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const mensagem =
        await RecuperarSenhaPageService.recuperarSenha(email);

      await Swal.fire({
        title: t("recuperarSenha.sucesso"),
        text: mensagem,
        icon: "success",
        confirmButtonText: t("recuperarSenha.ok"),
        confirmButtonColor: "#3085d6",
      });

      setEmail("");
      navigate("/");
    } catch (error: any) {
      console.error(error);

      await Swal.fire({
        title: t("recuperarSenha.erro"),
        text:
          error?.response?.data ||
          t("recuperarSenha.erroRecuperar"),
        icon: "error",
        confirmButtonText: t("recuperarSenha.fechar"),
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
          <h2>{t("recuperarSenha.titulo")}</h2>

          <div>
            <label htmlFor="email">
              {t("recuperarSenha.email")}
            </label>

            <input
              id="email"
              autoComplete="off"
              type="email"
              name="email"
              value={email}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit">
            {t("recuperarSenha.enviar")}
          </button>
        </form>
      </div>
    </div>
  );
}

export default RecuperarSenhaPage;
