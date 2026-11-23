
import { useTranslation } from "react-i18next";

import "../styles/ObjetoPostoCard.css";

type Props = {
  obj: any;
  onClick: (
    id: number
  ) => void;
};

export default function ObjetoPostoCard({
  obj,
  onClick,
}: Props) {
  const { t } = useTranslation();

  const handleClick = () => {
    onClick(obj.id);
  };

  return (
    <div
      className="objeto-card"
      onClick={handleClick}
    >
      <div className="objeto-card-imagem">
        {obj.imagemUrl ? (
          <img
            src={obj.imagemUrl}
            alt={obj.nome}
          />
        ) : (
          <div className="imagem-placeholder">
            {t("objetoPostoCard.semImagem")}
          </div>
        )}
      </div>

      <div className="objeto-card-conteudo">
        <h4>{obj.nome}</h4>

        <p className="descricao">
          {obj.descricao}
        </p>

        <span className="categoria">
          {obj.categorias?.[0]?.nome ??
            t("objetoPostoCard.semCategoria")}
        </span>
      </div>
    </div>
  );
}
