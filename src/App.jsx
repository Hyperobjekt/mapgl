import React, { useEffect, useRef } from "react";
import { MapGL, useMapFlyToFeature, useMapState, ZoomToBoundsControl } from ".";
import {
  FullscreenControl,
  GeolocateControl,
  NavigationControl,
} from "react-map-gl";

const SOURCES = [
  {
    id: "states_choropleth",
    type: "vector",
    tiles: [
      "https://spi-tilesets.s3.us-west-2.amazonaws.com/v0.0.1/states/{z}/{x}/{y}.pbf",
    ],
  },
  {
    id: "cities_choropleth",
    type: "vector",
    tiles: [
      "https://spi-tilesets.s3.us-west-2.amazonaws.com/v0.0.1/cities/{z}/{x}/{y}.pbf",
    ],
  },
];
const LAYERS = [
  {
    id: "states-choropleth",
    source: "states_choropleth",
    "source-layer": "states",
    type: "fill",
    paint: {
      "fill-color": "rgba(255,0,0,1)",
      "fill-opacity": [
        "interpolate",
        ["linear"],
        ["get", "bhn"],
        50,
        0.1,
        80,
        0.8,
      ],
    },
    beforeId: "water",
    interactive: true,
  },
  {
    id: "states-outline",
    source: "states_choropleth",
    "source-layer": "states",
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
  {
    id: "cities-bubble",
    source: "cities_choropleth",
    "source-layer": "cities-centers",
    type: "circle",
    paint: {
      "circle-color": "rgba(255,0,0,1)",
      "circle-opacity": [
        "interpolate",
        ["linear"],
        ["get", "bhn"],
        50,
        0.1,
        80,
        0.8,
      ],
    },
    beforeId: "road-label",
    interactive: true,
  },
  {
    id: "cities-bubble-outline",
    source: "cities_choropleth",
    "source-layer": "cities-centers",
    type: "circle",
    paint: {
      "circle-stroke-color": [
        "case",
        ["boolean", ["feature-state", "hover"], false],
        "rgba(255,0,255,1)",
        [
          "case",
          ["boolean", ["feature-state", "selected"], false],
          "rgba(0,255,255,1)",
          "rgba(255,0,0,1)",
        ],
      ],

      "circle-stroke-width": [
        "case",
        ["boolean", ["feature-state", "hover"], false],
        5,
        ["case", ["boolean", ["feature-state", "selected"], false], 5, 1],
      ],
      "circle-color": "transparent",
      "circle-opacity": 1,
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
  // get a reference to the map instance
  const ref = useRef();
  console.debug("map instance:", ref.current);

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
      ref={ref}
    >
      <FullscreenControl />
      <GeolocateControl />
      <NavigationControl />
      <ZoomToBoundsControl bounds={US_BOUNDS} />
    </MapGL>
  );
}

export default App;
