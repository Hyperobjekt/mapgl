import React from "react";
import { Layer, Source } from "react-map-gl";

const getLayersForSourceId = (sourceId, layers) => {
  return layers.filter((layer) => layer.source === sourceId);
};

/**
 * Handles creating sources and layers for the map,
 * as well as managing feature states
 */
const Layers = ({ sources, layers }) => {
  if (!layers) return null;
  return (
    <>
      {sources.map(({ id, ...source }) => {
        return (
          <Source key={id} id={id} {...source}>
            {getLayersForSourceId(id, layers).map(
              ({ beforeId, interactive, ...layer }) => {
                return <Layer key={layer.id} beforeId={beforeId} {...layer} />;
              }
            )}
          </Source>
        );
      })}
    </>
  );
};

export default Layers;
