import React, { useEffect } from "react";
import { MapGL, useMapFlyToFeature, useMapState, ZoomToBoundsControl } from ".";
import {
  FullscreenControl,
  GeolocateControl,
  NavigationControl,
} from "react-map-gl";

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

const MAP_STYLE = "mapbox://styles/hyperobjekt/cke1roqr302yq19jnlpc8dgr9";

function App() {
  // function that flys the map to a provided feature
  const flyToFeature = useMapFlyToFeature();

  // feature that was last clicked
  const selectedFeature = useMapState("selectedFeature");

  // fly to feature when clicked
  useEffect(() => {
    selectedFeature && flyToFeature(selectedFeature);
  }, [selectedFeature, flyToFeature]);
  return (
    <MapGL
      mapboxAccessToken={TOKEN}
      sources={SOURCES}
      layers={LAYERS}
      mapStyle={MAP_STYLE}
    >
      <FullscreenControl />
      <GeolocateControl />
      <NavigationControl />
      <ZoomToBoundsControl bounds={US_BOUNDS} />
    </MapGL>
  );
}

export default App;
