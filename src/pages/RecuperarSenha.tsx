import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from '../assets/LOGO_geoachados.png';

function RecuperarSenhaPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(`http://localhost:8080/auth/recuperar-senha?email=${email}`);
      alert(response.data); 
      setEmail(""); 
      navigate("/"); 
    } catch (error: any) {
      console.error(error);
      alert(error?.response?.data || "Erro ao recuperar senha");
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
          <h2>Recuperar Senha</h2>

          <div>
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit">
            Enviar senha temporária
          </button>
        </form>
      </div>

    </div>
  );
}

export default RecuperarSenhaPage;