// MapDrawingLayer/utils/cloneLayer.ts
import L from 'leaflet';

export default function cloneLayer(originalLayer: any): L.Layer {
  let clonedLayer: L.Layer;

  if (originalLayer instanceof L.Polygon) {
    const latlngs = originalLayer.getLatLngs();
    const options = { ...originalLayer.options };
    clonedLayer = new L.Polygon(latlngs, options);
    
  } else if (originalLayer instanceof L.Rectangle) {
    const bounds = originalLayer.getBounds();
    const options = { ...originalLayer.options };
    clonedLayer = new L.Rectangle(bounds, options);
    
  } else {
    clonedLayer = originalLayer;
    
  }

  return clonedLayer;
}
