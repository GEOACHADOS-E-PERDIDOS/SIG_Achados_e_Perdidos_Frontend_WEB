import { useState } from "react"
import { useNavigate } from "react-router-dom"

function Login() {

  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")

  const handleLogin = (e: React.FormEvent) => {

    e.preventDefault()

    console.log("Login:", email, senha)

    alert("Login ainda não implementado")

  }

  const irParaCadastro = () => {
    navigate("/cadastro")
  }

  return (

    <div>

      <h1>GeoAchados</h1>

      <form onSubmit={handleLogin}>

        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Senha</label>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
        </div>

        <button type="submit">
          Entrar
        </button>

      </form>

      <br />

      <button onClick={irParaCadastro}>
        Cadastrar novo usuário
      </button>

    </div>

  )

}

export default Login