import { useEffect } from "react";
import shallow from "zustand/shallow";
import { usePreviousImmediate as usePrevious } from "rooks";
import useMapStore from "./useMapStore";
import { useMemo } from "react";

/**
 * Sets the provided state on a map feature
 * @param {*} map
 * @param {*} feature
 * @param {*} state
 * @returns
 */
const setFeatureState = (map, feature, state) => {
  if (!feature) return;
  const featureProps = {
    source: feature.layer.source,
    id: feature.id,
  };
  const sourceLayer = feature.layer?.["source-layer"] || feature.sourceLayer;
  if (sourceLayer) featureProps["sourceLayer"] = sourceLayer;
  map.setFeatureState(featureProps, state);
};

/**
 * Removes state from a given feature
 * This is used to clear hover states
 * @param {*} map
 * @param {*} feature
 * @returns
 */
const removeFeatureState = (map, feature) => {
  const source = feature?.layer?.source;
  if (!source) return;
  const sourceLayer = feature?.layer?.["source-layer"];
  const update = { source };
  if (sourceLayer) update["sourceLayer"] = sourceLayer;
  // clear all hovered states (prevents sticking outlines)
  map.removeFeatureState(update);
};

/**
 * Remove hovered state for non-hovered feature layers
 * @param {*} map instance of mapboxgl map
 * @param {*} layers all custom layers on the map
 * @param {*} hoveredFeature currently hovered feature
 */
const clearSourceStates = (map, layers, hoveredFeature) => {
  if (!layers || !map) return;
  const hoveredFeatureSource = hoveredFeature?.layer?.source;
  const updateLayers = layers.filter(
    (layer) => layer.interactive && layer.source !== hoveredFeatureSource
  );
  if (!updateLayers.length) return;
  updateLayers.forEach((layer) => {
    const update = { source: layer.source };
    if (layer["source-layer"]) update["sourceLayer"] = layer["source-layer"];
    map.removeFeatureState(update);
  });
};

/**
 * Adds effects to set hovered + selected states for interactive features,
 * @returns an array of interactive layer ids.
 */
export default function useInteractiveLayers(map, layers) {
  // const map = useMapStore((state) => state.map);
  const isLoaded = map?.isStyleLoaded();
  const [hoveredFeature, selectedFeature] = useMapStore(
    (state) => [state.hoveredFeature, state.selectedFeature],
    shallow
  );
  const previousHoveredFeature = usePrevious(hoveredFeature);
  const previousSelectedFeature = usePrevious(selectedFeature);

  // set the currently hovered feature state
  useEffect(() => {
    if (!isLoaded || !map) return;
    // clear all hovered states on current + previous featues
    removeFeatureState(map, hoveredFeature);
    removeFeatureState(map, previousHoveredFeature);
    // remove all hover states from non-hovered sources (prevents sticking outlines)
    clearSourceStates(map, layers, hoveredFeature);
    // set hovered state
    setFeatureState(map, hoveredFeature, { hover: true });
    // set selected state
    setFeatureState(map, selectedFeature, { selected: true });
  }, [map, hoveredFeature, selectedFeature, isLoaded]);

  // remove the previous feature selected state
  useEffect(() => {
    const isSameFeature = selectedFeature?.id === previousSelectedFeature?.id;
    if (!map || !isLoaded || !previousSelectedFeature || isSameFeature) return;
    setFeatureState(map, previousSelectedFeature, { selected: false });
  }, [map, selectedFeature, previousSelectedFeature, isLoaded]);

  /**
   * Returns the ids of interactive layers
   */
  return useMemo(() => {
    return layers?.filter((l) => l.interactive).map((l) => l.id);
  }, [layers]);
}
