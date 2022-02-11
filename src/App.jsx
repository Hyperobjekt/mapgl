import React, { useEffect } from "react";
import { MapGL, useMapStore } from ".";
import {
  FullscreenControl,
  GeolocateControl,
  NavigationControl,
} from "react-map-gl";
import ZoomToBoundsControl from "./components/ZoomToBoundsControl.jsx";

const SOURCES = [
  {
    id: "states",
    type: "geojson",
    data: "https://gist.githubusercontent.com/Lane/f65bab1dc5581c58be8da8329fe56821/raw/6715ccae5d2b24c3e7f31a628c1de5d8725daf90/us-states.json",
  },
];
const LAYERS = [
  {
    id: "states-choropleth",
    source: "states",
    type: "fill",
    paint: {
      "fill-color": "rgba(255,0,0,1)",
      "fill-opacity": [
        "interpolate",
        ["linear"],
        ["get", "density"],
        1,
        0.1,
        50,
        0.4,
        500,
        0.8,
      ],
    },
    beforeId: "water",
    interactive: true,
  },
  {
    id: "states-outline",
    source: "states",
    type: "line",
    paint: {
      "line-color": "rgba(255,0,0,1)",
      "line-width": [
        "case",
        ["boolean", ["feature-state", "hover"], false],
        5,
        ["case", ["boolean", ["feature-state", "selected"], false], 5, 1],
      ],
    },
    beforeId: "road-label",
  },
];

const TOKEN = `pk.eyJ1IjoiaHlwZXJvYmpla3QiLCJhIjoiY2pzZ3Bnd3piMGV6YTQzbjVqa3Z3dHQxZyJ9.rHobqsY_BjkNbqNQS4DNYw`;

// bounds for continental US
const US_BOUNDS = [
  [-130, 24],
  [-65, 50],
];

function App() {
  const flyToFeature = useMapStore((state) => state.flyToFeature);
  const selectedFeature = useMapStore((state) => state.selectedFeature);
  useEffect(() => {
    console.log("selected feature effect triggered");
    selectedFeature && flyToFeature(selectedFeature);
  }, [selectedFeature, flyToFeature]);
  return (
    <MapGL mapboxAccessToken={TOKEN} sources={SOURCES} layers={LAYERS}>
      <FullscreenControl />
      <GeolocateControl />
      <NavigationControl />
      <ZoomToBoundsControl bounds={US_BOUNDS} />
    </MapGL>
  );
}

export default App;
