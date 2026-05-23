import React, {useEffect, useState, useRef,
} from "react";

import { createPortal } from "react-dom";

import "../styles/PostoDetalhes.css";
import "../styles/ObjetoDetalhe.css";

import { buscarImagens } from "../services/ObjetoPageService";
import ObjetoDetalhe from "./ObjetoDetalhe";

import ObjetoPostoCard from "./ObjetoPostoCard";

import {
    buscarObjetosPosto,
    buscarObjetoDetalhado,
    buscarQuantidadeObjetosPosto,
} from "../services/PostoDetalheService";

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
};

export default function PostoDetalhe({
    posto,
}: Props) {

    const [aba, setAba] =
        useState<"info" | "objetos">(
            "info"
        );

    const [objetos, setObjetos] =
        useState<any[]>([]);

    const [
        quantidadeObjetos,
        setQuantidadeObjetos
    ] = useState(0);

    const [
        objetosCarregados,
        setObjetosCarregados
    ] = useState(false);

    const [
        objetoSelecionado,
        setObjetoSelecionado
    ] = useState<any | null>(null);

    const [imagensCarregadas, setImagensCarregadas] =
    useState<string[]>([]);

    const scrollRef =
    useRef<HTMLDivElement>(null);

    const handleWheel = (
        e: React.WheelEvent<HTMLDivElement>
    ) => {

        e.preventDefault();

        e.stopPropagation();

        const container =
            scrollRef.current;

        if (!container) return;

        container.scrollLeft +=
            e.deltaY * 2.5;
    };

    useEffect(() => {

        async function carregarQuantidade() {

            try {

                const qtd =
                    await buscarQuantidadeObjetosPosto(
                        posto.id
                    );

                setQuantidadeObjetos(
                    qtd
                );

            } catch (err) {

                console.error(err);

            }
        }

        carregarQuantidade();

    }, [posto.id]);


    useEffect(() => {

        async function carregarObjetos() {

            if (
                aba !== "objetos" ||
                objetosCarregados
            ) {
                return;
            }

            try {

                const objs =
                    await buscarObjetosPosto(
                        posto.id
                    );

                setObjetos(
                    objs
                );

                setObjetosCarregados(
                    true
                );

            } catch (err) {

                console.error(err);

            }
        }

        carregarObjetos();

    }, [
        aba,
        posto.id,
        objetosCarregados
    ]);

    useEffect(() => {

        async function carregarImagens() {

            if (!posto.imagens ||
                posto.imagens.length === 0) {

                setImagensCarregadas([]);

                return;
            }

            try {

                const imgs =
                    await buscarImagens(
                        posto.imagens
                    );

                setImagensCarregadas(imgs);

            } catch (err) {

                console.error(err);
            }
        }

        carregarImagens();

    }, [posto.imagens]);

    async function handleClickObjeto(
        id: number
    ) {

        try {

            console.log(
                "Buscando objeto:",
                id
            );

            const objeto =
                await buscarObjetoDetalhado(
                    id
                );

            console.log(
                objeto
            );

            setObjetoSelecionado(
                objeto
            );

        } catch (err) {

            console.error(err);

        }
    }

    console.log("POSTO DETALHE:",posto);
    return (

        <div className="posto-detalhe">

            <div className="posto-abas">

                <button
                    className={
                        aba === "info"
                            ? "ativo" : ""
                    }
                    onClick={() =>
                        setAba("info")
                    }
                >
                    Informações
                </button>

                <button
                    className={
                        aba === "objetos"
                            ? "ativo" : ""
                    }
                    onClick={() =>
                        setAba("objetos")
                    }
                >
                    Objetos (
                    {quantidadeObjetos}
                    )
                </button>

            </div>

            {aba === "info" && (

                <div className="posto-info">

                    <h2>
                        {posto.nome}
                    </h2>


                    <div className="objeto-detalhe-imagem-container">

                        {imagensCarregadas &&
                        imagensCarregadas.length > 0 ? (

                            <div
                                ref={scrollRef}
                                className={`objeto-detalhe-imagem-scroll ${
                                    imagensCarregadas.length === 1
                                        ? "single-image"
                                        : ""
                                }`}
                                onWheel={handleWheel}
                            >

                                {imagensCarregadas.map(
                                    (img, index) => (

                                        <img
                                            key={index}
                                            src={img}
                                            alt={`${posto.nome}-${index}`}
                                            className="objeto-detalhe-imagem"
                                        />
                                    )
                                )}

                            </div>

                        ) : (

                            <div className="objeto-detalhe-placeholder">
                                Sem imagem
                            </div>
                        )}

                    </div>


                    <p>
                        <strong>
                            Endereço:
                        </strong>

                        {" "}

                        {posto.endereco}
                    </p>

                    <p>
                        <strong>
                            Telefone:
                        </strong>

                        {" "}

                        {posto.telefone}
                    </p>

                    <p>
                        <strong>
                            Email:
                        </strong>

                        {" "}

                        {posto.email}
                    </p>

                </div>

            )}


            {aba === "objetos" && (

                <div className="objetos-lista-vertical">

                    {objetos.length === 0
                        ? (

                            <p>
                                Nenhum objeto encontrado
                            </p>

                        )
                        : (

                            objetos.map(
                                obj => (

                                    <ObjetoPostoCard
                                        key={obj.id}
                                        obj={obj}
                                        onClick={
                                            handleClickObjeto
                                        }
                                    />

                                )
                            )

                        )}

                </div>

            )}


            {objetoSelecionado &&
                createPortal(

                    <div
                        className="modal-overlay"
                        onClick={() =>
                            setObjetoSelecionado(
                                null
                            )
                        }
                    >

                        <div
                            className="modal-conteudo"
                            onClick={(e) =>
                                e.stopPropagation()
                            }
                        >

                            <div
                                className="modal-corpo"
                            >
                                <ObjetoDetalhe
                                    obj={
                                        objetoSelecionado
                                    }
                                />
                            </div>

                            <div
                                className="modal-footer"
                            >

                                <button
                                    className="modal-fechar"
                                    onClick={() =>
                                        setObjetoSelecionado(
                                            null
                                        )
                                    }
                                >
                                    Fechar
                                </button>

                            </div>

                        </div>

                    </div>,

                    document.body
                )}

        </div>

    );

}