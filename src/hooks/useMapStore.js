import create from "zustand";
import bbox from "@turf/bbox";

const DEFAULT_FITBOUNDS_OPTS = {
  padding: 24,
};

const useMapStore = create((set, get) => ({
  // map loaded state
  loaded: false,
  setLoaded: (loaded) => set({ loaded }),
  // map instance
  map: null,
  setMap: (map) => set({ map }),
  // hovered feature state
  hoveredFeature: null,
  setHoveredFeature: (hoveredFeature) => set({ hoveredFeature }),
  // selected feature state
  selectedFeature: null,
  setSelectedFeature: (selectedFeature) => set({ selectedFeature }),
  // default map bounds
  bounds: null,
  setBounds: (bounds) => set({ bounds }),
  viewState: {},
  setViewState: (viewState) => {
    set({ viewState });
  },
  size: [500, 400],
  setSize: (size) => set({ size }),
  // helper functions
  flyToFeature: (feature, options) => {
    // make sure it's a feature
    if (feature?.type !== "Feature") return;
    const bounds = bbox(feature);
    get().flyToBounds(bounds, options);
  },
  flyTo: ({ latitude, longitude, ...options }) => {
    get().map.flyTo({
      center: [longitude, latitude],
      ...options,
    });
  },
  flyToBounds: (bbox, options = DEFAULT_FITBOUNDS_OPTS) => {
    get().map.fitBounds(bbox, options);
  },
  flyToDefault: () => {
    const bounds = get().bounds;
    bounds && get().map.flyToBounds(bounds);
  },
}));

export default useMapStore;
