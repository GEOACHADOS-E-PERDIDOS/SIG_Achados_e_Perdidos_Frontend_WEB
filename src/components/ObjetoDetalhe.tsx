import React, { useState } from "react";
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

// ADICIONADO: onClose nas Props
type Props = {
  obj: Objeto;
  onClose: () => void; 
};

// ADICIONADO: recebendo o onClose aqui
export default function ObjetoDetalhe({ obj, onClose }: Props) {
  const [imagemAtual, setImagemAtual] = useState(0);

  const formatarData = (data: string) => {
    if (!data) return "Data não informada";
    const [ano, mes, dia] = data.split("-");
    return `${dia}/${mes}/${ano}`;
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
            <button className="carousel-btn left" onClick={imagemAnterior} type="button">❮</button>
            <div className="carousel-image-container">
              <img
                src={obj.caminhosImagens[imagemAtual]}
                alt={obj.nome}
                className="carousel-image"
              />
            </div>
            <button className="carousel-btn right" onClick={proximaImagem} type="button">❯</button>
            <div className="carousel-indicators">
              {obj.caminhosImagens.map((_, index) => (
                <span
                  key={index}
                  className={`indicator ${imagemAtual === index ? "active" : ""}`}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="objeto-detalhe-placeholder">Sem imagem disponível</div>
        )}
      </div>

      <div className="objeto-detalhe-conteudo">
        <h1 className="objeto-detalhe-titulo">{obj.nome}</h1>
        
        <div className="objeto-status-container">
           <span className={`objeto-status-badge ${obj.status?.toLowerCase()}`}>
            {obj.status}
          </span>
        </div>

        <div className="objeto-info-lista">
          <div className="info-item">
            <strong>Data do encontro:</strong>
            <span>{formatarData(obj.dataEncontro)}</span>
          </div>
          <div className="info-item">
            <strong>Endereço:</strong>
            <span>{obj.enderecoEncontro || "Endereço não informado"}</span>
          </div>
          {obj.nomePosto && (
            <div className="info-item">
              <strong>Posto de Coleta:</strong>
              <span>{obj.nomePosto}</span>
            </div>
          )}
          <div className="info-item">
            <strong>Categorias:</strong>
            <span>
              {obj.categorias && obj.categorias.length > 0
                ? obj.categorias.map((c) => c.nome).join(", ")
                : "Não categorizado"}
            </span>
          </div>
        </div>

        <div className="objeto-descricao">
          <h3>Descrição</h3>
          <p>{obj.descricao}</p>
        </div>

        {/* BOTÃO CORRIGIDO: Agora chama o onClose diretamente */}
        <div className="posto-footer-acoes">
          <button 
              type="button"
              className="btn-fechar-mapa-style" 
              onClick={onClose}
          >
              Fechar
          </button>
      </div>
      </div>
    </div>
  );
}