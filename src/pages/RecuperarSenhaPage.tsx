import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/LOGO_geoachados.png";
import RecuperarSenhaPageService from "../services/RecuperarSenhaPageService";
import Swal from "sweetalert2";

function RecuperarSenhaPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const mensagem = await RecuperarSenhaPageService.recuperarSenha(email);

      await Swal.fire({
        title: "Sucesso",
        text: mensagem,
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#3085d6",
      });

      setEmail("");
      
      navigate("/");

    } catch (error: any) {
      console.error(error);

      await Swal.fire({
        title: "Erro",
        text: error?.response?.data || "Erro ao recuperar senha",
        icon: "error",
        confirmButtonText: "Fechar",
        confirmButtonColor: "#d33",
      });
    }
  };

  return (
    <div className="login-container">
      <img src={logo} alt="GeoAchados e Perdidos" className="logo-login" />
      <div className="login-box">
        <form onSubmit={handleSubmit}>
          <h2>Recuperar Senha</h2>
          <div>
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit">Enviar senha temporária</button>
        </form>
      </div>
    </div>
  );
}

export default RecuperarSenhaPage;