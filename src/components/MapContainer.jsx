import React, { useEffect } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import useResizeObserver from "use-resize-observer";
import { useMapStore } from "../hooks";

/**
 * Container for the map that fills the parent container and updates
 * map size on changes.
 */
const MapContainer = ({ className, children, ...props }) => {
  // track the size of the container element
  const { ref, width = 1, height = 1 } = useResizeObserver();

  // setter for size in the map store
  const setSize = useMapStore((state) => state.setSize);

  // set the map dimensions to the container size (fill container)
  useEffect(() => {
    width > 1 && height > 1 && setSize([width, height]);
  }, [width, height, setSize]);

  return (
    <div ref={ref} className={clsx("HypMapGL-root", className)} {...props}>
      {children}
    </div>
  );
};

MapContainer.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

export default MapContainer;
