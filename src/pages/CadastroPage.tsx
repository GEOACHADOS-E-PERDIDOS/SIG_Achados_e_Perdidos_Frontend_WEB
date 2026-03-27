import { useState } from "react"
import { createUser } from "../services/userService"
import type { User } from "../types/User"
import { useNavigate } from "react-router-dom"
import logo from '../assets/LOGO_geoachados.png';

function CadastroPage() {
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
    e.preventDefault()
    try {
      const newUser = await createUser(user)
      console.log("Usuário criado:", newUser)
      alert("Usuário cadastrado com sucesso!")

      // Limpa formulário
      setUser({
        name: "",
        email: "",
        senha: "",
      })

      // Redireciona para página inicial
      navigate("/")

    } catch (error) {
      console.error(error)
      alert("Erro ao cadastrar usuário")
    }
  }

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
export default CadastroPage