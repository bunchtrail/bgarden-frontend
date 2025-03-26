// MapDrawingLayer/utils/cloneLayer.ts
import L from 'leaflet';
import { logDebug } from './logDebug';

export default function cloneLayer(originalLayer: any): L.Layer {
  let clonedLayer: L.Layer;

  if (originalLayer instanceof L.Polygon) {
    const latlngs = originalLayer.getLatLngs();
    const options = { ...originalLayer.options };
    clonedLayer = new L.Polygon(latlngs, options);
    logDebug('Клонирован полигон', { originalId: (originalLayer as any)._leaflet_id, latlngs });
  } else if (originalLayer instanceof L.Rectangle) {
    const bounds = originalLayer.getBounds();
    const options = { ...originalLayer.options };
    clonedLayer = new L.Rectangle(bounds, options);
    logDebug('Клонирован прямоугольник', { originalId: (originalLayer as any)._leaflet_id, bounds });
  } else {
    clonedLayer = originalLayer;
    logDebug('Копирован другой тип слоя', {
      originalId: (originalLayer as any)._leaflet_id,
      type: originalLayer.constructor.name
    });
  }

  return clonedLayer;
}
