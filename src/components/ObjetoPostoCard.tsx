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

    const handleClick = () => {

        console.log(
            "CLICOU:",
            obj.id
        );

        onClick(
            obj.id
        );

    };

    return (

        <div
            className="objeto-card"
            onClick={
                handleClick
            }
        >

            <div className="objeto-card-imagem">

                {obj.imagemUrl ? (

                    <img
                        src={obj.imagemUrl}
                        alt={obj.nome}
                    />

                ) : (

                    <div className="imagem-placeholder">

                        Sem imagem

                    </div>

                )}

            </div>

            <div className="objeto-card-conteudo">

                <h4>
                    {obj.nome}
                </h4>

                <p className="descricao">

                    {obj.descricao}

                </p>

                <span className="categoria">

                    {obj.categorias?.[0]?.nome ??
                        "Sem categoria"}

                </span>

            </div>

        </div>

    );

}