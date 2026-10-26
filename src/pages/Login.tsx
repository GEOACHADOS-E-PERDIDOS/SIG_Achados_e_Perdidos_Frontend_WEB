
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios";

import logo from "../assets/LOGO_geoachados.png";
import "../styles/Login.css";
import LoginLanguageButton from "../components/LoginLanguageButton";

function Login() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");

    try {
      const response = await axios.post(
        "http://localhost:8080/auth/login",
        { email, senha }
      );

      const bearerToken = response.data.token;
      const user = response.data.usuario;
      const senhaTemporaria = response.data.isTemp;

      localStorage.setItem("token", bearerToken);
      localStorage.setItem("isTemp", senhaTemporaria);
      localStorage.setItem("userId", user.id);
      localStorage.setItem("userNome", user.nome);
      localStorage.setItem("userEmail", user.email);
      localStorage.setItem("isAdmin", user.isAdmin);

      navigate("/home");
    } catch (err: any) {
      console.error(err);

      if (err.response) {
        const mensagem =
          err.response.data.erro || err.response.data;

        setErro(
          typeof mensagem === "string"
            ? mensagem
            : t("login.connectionError")
        );
      } else {
        setErro(t("login.connectionError"));
      }
    }
  };

  const irParaCadastro = () => navigate("/cadastro");

  const irParaRecuperarSenha = () =>
    navigate("/recuperar-senha");

  return (
    <div className="login-container">
      <LoginLanguageButton />

      <img
        src={logo}
        alt="GeoAchados e Perdidos"
        className="logo-login"
      />

      <div className="login-box">
        {erro && (
          <div className="erro-box">
            <span>{erro}</span>

            <button
              className="fechar-erro"
              onClick={() => setErro("")}
              type="button"
              aria-label={t("login.closeError")}
            >
              ✕
            </button>
          </div>
        )}

        <form onSubmit={handleLogin}>
          <h2>{t("login.title")}</h2>

          <div className="form-group">
            <label htmlFor="email">
              {t("login.email")}
            </label>

            <input
              id="email"
              autoComplete="off"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="senha">
              {t("login.password")}
            </label>

            <input
              id="senha"
              autoComplete="off"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>

          <button type="submit">
            {t("login.enter")}
          </button>
        </form>

        <button
          className="cadastro-btn"
          onClick={irParaCadastro}
          type="button"
        >
          {t("login.createAccount")}
        </button>

        <button
          className="cadastro-btn"
          onClick={irParaRecuperarSenha}
          type="button"
        >
          {t("login.forgotPassword")}
        </button>
      </div>
    </div>
  );
}

export default Login;
