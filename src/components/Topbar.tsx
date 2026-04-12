import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../assets/LOGO_geoachados.png";
import "../styles/Topbar.css";

function Topbar() {
  const navigate = useNavigate();

  const [menuAberto, setMenuAberto] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const irParaAchados = () => navigate("/objetos");

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
        <button onClick={irParaAchados}>Objetos</button>

        {isAdmin && (
          <button onClick={() => navigate("/usuarios")}>
            Usuários
          </button>
        )}

        <button onClick={sair}>Sair</button>
      </div>
    </>
  );
}

export default Topbar;