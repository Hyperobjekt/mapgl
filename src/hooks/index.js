import useMapState from "./useMapState";

export { default as useMapStore } from "./useMapStore";
export { useMapState };

export function useMapFlyTo() {
  return useMapState("flyTo");
}
export function useMapFlyToFeature() {
  return useMapState("flyToFeature");
}
export function useMapFlyToBounds() {
  return useMapState("flyToBounds");
}
export function useMapFlyToDefault() {
  return useMapState("flyToDefault");
}
