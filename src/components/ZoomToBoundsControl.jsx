import { useControl } from "react-map-gl";

const DOM = {};
DOM.create = function (tagName, className, container) {
  const el = window?.document.createElement(tagName);
  if (!el) return;
  if (className !== undefined) el.className = className;
  if (container) container.appendChild(el);
  return el;
};

const defaultOptions = {
  bounds: [
    [-180, -90],
    [180, 90],
  ],
  padding: 24,
};

// Control implemented as ES6 class
class BoundsControl {
  _map;
  options;
  _container;
  _boundsButton;
  _handler;

  constructor(options) {
    this.options = { ...defaultOptions, ...options };
    const { bounds, className, ...rest } = this.options;
    this._container = DOM.create(
      "div",
      `mapboxgl-ctrl mapboxgl-ctrl-group ${className}`
    );
    this._container.addEventListener("contextmenu", (e) => e.preventDefault());
    this._boundsButton = this._createButton(
      "mapboxgl-ctrl-zoom-bounds",
      (e) => {
        if (this._map) this._map.fitBounds(bounds, rest);
      }
    );
    DOM.create("span", `mapboxgl-ctrl-icon`, this._boundsButton).setAttribute(
      "aria-hidden",
      true
    );
  }
  onAdd(map) {
    this._map = map;
    return this._container;
  }

  onRemove() {
    this._container.parentNode.removeChild(this._container);
    this._map = undefined;
  }
  _createButton(className, fn) {
    const a = DOM.create("button", className, this._container);
    a.type = "button";
    a.addEventListener("click", fn);
    return a;
  }
}

function ZoomToBoundsControl(props) {
  useControl(() => new BoundsControl(props), {
    position: props.position,
  });

  return null;
}

export default ZoomToBoundsControl;
