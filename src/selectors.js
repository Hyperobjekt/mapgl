import WebMercatorViewport from "viewport-mercator-project";
import bbox from "@turf/bbox";

/**
 * Returns the geometry type for a feature
 * @param {*} feature
 * @returns {string}
 */
export const getFeatureGeometryType = (feature) => {
  if (!feature.geometry || !feature.geometry.type) return null;
  return feature.geometry.type;
};

/**
 * Returns updated viewport that centers the viewport on a given feature
 * @param {*} feature
 * @param {*} initialViewport
 * @returns {object} { latitude, longitude, zoom }
 */
export const getViewportForFeature = (feature, initialViewport) => {
  const type = getFeatureGeometryType(feature);
  if (!type) return {};
  if (type === "Point") {
    const [longitude, latitude] = feature.geometry.coordinates;
    return {
      latitude,
      longitude,
      zoom: 14,
    };
  }
  const featureBbox = bbox(feature);
  const bounds = [
    [featureBbox[0], featureBbox[1]],
    [featureBbox[2], featureBbox[3]],
  ];
  return getViewportForBounds(bounds, initialViewport);
};

/**
 * Returns updated viewport state given bounds
 * @param {array} bounds [[minX, minY], [maxX, maxY]]
 * @param {*} baseViewport a base viewport to extent (default: `{}`)
 * @param {*} options object with options ({padding})
 * @returns
 */
export const getViewportForBounds = (
  bounds,
  baseViewport = {},
  options = {}
) => {
  const width = baseViewport.width;
  const height = baseViewport.height;
  const padding = options.padding || 20;
  const vp = new WebMercatorViewport({
    width,
    height,
  }).fitBounds(bounds, { padding });
  return {
    ...baseViewport,
    latitude: vp.latitude,
    longitude: vp.longitude,
    zoom: vp.zoom,
  };
};
