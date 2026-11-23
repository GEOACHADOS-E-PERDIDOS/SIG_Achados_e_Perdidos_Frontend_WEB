
import { useState } from "react";
import { useTranslation } from "react-i18next";

import "../styles/ObjetoDetalhe.css";

type Categoria = {
  nome: string;
};

type Objeto = {
  id: number;
  nome: string;
  descricao: string;
  enderecoEncontro: string;
  dataEncontro: string;
  nomePosto?: string;
  caminhosImagens?: string[];
  categorias?: Categoria[];
  status: "DISPONIVEL" | "DEVOLVIDO" | "DESCARTADO" | "PERDIDO";
};

type Props = {
  obj: Objeto;
  onClose: () => void;
};

export default function ObjetoDetalhe({ obj, onClose }: Props) {
  const [imagemAtual, setImagemAtual] = useState(0);
  const { t, i18n } = useTranslation();

  const formatarData = (data: string) => {
    if (!data) return t("objetoDetalhe.dataNaoInformada");

    const [ano, mes, dia] = data.split("-");

    if (!ano || !mes || !dia) return data;

    return i18n.language === "en-US"
      ? `${mes}/${dia}/${ano}`
      : `${dia}/${mes}/${ano}`;
  };

  const statusTraduzido: Record<string, string> = {
    DISPONIVEL: t("objetoDetalhe.statusDisponivel"),
    DEVOLVIDO: t("objetoDetalhe.statusDevolvido"),
    DESCARTADO: t("objetoDetalhe.statusDescartado"),
    PERDIDO: t("objetoDetalhe.statusPerdido"),
  };

  const proximaImagem = () => {
    if (!obj.caminhosImagens) return;

    setImagemAtual((prev) =>
      prev === obj.caminhosImagens!.length - 1 ? 0 : prev + 1
    );
  };

  const imagemAnterior = () => {
    if (!obj.caminhosImagens) return;

    setImagemAtual((prev) =>
      prev === 0 ? obj.caminhosImagens!.length - 1 : prev - 1
    );
  };

  return (
    <div className="objeto-detalhe">
      {/* CARROSSEL */}

      <div className="objeto-carousel">
        {obj.caminhosImagens && obj.caminhosImagens.length > 0 ? (
          <>
            <button
              className="carousel-btn left"
              onClick={imagemAnterior}
              type="button"
              aria-label={t("objetoDetalhe.imagemAnterior")}
              title={t("objetoDetalhe.imagemAnterior")}
            >
              ❮
            </button>

            <div className="carousel-image-container">
              <img
                src={obj.caminhosImagens[imagemAtual]}
                alt={obj.nome}
                className="carousel-image"
              />
            </div>

            <button
              className="carousel-btn right"
              onClick={proximaImagem}
              type="button"
              aria-label={t("objetoDetalhe.proximaImagem")}
              title={t("objetoDetalhe.proximaImagem")}
            >
              ❯
            </button>

            <div className="carousel-indicators">
              {obj.caminhosImagens.map((_, index) => (
                <span
                  key={index}
                  className={`indicator ${
                    imagemAtual === index ? "active" : ""
                  }`}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="objeto-detalhe-placeholder">
            {t("objetoDetalhe.semImagem")}
          </div>
        )}
      </div>

      <div className="objeto-detalhe-conteudo">
        <h1 className="objeto-detalhe-titulo">
          {obj.nome}
        </h1>

        <div className="objeto-status-container">
          <span
            className={`objeto-status-badge ${obj.status?.toLowerCase()}`}
          >
            {statusTraduzido[obj.status] || obj.status}
          </span>
        </div>

        <div className="objeto-info-lista">
          <div className="info-item">
            <strong>{t("objetoDetalhe.data")}:</strong>
            <span>{formatarData(obj.dataEncontro)}</span>
          </div>

          <div className="info-item">
            <strong>{t("objetoDetalhe.endereco")}:</strong>
            <span>
              {obj.enderecoEncontro ||
                t("objetoDetalhe.enderecoNaoInformado")}
            </span>
          </div>

          {obj.nomePosto && (
            <div className="info-item">
              <strong>{t("objetoDetalhe.postoColeta")}:</strong>
              <span>{obj.nomePosto}</span>
            </div>
          )}

          <div className="info-item">
            <strong>{t("objetoDetalhe.categorias")}:</strong>
            <span>
              {obj.categorias && obj.categorias.length > 0
                ? obj.categorias.map((c) => c.nome).join(", ")
                : t("objetoDetalhe.naoCategorizado")}
            </span>
          </div>
        </div>

        <div className="objeto-descricao">
          <h3>{t("objetoDetalhe.descricao")}</h3>
          <p>{obj.descricao}</p>
        </div>

        {/* BOTÃO FECHAR */}

        <div className="posto-footer-acoes">
          <button
            type="button"
            className="btn-fechar-mapa-style"
            onClick={onClose}
          >
            {t("objetoDetalhe.fechar")}
          </button>
        </div>
      </div>
    </div>
  );
}
