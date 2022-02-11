# MapGL

This library is a wrapper for `react-map-gl` that provides some functionality out of the box, including:

- controls for flying to bounds on the map (`<ZoomToBoundsControl />`)
- sizing the map to fill the parent container
- managing hover and selected state on interactive features
- providing map view state, hovered feature, selected feature via global store

## Demo

- [codesandbox](https://codesandbox.io/s/mapgl-demo-zns7y?file=/src/App.js)

## Components

### `<MapGL />`

#### Props

- `mapboxAccessToken`: **required** mapbox access token
- `children`: any children (e.g. legend)
- `onMouseMove`: handler function for hovering over a feature
- `onMouseLeave`: handler function for leaving a feature
- `onClick`: handler function for clicking on a feature
- `onLoad`: handler function for when the map has loaded
- `ContainerProps`: an object containing props to pass to the container div
- `sources`: an array of [source objects](https://docs.mapbox.com/mapbox-gl-js/style-spec/sources/) following mapboxgl source format
- `layers`: an array of [layer styles](https://docs.mapbox.com/mapbox-gl-js/style-spec/layers/) (with optional additional parameters for `beforeId` and `interactive`)

Any additional props are passed on to the [ReactMapGL Map](https://visgl.github.io/react-map-gl/)

#### Usage

**A map centered on New York City**

```js
import MapGL from "@hyperobjekt/mapgl";
import "@hyperobjekt/mapgl/dist/style.css";

const NycMap = (props) => (
  <MapGL
    bounds={[
      [-74.05, 40.47],
      [-73.9, 40.9],
    ]}
    {...props}
  />
);
```

### `<ZoomToBoundsControl />`

Adds a control that zooms to the provided bounds when clicked.

> Note: you can customize the icon by providing some CSS to override the existing `background-image` property.

#### Props

Any options that can be passed to [fitBounds](https://docs.mapbox.com/mapbox-gl-js/api/map/#map#fitbounds) are accepted as props.

#### Usage

```js
import MapGL, { ZoomToBoundsControl } from "@hyperobjekt/mapgl";
import "@hyperobjekt/mapgl/dist/style.css";

const ZoomToBoundsMap = (props) => (
  <MapGL {...props}>
    <ZoomToBoundsControl
      bounds={[
        [-73.9876, 40.7661],
        [-73.9397, 40.8002],
      ]}
    />
  </MapGL>
);
```

## Hooks

### useMapStore()

This is the store for all of the map state.

The following can be retrieved from the store:

- `loaded`: true or false, depending on if the map is loaded or not
- `setLoaded`: setter for loaded state
- `map`: the map instance
- `setMap`: setter for the map instance
- `viewState`: the current viewport object
- `setViewState`: setter for current viewport
- `hoveredFeature`: the currently hovered feature (if any)
- `setHoveredFeature`: setter for hovered feature
- `selectedFeature`: the currently selected feature (if any)
- `setSelectedFeature`: setter for selected feature
- `flyToFeature(feature, options)`: function to fly to the bounds of a feature
- `flyToBounds(bounds, options)`: function to fly to the provided bounds (see [fitBounds](https://docs.mapbox.com/mapbox-gl-js/api/map/#map#fitbounds) for options)
- `flyTo(options)`: function to fly to the provided viewport (see [flyTo](https://docs.mapbox.com/mapbox-gl-js/api/map/#map#flyto) for options)

#### Usage

the map store is a zustand store. use a selector function to retrieve values.

**Example:** retrieve the hovered feature

```js
/**
 * Renders the currently hovered feature name
 */
const HoveredFeatureName = () => {
  const hoveredFeature = useMapStore((state) => state.hoveredFeature);
  return <p>{hoveredFeature?.properties?.name}</p>;
};
```
