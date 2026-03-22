# worldJS

A 2D tile-based game built with p5.js. No build system — plain script tags in `index.html`.

## Project structure

- `sketch.js` — main game loop, input handling, passage transitions
- `src/` — core engine: environment/grid rendering, agents, NPCs, overlays, objects
- `configs/` — game data and configuration
  - `globals.js` — constants, tile configs, sprite configs
  - `character_configs.js` — character sprite definitions
  - `object_configs.js` — NPC and interactive object definitions
  - `buddhabrot_canvas.js` — in-game canvas art
  - `maps/` — one file per map, plus `registry.js` for the map lookup table
- `data/` — image assets (tilesheet, sprites, backgrounds)

## Maps

Each map is defined in its own file under `configs/maps/`. The `map_registry` in `registry.js` maps numeric IDs to map objects. Maps reference objects defined in `object_configs.js`, so map scripts must load after that.

Scrolling maps set `'scrolling': true` and use `ScrollingGridEnvironment`.

Passages use `{i, j, destination_id, new_i, new_j}` where `i` is column and `j` is row.

## Script load order

Scripts are loaded via `<script>` tags in `index.html`. Order matters — dependencies must load before dependents. The map files load after all configs and engine code, and `registry.js` loads last among the map files.
