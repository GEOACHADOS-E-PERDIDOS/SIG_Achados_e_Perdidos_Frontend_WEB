
import { useState } from "react";
import { createUser } from "../services/CadastroUsuarioService";
import type { User } from "../types/User";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import logo from "../assets/LOGO_geoachados.png";
import Swal from "sweetalert2";

function CadastroUsuarioPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [user, setUser] = useState<User>({
    name: "",
    email: "",
    senha: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, type, checked } = e.target;

    setUser({
      ...user,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createUser(user);

      await Swal.fire({
        title: t("cadastroUsuario.sucesso"),
        text: t("cadastroUsuario.sucessoMensagem"),
        icon: "success",
        confirmButtonText: t("cadastroUsuario.ok"),
        confirmButtonColor: "#3085d6",
      });

      setUser({
        name: "",
        email: "",
        senha: "",
      });

      navigate("/");
    } catch (error) {
      console.error(error);

      await Swal.fire({
        title: t("cadastroUsuario.erro"),
        text: t("cadastroUsuario.erroMensagem"),
        icon: "error",
        confirmButtonText: t("cadastroUsuario.ok"),
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
          <h2>{t("cadastroUsuario.titulo")}</h2>

          <div>
            <label htmlFor="name">
              {t("cadastroUsuario.nome")}
            </label>

            <input
              id="name"
              autoComplete="off"
              type="text"
              name="name"
              value={user.name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="email">
              {t("cadastroUsuario.email")}
            </label>

            <input
              id="email"
              autoComplete="off"
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="senha">
              {t("cadastroUsuario.senha")}
            </label>

            <input
              id="senha"
              autoComplete="off"
              type="password"
              name="senha"
              value={user.senha}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit">
            {t("cadastroUsuario.cadastrar")}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CadastroUsuarioPage;
