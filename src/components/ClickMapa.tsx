import { useMapEvents } from "react-leaflet";
import { useState } from "react";

import ObjetoDetalhe from "./ObjetoDetalhe";
import PostoDetalhe from "./PostoDetalhes";

import {
  buscarFeatureMapa,
  buscarObjetoCompleto,
  buscarPostoCompleto,
  buscarImagem,
} from "../services/ClickMapaService";

function ClickMapa() {
  const [itemSelecionado, setItemSelecionado] =
    useState<any | null>(null);

  const map = useMapEvents({
    async click(e) {
      try {
        // =========================
        // BUSCAR FEATURE NO MAPA
        // =========================
        const data = await buscarFeatureMapa(
          map,
          e.latlng
        );

        if (data.features.length > 0) {
          const feature = data.features[0];

          const layerName =
            feature.id.split(".")[0];

          // =========================
          // POSTO
          // =========================
          if (layerName === "view_posto_retirada_map") {
              console.log(feature.properties);
            const posto =
              await buscarPostoCompleto(
                feature.properties.id_posto
              );

            setItemSelecionado({
              tipo: "posto_retirada",
              properties: posto,
            });
          }

          // =========================
          // OBJETO
          // =========================
          else {

            const objeto =
              await buscarObjetoCompleto(
                feature.properties.id_objeto
              );

            // =========================
            // PROCESSAR IMAGEM
            // =========================
            const objetoComImagem = {
              ...objeto,

              imagemUrl:
                objeto.caminhoImagem
                  ? await buscarImagem(
                    objeto.caminhoImagem
                  )
                  : null,
            };

            setItemSelecionado({
              tipo: "objeto",
              properties: objetoComImagem,
            });
          }
        } else {
          setItemSelecionado(null);
        }
      } catch (err) {
        console.error(
          "Erro ao buscar feature:",
          err
        );
      }
    },
  });

  return (
    <>
      {itemSelecionado && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background:
              "rgba(0,0,0,0.6)",

            zIndex: 999999,

            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() =>
            setItemSelecionado(null)
          }
        >
          <div
            style={{
              background: "white",

              padding: "20px",

              borderRadius: "10px",

              width: "500px",

              maxWidth: "90%",

              maxHeight: "90%",

              overflowY: "auto",
            }}
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            {itemSelecionado.tipo ===
              "posto_retirada" ? (
              <PostoDetalhe
                posto={
                  itemSelecionado.properties
                }
              />
            ) : (
              <ObjetoDetalhe
                obj={
                  itemSelecionado.properties
                }
              />
            )}

            <button
              onClick={() =>
                setItemSelecionado(null)
              }
              style={{
                marginTop: "15px",

                padding: "10px 15px",

                border: "none",

                borderRadius: "8px",

                background: "#1976d2",

                color: "white",

                cursor: "pointer",
              }}
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default ClickMapa;