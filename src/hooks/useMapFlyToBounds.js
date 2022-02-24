import useMapState from "./useMapState";

/**
 * Returns a function that flys to provided bounds when called
 * @returns {function}
 */
export default function useMapFlyToBounds() {
  return useMapState("flyToBounds");
}
