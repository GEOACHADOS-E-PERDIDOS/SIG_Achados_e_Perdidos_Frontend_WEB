import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");

    try {
      const response = await axios.post("http://localhost:8080/auth/login", {
        email,
        senha
      });

      console.log("Resposta do backend:", response.data);

      // Aqui você pode extrair o token se quiser salvar:
      // const token = response.data.split("Token: ")[1];
      // localStorage.setItem("token", token);

      alert("Login realizado com sucesso!");
      navigate("/"); // envia para a página inicial após login

    } catch (err: any) {
      console.error(err);
      if (err.response) {
        setErro(err.response.data); // mensagem de erro do backend
      } else {
        setErro("Erro ao conectar com o servidor");
      }
    }
  };

  const irParaCadastro = () => {
    navigate("/cadastro"); // envia para a página de cadastro
  };

  return (
    <div className="login-box">
      <h2>Login</h2>
      {erro && <p className="erro">{erro}</p>}
      <form onSubmit={handleLogin}>
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
    </div>
  );
}

export default Login;