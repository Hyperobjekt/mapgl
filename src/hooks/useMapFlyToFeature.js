import useMapState from "./useMapState";

/**
 * Returns a function that flys to a provided feature when called
 * @returns {function}
 */
export default function useMapFlyToFeature() {
  return useMapState("flyToFeature");
}
