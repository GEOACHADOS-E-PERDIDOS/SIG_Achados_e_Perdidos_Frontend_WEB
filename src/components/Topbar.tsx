import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import logo from "../assets/LOGO_geoachados.png";
import "../styles/Topbar.css";

function Topbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [menuAberto, setMenuAberto] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const sair = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const checarAdmin = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await axios.get("http://localhost:8080/auth/admin/check", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsAdmin(res.data);
    } catch {
      setIsAdmin(false);
    }
  };

  useEffect(() => {
    checarAdmin();
  }, []);

  // 🔥 MENU DINÂMICO
  const menuItems = [
    { path: "/home", label: "Home" },
    { path: "/objetos", label: "Objetos" },
    { path: "/usuarios", label: "Usuários", admin: true }
  ];

  return (
    <>
      {/* TOPO */}
      <div className="topbar">
        <img src={logo} alt="GeoAchados e Perdidos" className="logo-top" />

        <div
          className="menu-icon"
          onClick={() => setMenuAberto(!menuAberto)}
        >
          ☰
        </div>
      </div>

      {/* MENU LATERAL */}
      <div className={`sidebar ${menuAberto ? "open" : ""}`}>
        
        {menuItems.map((item) => {
          if (item.path === location.pathname) return null;
          if (item.admin && !isAdmin) return null;

          return (
            <button
              key={item.path}
              onClick={() => {
                navigate(item.path);
                setMenuAberto(false); // fecha o menu ao clicar
              }}
            >
              {item.label}
            </button>
          );
        })}

        <button onClick={sair}>Sair</button>
      </div>
    </>
  );
}

export default Topbar;