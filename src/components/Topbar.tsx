
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

import logo from "../assets/LOGO_geoachados.png";
import "../styles/Topbar.css";

import TopBarService from "../services/TopBarService";

function Topbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();

  const [menuAberto, setMenuAberto] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const trocarIdioma = () => {
    const novoIdioma = i18n.language.startsWith("pt")
      ? "en-US"
      : "pt-BR";

    i18n.changeLanguage(novoIdioma);
  };

  const sair = () => {
    TopBarService.logout();
    navigate("/");
  };

  const menuItems = [
    { path: "/home", label: t("topbar.home") },
    { path: "/objetos", label: t("topbar.objetos") },
    {
      path: "/postos",
      label: t("topbar.postos"),
      admin: true
    },
    {
      path: "/usuarios",
      label: t("topbar.usuarios"),
      admin: true
    },
    {
      path: "/perfil",
      label: t("topbar.meuPerfil")
    }
  ];

  useEffect(() => {
    const carregarAdmin = async () => {
      const isAdminUser = await TopBarService.checarAdmin();
      setIsAdmin(isAdminUser);
    };

    carregarAdmin();
  }, []);

  return (
    <>
      <div className="topbar">
        <img
          src={logo}
          alt={t("topbar.logoAlt")}
          className="logo-top"
        />

        <div
          className="menu-icon"
          onClick={() => setMenuAberto(!menuAberto)}
          role="button"
          aria-label={t("topbar.abrirMenu")}
          title={t("topbar.abrirMenu")}
        >
          ☰
        </div>
      </div>

      <div
        className={`sidebar ${menuAberto ? "open" : ""}`}
      >
        {menuItems.map((item) => {
          if (item.path === location.pathname) return null;

          if (item.admin && !isAdmin) return null;

          return (
            <button
              key={item.path}
              onClick={() => {
                navigate(item.path);
                setMenuAberto(false);
              }}
            >
              {item.label}
            </button>
          );
        })}

        <button onClick={sair}>
          {t("topbar.sair")}
        </button>

        <button
          className="sidebar-language-button"
          onClick={trocarIdioma}
          type="button"
        >
          {i18n.language.startsWith("pt")
            ? t("topbar.idiomaPortugues")
            : t("topbar.idiomaIngles")}
        </button>
      </div>
    </>
  );
}

export default Topbar;
