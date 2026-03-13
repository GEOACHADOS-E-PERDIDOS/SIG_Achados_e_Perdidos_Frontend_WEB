import "./App.css"
import { BrowserRouter, Routes, Route } from "react-router-dom"

import Login from "./pages/Login"
import UserForm from "./components/UserForm"

function App() {

  return (

    <BrowserRouter>

      <div>

        <h1>Sistema de Achados e Perdidos</h1>

        <Routes>

          <Route path="/" element={<Login />} />

          <Route path="/cadastro" element={<UserForm />} />

        </Routes>

      </div>

    </BrowserRouter>

  )

}

export default App