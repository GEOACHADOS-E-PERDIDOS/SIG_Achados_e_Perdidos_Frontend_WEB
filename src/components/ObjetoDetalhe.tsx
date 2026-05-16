import React, { useRef } from "react";
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

    // URLs finais das imagens
    caminhosImagens?: string[];

    categorias?: Categoria[];

    status:
    | "DISPONIVEL"
    | "DEVOLVIDO"
    | "DESCARTADO";
};

type Props = {
    obj: Objeto;
};

export default function ObjetoDetalhe({
    obj,
}: Props) {

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

    return (
        <div className="objeto-detalhe">

            <h2>{obj.nome}</h2>

            {/* IMAGENS */}
            <div className="objeto-detalhe-imagem-container">

                {obj.caminhosImagens &&
                    obj.caminhosImagens.length > 0 ? (
                    <div
                        ref={scrollRef}
                        className={`objeto-detalhe-imagem-scroll ${obj.caminhosImagens.length === 1
                                ? "single-image"
                                : ""
                            }`}
                        onWheel={handleWheel}
                    >

                        {obj.caminhosImagens.map(
                            (img, index) => (

                                <img
                                    key={index}
                                    src={img}
                                    alt={`${obj.nome}-${index}`}
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
                <strong>Descrição:</strong>{" "}
                {obj.descricao}
            </p>

            <p>
                <strong>Endereço:</strong>{" "}
                {obj.enderecoEncontro}
            </p>

            <p>
                <strong>Data:</strong>{" "}
                {obj.dataEncontro}
            </p>

            <p>
                <strong>Status:</strong>{" "}

                <span
                    style={{
                        color:
                            obj.status ===
                                "DISPONIVEL"
                                ? "green"
                                : obj.status ===
                                    "DEVOLVIDO"
                                    ? "blue"
                                    : "red",

                        fontWeight: "bold",
                    }}
                >
                    {obj.status}
                </span>
            </p>

            <p>
                <strong>Categorias:</strong>{" "}

                {obj.categorias &&
                    obj.categorias.length > 0
                    ? obj.categorias
                        .map((c) => c.nome)
                        .join(", ")
                    : "Sem categoria"}
            </p>

        </div>
    );
}