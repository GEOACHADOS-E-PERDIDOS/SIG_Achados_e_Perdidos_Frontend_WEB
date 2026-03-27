import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from '../assets/LOGO_geoachados.png';

function AlterarSenhaPage() {
  const navigate = useNavigate();
  const [senhaNova, setSenhaNova] = useState<string>("");
  const [senhaConfirmacao, setSenhaConfirmacao] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (senhaNova !== senhaConfirmacao) {
      alert("As senhas não coincidem");
      return;
    }

    try {
      const token = localStorage.getItem("token"); 
      if (!token) {
        alert("Usuário não autenticado");
        navigate("/");
        return;
      }

      const response = await axios.post(
        "http://localhost:8080/auth/trocar-senha",
        { novaSenha: senhaNova },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(response.data); 
      setSenhaNova("");
      setSenhaConfirmacao("");
      localStorage.setItem("isTemp","false")
      navigate("/home"); 
      
    } catch (error: any) {
      console.error(error);
      alert(error?.response?.data || "Erro ao alterar senha");
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
          <h2>Alterar Senha Temporária</h2>

          <div>
            <label>Nova Senha</label>
            <input
              type="password"
              name="senhaNova"
              value={senhaNova}
              onChange={(e) => setSenhaNova(e.target.value)}
              required
            />
          </div>

          <div>
            <label>Confirmar Nova Senha</label>
            <input
              type="password"
              name="senhaConfirmacao"
              value={senhaConfirmacao}
              onChange={(e) => setSenhaConfirmacao(e.target.value)}
              required
            />
          </div>

          <button type="submit">
            Alterar Senha
          </button>
        </form>
      </div>

    </div>
  );
}

export default AlterarSenhaPage;