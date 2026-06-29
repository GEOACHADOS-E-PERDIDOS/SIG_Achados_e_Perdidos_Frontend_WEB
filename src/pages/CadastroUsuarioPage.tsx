import { useState } from "react"
import { createUser } from "../services/CadastroUsuarioService"
import type { User } from "../types/User"
import { useNavigate } from "react-router-dom"
import logo from '../assets/LOGO_geoachados.png';
import Swal from "sweetalert2";

function CadastroUsuarioPage() {
  const navigate = useNavigate() // hook para navegação

  const [user, setUser] = useState<User>({
    name: "",
    email: "",
    senha: ""
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setUser({
      ...user,
      [name]: type === "checkbox" ? checked : value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createUser(user);

      await Swal.fire({
        title: "Sucesso",
        text: "Usuário cadastrado com sucesso!",
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#3085d6",
      });

      setUser({
        name: "",
        email: "",
        senha: "",
      });

      // Redireciona para página inicial
      navigate("/");

    } catch (error) {
      console.error(error);

      await Swal.fire({
        title: "Erro",
        text: "Erro ao cadastrar usuário",
        icon: "error",
        confirmButtonText: "OK",
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
          <h2>Cadastro de Usuário</h2>

          <div>
            <label>Nome</label>
            <input
						  autoComplete="off"
              type="text"
              name="name"
              value={user.name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>Email</label>
            <input
						  autoComplete="off"
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>Senha</label>
            <input
						  autoComplete="off"
              type="password"
              name="senha"
              value={user.senha}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit">
            Cadastrar
          </button>
        </form>
      </div>

    </div>
  );
}
export default CadastroUsuarioPage