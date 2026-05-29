import React, { useEffect, useState } from "react";
import "../styles/PostoDetalhes.css";

import { buscarImagens } from "../services/ObjetoPageService";
import ObjetoPostoCard from "./ObjetoPostoCard";

import {
    buscarObjetosPosto,
    buscarObjetoDetalhado,
    buscarQuantidadeObjetosPosto,
} from "../services/PostoDetalheService";

import ObjetoDetalhe from "./ObjetoDetalhe";

type PostoDeRetirada = {
    id: number;
    nome: string;
    endereco: string;
    telefone: string;
    email: string;
    imagens?: string[];
};

type Props = {
    posto: PostoDeRetirada;
    onClose: () => void;
};

export default function PostoDetalhe({ posto, onClose }: Props) {
    const [aba, setAba] = useState<"info" | "objetos">("info");
    const [objetos, setObjetos] = useState<any[]>([]);
    const [quantidadeObjetos, setQuantidadeObjetos] = useState(0);
    const [objetosCarregados, setObjetosCarregados] = useState(false);
    const [objetoSelecionado, setObjetoSelecionado] = useState<any | null>(null);
    const [imagensCarregadas, setImagensCarregadas] = useState<string[]>([]);
    const [imagemAtual, setImagemAtual] = useState(0);

    useEffect(() => {
        async function carregarQuantidade() {
            try {
                const qtd = await buscarQuantidadeObjetosPosto(posto.id);
                setQuantidadeObjetos(qtd);
            } catch (err) { console.error(err); }
        }
        carregarQuantidade();
    }, [posto.id]);

    useEffect(() => {
        async function carregarObjetos() {
            if (aba !== "objetos" || objetosCarregados) return;
            try {
                const objs = await buscarObjetosPosto(posto.id);
                setObjetos(objs);
                setObjetosCarregados(true);
            } catch (err) { console.error(err); }
        }
        carregarObjetos();
    }, [aba, posto.id, objetosCarregados]);

    useEffect(() => {
        async function carregarImagens() {
            if (!posto.imagens || posto.imagens.length === 0) return;
            try {
                const imgs = await buscarImagens(posto.imagens);
                setImagensCarregadas(imgs);
            } catch (err) { console.error(err); }
        }
        carregarImagens();
    }, [posto.imagens]);

    const proximaImg = () => setImagemAtual(prev => (prev === imagensCarregadas.length - 1 ? 0 : prev + 1));
    const anteriorImg = () => setImagemAtual(prev => (prev === 0 ? imagensCarregadas.length - 1 : prev - 1));

    return (
        <div className="posto-detalhe">
            {/* CABEÇALHO COM ABAS */}
            <div className="posto-abas">
                <button className={aba === "info" ? "ativo" : ""} onClick={() => setAba("info")}>
                    Informações
                </button>
                <button className={aba === "objetos" ? "ativo" : ""} onClick={() => setAba("objetos")}>
                    Objetos ({quantidadeObjetos})
                </button>
            </div>

            {/* CONTEÚDO PRINCIPAL */}
            <div className="posto-conteudo-scroll">
                {aba === "info" && (
                    <div className="posto-info-aba">
                        <h1 className="posto-detalhe-titulo">{posto.nome}</h1>
                        
                        <div className="objeto-carousel">
                            {imagensCarregadas.length > 0 ? (
                                <>
                                    <button className="carousel-btn left" onClick={anteriorImg}>❮</button>
                                    <div className="carousel-image-container">
                                        <img src={imagensCarregadas[imagemAtual]} alt={posto.nome} className="carousel-image" />
                                    </div>
                                    <button className="carousel-btn right" onClick={proximaImg}>❯</button>
                                    <div className="carousel-indicators">
                                        {imagensCarregadas.map((_, i) => (
                                            <span key={i} className={`indicator ${imagemAtual === i ? "active" : ""}`} />
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <div className="objeto-detalhe-placeholder">Sem imagem disponível</div>
                            )}
                        </div>

                        <div className="objeto-info-lista">
                            <div className="info-item">
                                <strong>Endereço</strong>
                                <span>{posto.endereco}</span>
                            </div>
                            <div className="info-item">
                                <strong>Telefone</strong>
                                <span>{posto.telefone}</span>
                            </div>
                            <div className="info-item">
                                <strong>E-mail</strong>
                                <span>{posto.email}</span>
                            </div>
                        </div>
                    </div>
                )}

                {aba === "objetos" && (
                    <div className="objetos-lista-vertical">
                        {objetos.length === 0 ? (
                            <p className="lista-vazia">Nenhum objeto encontrado.</p>
                        ) : (
                            objetos.map((obj) => (
                                <ObjetoPostoCard 
                                    key={obj.id} 
                                    obj={obj} 
                                    onClick={async (id) => {
                                        const detalhe = await buscarObjetoDetalhado(id);
                                        setObjetoSelecionado(detalhe);
                                    }} 
                                />
                            ))
                        )}
                    </div>
                )}
            </div>

            <div className="posto-footer-acoes">
                <button 
                    className="btn-fechar-mapa-style" 
                    onClick={onClose}
                >
                    Fechar
                </button>
            </div>

            {/* MODAL DO OBJETO - SEM BOTÃO MANUAL AQUI */}
            {objetoSelecionado && (
                <div className="modal-overlay" onClick={() => setObjetoSelecionado(null)}>
                    <div className="modal-conteudo-objeto" onClick={(e) => e.stopPropagation()}>
                        {/* Agora passamos a função onClose aqui também */}
                        <ObjetoDetalhe 
                            obj={objetoSelecionado} 
                            onClose={() => setObjetoSelecionado(null)} 
                        />
                    </div>
                </div>
            )}
        </div>
    );
}