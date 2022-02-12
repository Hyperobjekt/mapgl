import { useMapStore } from ".";

/** Shortcut hook for pulling individual items from map store */
export default function useMapState(key) {
  return useMapStore((state) => state[key]);
}
