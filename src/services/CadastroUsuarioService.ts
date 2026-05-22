import { useNavigate } from "react-router-dom";
import type { User } from "../types/User.ts"

const API_URL = "http://localhost:8080/auth/registrar"

export async function createUser(user: User): Promise<string> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name: user.name,
      email: user.email,
      senhaHash: user.senha,
      isAdmin: user.isAdmin ?? false
    })
  });

  if (!response.ok) {
    const erro = await response.text(); 
    throw new Error(erro || "Erro ao cadastrar usuário");
  }
  return response.text(); 
}

export async function getUsers(): Promise<User[]> {

  const response = await fetch(API_URL)

  if (!response.ok) {
    throw new Error("Erro ao buscar usuários")
  }

  return response.json()

}

export async function getUserById(id: number): Promise<User> {

  const response = await fetch(`${API_URL}/${id}`)

  if (!response.ok) {
    throw new Error("Erro ao buscar usuário")
  }

  return response.json()

}

export async function deleteUser(id: number): Promise<void> {

  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE"
  })

  if (!response.ok) {
    throw new Error("Erro ao deletar usuário")
  }

}