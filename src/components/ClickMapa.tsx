import { useMapEvents } from "react-leaflet";
import { useState, useEffect } from "react";

import ObjetoDetalhe from "./ObjetoDetalhe";
import PostoDetalhe from "./PostoDetalhes";

import {
  buscarFeatureMapa,
  buscarObjetoCompleto,
  buscarPostoCompleto,
  buscarImagens,
} from "../services/ClickMapaService";

function ClickMapa() {

  const [itemSelecionado, setItemSelecionado] =
    useState<any | null>(null);

  /* ===================================== */
  /* MAPA */
  /* ===================================== */

  const map = useMapEvents({

    async click(e) {

      /* ===================================== */
      /* BLOQUEAR CLICK QUANDO MODAL ABERTO */
      /* ===================================== */

      if (itemSelecionado) {
        return;
      }

      try {

        const data =
          await buscarFeatureMapa(
            map,
            e.latlng
          );

        if (
          !data.features ||
          data.features.length === 0
        ) {

          setItemSelecionado(null);

          return;
        }

        const feature =
          data.features[0];

        const layerName =
          feature.id.split(".")[0];

        /* ===================================== */
        /* POSTO */
        /* ===================================== */

        if (
          layerName ===
          "view_posto_retirada_map"
        ) {

          const posto =
            await buscarPostoCompleto(
              feature.properties.id_posto
            );

          setItemSelecionado({

            tipo: "posto_retirada",

            properties: posto,
          });

          return;
        }

        /* ===================================== */
        /* OBJETO */
        /* ===================================== */

        const objeto =
          await buscarObjetoCompleto(
            feature.properties.id_objeto
          );

        const imagensUrl =
          await buscarImagens(
            objeto.caminhosImagens || []
          );

        const objetoComImagens = {

          ...objeto,

          caminhosImagens:
            imagensUrl,
        };

        setItemSelecionado({

          tipo: "objeto",

          properties:
            objetoComImagens,
        });

      } catch (err) {

        console.error(
          "Erro ao buscar feature:",
          err
        );
      }
    },
  });

  /* ===================================== */
  /* DESABILITAR INTERAÇÃO DO MAPA */
  /* ===================================== */

  useEffect(() => {

    if (itemSelecionado) {

      map.dragging.disable();

      map.scrollWheelZoom.disable();

      map.doubleClickZoom.disable();

      map.touchZoom.disable();

      map.boxZoom.disable();

      map.keyboard.disable();

    } else {

      map.dragging.enable();

      map.scrollWheelZoom.enable();

      map.doubleClickZoom.enable();

      map.touchZoom.enable();

      map.boxZoom.enable();

      map.keyboard.enable();
    }

    return () => {

      map.dragging.enable();

      map.scrollWheelZoom.enable();

      map.doubleClickZoom.enable();

      map.touchZoom.enable();

      map.boxZoom.enable();

      map.keyboard.enable();
    };

  }, [itemSelecionado, map]);

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

            onClick={(e) => {

              e.stopPropagation();
            }}
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