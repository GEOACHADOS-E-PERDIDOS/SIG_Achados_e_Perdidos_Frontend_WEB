import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import logo from "../assets/LOGO_geoachados.png";
import "../styles/Topbar.css";

import TopBarService from "../services/TopBarService";

function Topbar() {

  const navigate = useNavigate();
  const location = useLocation();

  const [menuAberto,
    setMenuAberto] =
      useState(false);

  const [isAdmin,
    setIsAdmin] =
      useState(false);

  const sair = () => {

    TopBarService.logout();

    navigate("/");

  };

  const menuItems = [
    { path: "/home", label: "Home" },
    { path: "/objetos", label: "Objetos" },
    {
      path: "/postos",
      label: "Postos",
      admin: true
    },
    {
      path: "/usuarios",
      label: "Usuários",
      admin: true
    },
    {
      path: "/perfil",
      label: "Meu Perfil"
    }
  ];

  useEffect(() => {

    const carregarAdmin =
      async () => {

      const isAdminUser =
        await TopBarService
          .checarAdmin();

      setIsAdmin(
        isAdminUser
      );
    };

    carregarAdmin();

  }, []);

  return (
    <>
      <div className="topbar">

        <img
          src={logo}
          alt="GeoAchados e Perdidos"
          className="logo-top"
        />

        <div
          className="menu-icon"
          onClick={() =>
            setMenuAberto(
              !menuAberto
            )
          }
        >
          ☰
        </div>

      </div>

      <div
        className={`sidebar ${
          menuAberto
            ? "open"
            : ""
        }`}
      >

        {menuItems.map(
          (item) => {

          if (
            item.path ===
            location.pathname
          ) return null;

          if (
            item.admin &&
            !isAdmin
          ) return null;

          return (
            <button
              key={item.path}
              onClick={() => {

                navigate(
                  item.path
                );

                setMenuAberto(
                  false
                );

              }}
            >
              {item.label}
            </button>
          );
        })}

        <button
          onClick={sair}
        >
          Sair
        </button>

      </div>
    </>
  );
}

export default Topbar;