import "./App.css";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import CadastroUsuarioPage from "./pages/CadastroUsuarioPage";
import ObjetosPage from "./pages/ObjetosPage";
import RecuperarSenha from "./pages/RecuperarSenhaPage";
import AlterarSenhaPage from "./pages/AlterarSenhaPage";
import UsuariosPage from "./pages/UsuariosPage";
import PostosPage from "./pages/PostosPage";

import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";

function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/cadastro"
          element={<CadastroUsuarioPage />}
        />

        <Route
          path="/recuperar-senha"
          element={<RecuperarSenha />}
        />

        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />

        <Route
          path="/objetos"
          element={
            <PrivateRoute>
              <ObjetosPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/usuarios"
          element={
            <PrivateRoute adminOnly>
              <UsuariosPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/postos"
          element={
            <PrivateRoute adminOnly>
              <PostosPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/alterar-senha"
          element={
            <PrivateRoute>
              <AlterarSenhaPage />
            </PrivateRoute>
          }
        />
        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;