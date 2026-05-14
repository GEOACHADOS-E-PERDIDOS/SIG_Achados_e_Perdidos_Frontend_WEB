// src/services/ClickMapaService.ts

import axios from "axios";

const API_URL = "http://localhost:8080";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// =========================
// GET FEATURE MAPA
// =========================
export const buscarFeatureMapa = async (
  map: any,
  latlng: any
) => {
  const bounds = map.getBounds();

  const size = map.getSize();

  const bbox = bounds.toBBoxString();

  const point =
    map.latLngToContainerPoint(latlng);

  const url = `
    /geoserver/Geoachados/wms
    ?service=WMS
    &version=1.1.1
    &request=GetFeatureInfo
    &layers=
    Geoachados:view_posto_retirada_map ,
    Geoachados:view_objeto_perdido_map,
    Geoachados:view_objeto_achado_map

    &query_layers=
    Geoachados:view_posto_retirada_map ,
    Geoachados:view_objeto_perdido_map,
    Geoachados:view_objeto_achado_map

    &styles=
    &bbox=${bbox}
    &feature_count=5
    &height=${size.y}
    &width=${size.x}
    &format=image/png
    &info_format=application/json
    &srs=EPSG:4326
    &x=${Math.floor(point.x)}
    &y=${Math.floor(point.y)}
  `.replace(/\s/g, "");

  const response = await fetch(url);

  return response.json();
};

// =========================
// BUSCAR OBJETO COMPLETO
// =========================
export const buscarObjetoCompleto =
  async (id: number) => {
    const res = await axios.get(
      `${API_URL}/objetos/${id}`,
      getAuthHeader()
    );

    return res.data;
  };

// =========================
// BUSCAR POSTO COMPLETO
// =========================
export const buscarPostoCompleto =
  async (id: number) => {
    const res = await axios.get(
      `${API_URL}/postos/${id}`,
      getAuthHeader()
    );

    return res.data;
  };


// =========================
// BUSCAR IMAGEM
// =========================
export const buscarImagem = async (
  caminho: string
) => {
  try {
    const res = await axios.get(
      `${API_URL}/uploads/${caminho}`,
      {
        ...getAuthHeader(),
        responseType: "blob",
      }
    );

    return URL.createObjectURL(res.data);
  } catch {
    return null;
  }
};