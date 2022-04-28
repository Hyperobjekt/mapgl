import React, { useEffect, useCallback, useRef } from "react";
import PropTypes from "prop-types";
import Map from "react-map-gl";
import shallow from "zustand/shallow";
import { useMapStore } from "../hooks";
import Layers from "./Layers";
import "mapbox-gl/dist/mapbox-gl.css";
import MapContainer from "./MapContainer";
import { useInteractiveLayers } from "../hooks";
import "./MapGL.css";

/**
 * A component for rendering an interactive MapGL map based off of [ReactMapGL](https://github.com/visgl/react-map-gl)
 *
 * To use this component add it to your project
 *`
 * ```
 * npm install @hyperobjekt/mapgl
 * ```
 * or
 * ```
 * yarn add @hyperobjekt/mapgl
 * ```
 *
 * Then import it into your project with:
 *
 * ```
 * import MapGL from "@hyperobjekt/mapgl"
 * ```
 */
const MapGL = React.forwardRef(
  (
    {
      className,
      children,
      style,
      bounds,
      sources,
      layers,
      onMove,
      onMouseMove,
      onClick,
      onLoad,
      onMouseLeave,
      ContainerProps,
      ...props
    },
    ref
  ) => {
    // pull required state from store
    const [
      loaded,
      setLoaded,
      [width, height],
      viewState,
      setViewState,
      setMap,
      setBounds,
      selectedFeature,
      setSelectedFeature,
      hoveredFeature,
      setHoveredFeature,
    ] = useMapStore(
      (state) => [
        state.loaded,
        state.setLoaded,
        state.size,
        state.viewState,
        state.setViewState,
        state.setMap,
        state.setBounds,
        state.selectedFeature,
        state.setSelectedFeature,
        state.hoveredFeature,
        state.setHoveredFeature,
      ],
      shallow
    );

    // use ref if one is provided, otherwise create a local ref to use
    const _ref = useRef();
    const internalRef = ref || _ref;

    // interactive layers hook adds hovered / selected states to features
    const interactiveLayerIds = useInteractiveLayers(
      internalRef.current,
      layers
    );

    // set the default / reset viewport when it changes
    useEffect(() => {
      bounds && setBounds(bounds);
    }, [bounds, setBounds]);

    // update the canvas size on width / height changes
    useEffect(() => {
      internalRef?.current?.resize();
    }, [width, height]);

    const cursor = hoveredFeature ? "pointer" : "auto";

    // sets loading state in the store and fires callback
    const handleLoad = useCallback(
      (event) => {
        if (loaded) return;
        setLoaded(true);
        setMap(event.target);
        onLoad && onLoad(event); // trigger load callback
      },
      [onLoad, loaded, setLoaded, setMap]
    );

    // sets view state in the store and fires callback
    const handleMove = useCallback(
      (event) => {
        if (event.viewState) setViewState(event.viewState);
        onMove && onMove(event);
      },
      [onMove, setViewState]
    );

    // updates the hovered feature in the store and fires callback
    const handleMouseMove = useCallback(
      (event) => {
        const { originalEvent, features } = event;
        // if we are hovering outside of the map overlay
        if (!originalEvent?.target?.classList.contains("mapboxgl-canvas"))
          return setHoveredFeature(null);
        const newHoveredFeature =
          features && features.length > 0 ? features[0] : null;
        const isNew = hoveredFeature?.id !== newHoveredFeature?.id;
        isNew && setHoveredFeature(newHoveredFeature);
        onMouseMove && onMouseMove(event);
      },
      [onMouseMove, setHoveredFeature, hoveredFeature]
    );

    // clear the hovered feature in the store and fires callback
    const handleMouseLeave = useCallback(
      (event) => {
        setHoveredFeature(null);
        onMouseLeave && onMouseLeave(event);
      },
      [setHoveredFeature, onMouseLeave]
    );

    // update the selected feature in the store, and fire callback
    const handleClick = useCallback(
      (event) => {
        const { originalEvent, features } = event;
        // if we are clicking outside of the map overlay, return
        if (!originalEvent?.target?.classList.contains("mapboxgl-canvas"))
          return;
        const clickedFeature = features?.[0];
        const isNew = selectedFeature?.id !== clickedFeature?.id;
        // activate feature if one was clicked and this isn't a control click
        setSelectedFeature(isNew ? clickedFeature : null);
        onClick && onClick(event);
      },
      [onClick, selectedFeature, setSelectedFeature]
    );

    return (
      <MapContainer
        onMouseLeave={handleMouseLeave}
        className={className}
        {...ContainerProps}
      >
        <Map
          className={"HypMapGL-map"}
          ref={internalRef}
          onMove={handleMove}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
          onLoad={handleLoad}
          interactiveLayerIds={interactiveLayerIds}
          style={{ width, height, ...style }}
          bounds={bounds}
          cursor={cursor}
          {...viewState}
          {...props}
        >
          {sources && layers && <Layers sources={sources} layers={layers} />}
          {children}
        </Map>
      </MapContainer>
    );
  }
);

MapGL.defaultProps = {
  ContainerProps: {},
  dragRotate: false,
  touchRotate: false,
  dragPan: true,
  touchZoom: true,
};

MapGL.propTypes = {
  /** URL to the mapbox style */
  mapStyle: PropTypes.string,
  /** props to pass to the container component  */
  ContainerProps: PropTypes.object,
  /** handler for when an interactive feature layer is hovered */
  onMouseMove: PropTypes.func,
  /** handler for when an interactive feature is clicked */
  onClick: PropTypes.func,
  /** handler for when the map loads */
  onLoad: PropTypes.func,
  children: PropTypes.node,
};

export default MapGL;
