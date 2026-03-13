import { useState } from "react"
import { createUser } from "../services/userService"
import type { User } from "../types/User"

function UserForm() {

  const [user, setUser] = useState<User>({
    name: "",
    email: "",
    senha: "",
    isAdmin: false
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

      setUser({
        name: "",
        email: "",
        senha: "",
        isAdmin: false
      })

    } catch (error) {

      console.error(error)

      alert("Erro ao cadastrar usuário")

    }

  }

  return (

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

      <div>
        <label>Administrador</label>
        <input
          type="checkbox"
          name="isAdmin"
          checked={user.isAdmin}
          onChange={handleChange}
        />
      </div>

      <button type="submit">
        Cadastrar
      </button>

    </form>

  )

}

export default UserForm