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
  map.setFeatureState(featureProps, state);
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
    const source =
      hoveredFeature?.layer?.source || previousHoveredFeature?.layer?.source;
    // clear all hovered states (prevents sticking outlines)
    source && map.removeFeatureState({ source });
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
