import useMapState from "./useMapState";

/**
 * Returns a fly to function, alias for map.flyTo() provided by mapboxgl
 * @returns {function}
 */
export default function useMapFlyTo() {
  return useMapState("flyTo");
}
