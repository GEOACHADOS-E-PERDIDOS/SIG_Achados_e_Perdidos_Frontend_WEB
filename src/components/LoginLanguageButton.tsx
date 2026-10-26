import { useTranslation } from "react-i18next";
import "../styles/LoginLanguageButton.css";

function LoginLanguageButton() {
  const { i18n } = useTranslation();

  const trocarIdioma = () => {
    const novoIdioma = i18n.language.startsWith("pt")
      ? "en-US"
      : "pt-BR";

    i18n.changeLanguage(novoIdioma);
  };

  const idiomaAtual = i18n.language.startsWith("pt");

  return (
    <button
      type="button"
      className="language-button"
      onClick={trocarIdioma}
      aria-label="Trocar idioma"
    >
      {idiomaAtual ? "🇧🇷 PT-BR" : "🇺🇸 EN-US"}
    </button>
  );
}

export default LoginLanguageButton;