import axios from "axios";

import {
    buscarObjetoCompleto,
    buscarImagens,
} from "./ClickMapaService";

const API_URL =
    "http://localhost:8080";

// ==============================
// MONTA HEADERS
// ==============================

const montarHeaders = () => {

    const token =
        localStorage.getItem(
            "token"
        );

    return token
        ? {
            Authorization:
                `Bearer ${token}`,
        }
        : {};
};

// ==============================
// MONTA OBJETO COM IMAGENS
// ==============================

export const montarObjeto =
    async (obj: any) => {

        const imagens =
            obj.caminhosImagens?.length > 0
                ? await buscarImagens(
                    obj.caminhosImagens
                )
                : [];

        return {
            ...obj,

            caminhosImagens:
                imagens,

            imagemUrl:
                imagens?.[0]
                ?? null,
        };
    };

// ==============================
// BUSCAR QUANTIDADE
// ==============================

export const buscarQuantidadeObjetosPosto =
    async (
        postoId: number
    ) => {

        const res =
            await axios.get(
                `${API_URL}/objetos/achados/posto/${postoId}/quantidade`,
                {
                    headers:
                        montarHeaders()
                }
            );

        return res.data;
    };

// ==============================
// BUSCAR OBJETOS
// ==============================

export const buscarObjetosPosto =
    async (
        postoId: number
    ) => {

        const res =
            await axios.get(
                `${API_URL}/objetos/achados/buscar/posto/${postoId}`,
                {
                    headers:
                        montarHeaders()
                }
            );

        return Promise.all(
            res.data.map(
                (obj: any) =>
                    montarObjeto(
                        obj
                    )
            )
        );
    };

// ==============================
// BUSCAR OBJETO COMPLETO
// ==============================

export const buscarObjetoDetalhado =
    async (
        id: number
    ) => {

        const objeto =
            await buscarObjetoCompleto(
                id
            );

        return montarObjeto(
            objeto
        );
    };