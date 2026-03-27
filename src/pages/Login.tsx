import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from '../assets/LOGO_geoachados.png';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [token, setToken] = useState(""); // estado para armazenar token

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");

    try {
      const response = await axios.post("http://localhost:8080/auth/login", { email, senha });

      const bearerToken = response.data.token;

      localStorage.setItem("token", bearerToken);

      setToken(bearerToken);

      alert("Login realizado com sucesso!");
      navigate("/");

    } catch (err: any) {
      console.error(err);
      if (err.response) {
        setErro(err.response.data);
      } else {
        setErro("Erro ao conectar com o servidor");
      }
    }
  };

  const irParaCadastro = () => {
    navigate("/cadastro");
  };

    return (
    <div className="login-container">

      <img src={logo} alt="GeoAchados e Perdidos" className="logo-login" />

      <div className="login-box">

        {erro && <p className="erro">{erro}</p>}

        <form onSubmit={handleLogin}>
          <h2>Login</h2>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Senha</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>

          <button type="submit">Entrar</button>
        </form>

        <button className="cadastro-btn" onClick={irParaCadastro}>
          Crie sua conta
        </button>

        {token && (
          <div style={{ marginTop: "1rem" }}>
            <label>Bearer Token:</label>
            <input type="text" value={token} readOnly style={{ width: "100%" }} />
          </div>
        )}

      </div>
    </div>
  );
}

export default Login;