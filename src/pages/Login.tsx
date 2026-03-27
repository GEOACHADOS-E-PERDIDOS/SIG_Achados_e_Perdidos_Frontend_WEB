import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from '../assets/LOGO_geoachados.png';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [token, setToken] = useState(""); 
  const [isTemp, setIsTemp] = useState(false); 

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");

    try {
      const response = await axios.post("http://localhost:8080/auth/login", { email, senha });

      const bearerToken = response.data.token;
      const senhaTemporaria = response.data.isTemp; 

      localStorage.setItem("token", bearerToken);
      localStorage.setItem("isTemp", senhaTemporaria); 
      setToken(bearerToken);
      setIsTemp(senhaTemporaria);

      navigate("/home");

    } catch (err: any) {
      console.error(err);
      if (err.response) {
        setErro(err.response.data.erro || err.response.data); // trata string ou objeto
      } else {
        setErro("Erro ao conectar com o servidor");
      }
    }
  };

  const irParaCadastro = () => navigate("/cadastro");
  const irParaRecuperarSenha = () => navigate("/recuperar-senha");

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

        <button className="cadastro-btn" onClick={irParaRecuperarSenha}>
          Esqueci a senha
        </button>
        

      </div>
    </div>
  );
}

export default Login;