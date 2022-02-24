import useMapState from "./useMapState";

/**
 * Returns a function that flys to the default viewport when called
 * @returns {function}
 */
export default function useMapFlyToDefault() {
  return useMapState("flyToDefault");
}
