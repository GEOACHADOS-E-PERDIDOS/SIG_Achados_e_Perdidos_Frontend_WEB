import React, {
    useEffect,
    useState,
} from "react";

import { createPortal } from "react-dom";

import "../styles/PostoDetalhes.css";

import ObjetoDetalhe
    from "./ObjetoDetalhe";

import ObjetoPostoCard
    from "./ObjetoPostoCard";

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