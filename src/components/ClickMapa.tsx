import { useMapEvents, Popup } from "react-leaflet";
import { useState } from "react";


function ClickMapa() {

    const [popup, setPopup] = useState<any>(null);

    const map = useMapEvents({
        async click(e) {

            const bounds = map.getBounds();
            const size = map.getSize();

            const bbox = bounds.toBBoxString();

            const point = map.latLngToContainerPoint(e.latlng);

            const url = `
        /geoserver/Geoachados/wms
        ?service=WMS
        &version=1.1.1
        &request=GetFeatureInfo
        &layers=
        Geoachados:posto_retirada,
        Geoachados:objeto_perdido,
        Geoachados:view_objeto_achado_map

        &query_layers=
        Geoachados:posto_retirada,
        Geoachados:objeto_perdido,
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

            const data = await response.json();

            if (data.features.length > 0) {

                const feature = data.features[0];

                setPopup({
                    latlng: e.latlng,
                    properties: feature.properties
                });

            } else {

                setPopup(null);
            }
        }
    });

    return popup ? (
        <Popup
            position={popup.latlng}
        >
            <div>
                <h3>{popup.properties.nome}</h3>

                <p>
                    {popup.properties.descricao}
                </p>
            </div>
        </Popup>
    ) : null;
}


export default ClickMapa;