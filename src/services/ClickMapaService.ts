import axios from "axios";

const API_URL = "http://localhost:8080";

/* ===================================================== */
/* AUTH HEADER */
/* ===================================================== */

const getAuthHeader = () => {
  console.log(localStorage.getItem("token"));
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

/* ===================================================== */
/* GET FEATURE MAPA */
/* ===================================================== */

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
    Geoachados:view_posto_retirada_map,
    Geoachados:view_objeto_perdido_map,
    Geoachados:view_objeto_achado_map

    &query_layers=
    Geoachados:view_posto_retirada_map,
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

  const text = await response.text();

  console.log(text);

  return JSON.parse(text);
};

/* ===================================================== */
/* BUSCAR OBJETO COMPLETO */
/* ===================================================== */

/* ===================================================== */
/* BUSCAR OBJETO COMPLETO */
/* ===================================================== */

export const buscarObjetoCompleto =
  async (id: number) => {

    const res = await axios.get(
      `${API_URL}/objetos/${id}`,
      getAuthHeader()
    );

    const objeto = res.data;

    // Se existir posto associado
    if (objeto.postoId) {

      try {

        const posto =
          await buscarPostoCompleto(
            objeto.postoId
          );
        return {
          ...objeto,
          nomePosto: posto.nome
        };

      } catch (error) {

        console.error(
          "Erro ao buscar posto:",
          error
        );
      }
    }

    return objeto;
  };

/* ===================================================== */
/* BUSCAR POSTO COMPLETO */
/* ===================================================== */

export const buscarPostoCompleto =
  async (id: number) => {

    const res = await axios.get(

      `${API_URL}/postos/${id}`,

      getAuthHeader()
    );

    return res.data;
  };

/* ===================================================== */
/* BUSCAR UMA IMAGEM */
/* ===================================================== */

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

  } catch (error) {

    console.error(
      "Erro ao buscar imagem:",
      caminho,
      error
    );

    return null;
  }
};

/* ===================================================== */
/* BUSCAR TODAS IMAGENS */
/* ===================================================== */

export const buscarImagens = async (
  caminhos: string[]
) => {

  if (!caminhos || caminhos.length === 0) {
    return [];
  }

  const imagens = await Promise.all(

    caminhos.map(async (caminho) => {

      return await buscarImagem(caminho);

    })
  );

  return imagens.filter(Boolean);
};

