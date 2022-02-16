import { useEffect } from "react";
import shallow from "zustand/shallow";
import { usePreviousImmediate as usePrevious } from "rooks";
import useMapStore from "./useMapStore";

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
 * Removes state from a given feature (or previous feature)
 * This is used to clear hover states
 * @param {*} map
 * @param {*} feature
 * @param {*} previousFeature
 * @returns
 */
const removeFeatureState = (map, feature, previousFeature) => {
  const source = feature?.layer?.source || previousFeature?.layer?.source;
  if (!source) return;
  const sourceLayer =
    feature?.layer?.["source-layer"] ||
    previousFeature?.layer?.["source-layer"];
  const update = { source };
  if (sourceLayer) update["sourceLayer"] = sourceLayer;
  // clear all hovered states (prevents sticking outlines)
  map.removeFeatureState(update);
};

/**
 * Takes hovered and selected features from the store and adds appropriate state
 */
export default function useInteractiveLayers() {
  const map = useMapStore((state) => state.map);
  const isLoaded = map?.isStyleLoaded();
  const [hoveredFeature, selectedFeature] = useMapStore(
    (state) => [state.hoveredFeature, state.selectedFeature],
    shallow
  );
  const previousHoveredFeature = usePrevious(hoveredFeature);
  const previousSelectedFeature = usePrevious(selectedFeature);

  // set the currently hovered feature state
  useEffect(() => {
    if (!isLoaded) return;
    // clear all hovered states (prevents sticking outlines)
    removeFeatureState(map, hoveredFeature, previousHoveredFeature);
    // set hovered state
    setFeatureState(map, hoveredFeature, { hover: true });
    // set selected state
    setFeatureState(map, selectedFeature, { selected: true });
  }, [hoveredFeature, selectedFeature, isLoaded]);

  // remove the previous feature selected state
  useEffect(() => {
    const isSameFeature = selectedFeature?.id === previousSelectedFeature?.id;
    if (!isLoaded || !previousSelectedFeature || isSameFeature) return;
    setFeatureState(map, previousSelectedFeature, { selected: false });
  }, [selectedFeature, previousSelectedFeature, isLoaded]);
}
