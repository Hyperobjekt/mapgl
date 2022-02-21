# Changelog

## [1.1.5] - 2022-02-21

- fix: ensure the map resizes when the window changes width
- fix: forward map ref from the MapGL component

## [1.1.4] - 2022-02-16

- fix: add github repo and css exports to package.json

## [1.1.3] - 2022-02-15

- fix: specify sourceLayer on state changes if it exists

## [1.1.1] - 2022-02-12

- fix: pass options from `flyToDefault` to `fitBounds`
- fix: pass original event to callback functions

## [1.1.0] - 2022-02-12

- feat: add `useMapState` hook for easy state selection
- feat: add `useMapFlyTo`,`useMapFlyToBounds` ,`useMapFlyToFeature`, and `useMapFlyToDefault` hook to provide easy access to fly functions
- fix: update `usePrevious` hook to non-deprecated version
- fix: set cursor when hovering features

## [1.0.1] - 2022-02-11

- remove console log 😬

## [1.0.0] - 2022-02-11

- intial release
