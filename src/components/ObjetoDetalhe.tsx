import React from "react";
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
    imagemUrl?: string | null;
    categorias?: Categoria[];
    status: "DISPONIVEL" | "DEVOLVIDO" | "DESCARTADO";
};

type Props = {
    obj: Objeto;
};

export default function ObjetoDetalhe({ obj }: Props) {
    return (
        <div className="objeto-detalhe">

            <h2>{obj.nome}</h2>

            <div className="objeto-detalhe-imagem">
                {obj.imagemUrl ? (
                    <img src={obj.imagemUrl} alt={obj.nome} />
                ) : (
                    <div className="objeto-detalhe-placeholder">
                        Sem imagem
                    </div>
                )}
            </div>

            <p><strong>Descrição:</strong> {obj.descricao}</p>
            <p><strong>Endereço:</strong> {obj.enderecoEncontro}</p>
            <p><strong>Data:</strong> {obj.dataEncontro}</p>

            <p>
                <strong>Status:</strong>{" "}
                <span
                    style={{
                        color:
                            obj.status === "DISPONIVEL"
                                ? "green"
                                : obj.status === "DEVOLVIDO"
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
                {obj.categorias?.length
                    ? obj.categorias.map((c) => c.nome).join(", ")
                    : "Sem categoria"}
            </p>

        </div>
    );
}