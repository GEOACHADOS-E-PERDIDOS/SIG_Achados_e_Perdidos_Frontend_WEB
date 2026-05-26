import { useEffect } from "react";
import { useMap } from "react-leaflet";

export function AtualizarMapa({
  refreshKey
}: {
  refreshKey:number
}) {

  const map = useMap();

  useEffect(() => {

    map.invalidateSize();

    map.eachLayer((layer:any) => {

      if (layer.redraw) {
        layer.redraw();
      }

    });

  }, [refreshKey]);

  return null;
}