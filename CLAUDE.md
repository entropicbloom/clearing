# worldJS

A 2D tile-based game built with p5.js. No build system — plain script tags in `index.html`. Canvas is 600x450.

## Project structure

- `sketch.js` — main game loop (`setup`/`draw`), input handling, passage transitions, scene drawing
- `src/` — core engine
  - `p5.js` — third-party graphics library
  - `environment.js` — `Environment` (base), `GridEnvironment`, `ScrollingGridEnvironment`
  - `agent.js` — `Agent` (movement logic), `SpriteCharacter` (sprite rendering)
  - `object.js` — `WorldObject` base class for all game entities
  - `NPC.js` — `NPC` class (extends `SpriteCharacter`) with random wandering AI and dialogue
  - `overlays.js` — `Text`, `TextObject`, `Canvas`, `CanvasObject`, `LinkObject`, `RectButton`
  - `utils.js` — `load_tile_arr()` for extracting sprites/tiles from spritesheets
  - `complex.js` — Complex number library (used by Buddhabrot)
- `configs/` — game data and configuration
  - `globals.js` — constants (`GRID_SIZE=30`, `DIRECTION_DELTA`, `CHAR_SPRITES_CONFIG`, `ENV_TILES_CONFIG`, touch button layout)
  - `character_configs.js` — sprite definitions (`player_sprites`, `old_man_sprites`, `stoner_dude_sprites`) and NPC instantiation
  - `object_configs.js` — `TextObject`, `LinkObject`, `CanvasObject` instances
  - `buddhabrot_canvas.js` — `BuddhabrotCanvas` class (extends `Canvas`) for fractal visualization
  - `maps/` — one file per map, plus `registry.js` for the map lookup table
- `data/` — image assets: `tiles.png` (tilesheet), `character_sprites.png`, `lake.jpg`

## Coordinate system

- Tiles are 30x30 pixels (`GRID_SIZE = 30`)
- Grid coordinates: `tile_i` = column, `tile_j` = row
- Tile arrays indexed as `tiles[j][i]` (row-major)
- Pixel position derived: `x = tile_i * GRID_SIZE + GRID_SIZE/2`, `y = tile_j * GRID_SIZE + GRID_SIZE/2`
- Directions use `DIRECTION_DELTA`: up={di:0,dj:-1}, down={di:0,dj:1}, left={di:-1,dj:0}, right={di:1,dj:0}

## Game loop (sketch.js)

1. **`setup()`** — creates canvas, loads tile/sprite arrays via `load_tile_arr()`, instantiates player `SpriteCharacter` at (10,13) on home_map, creates initial `ScrollingGridEnvironment`, calls `draw_scene()`
2. **`draw()` (every frame):**
   - Draws touch controls if touches detected (mobile)
   - If `player.isMoving`: calls `player.update_movement()` + `redraw_player_movement()`. On completion, checks `check_passage()` for map transitions
   - If idle and key held (`pressed_key`): calls `request_move(key)` to start movement
   - If no overlay active: calls `current_env.update_contents()` to advance NPC AI
   - If canvas overlay active: calls `canvas_instance.draw_canvas()`
3. **`key_action(key)`** — handles spacebar (interact/advance dialogue), E (dismiss overlay), movement keys
4. **`handle_passage(passage)`** — moves player to destination tile, creates new environment from `map_registry[destination_id]`, redraws scene

## Movement system

- `Agent.move(direction)` checks `tile_can_pass()`, then sets up interpolation: `fromX/Y` → `toX/Y` over `moveDuration=16` frames
- `Agent.update_movement()` linearly interpolates pixel position, toggles walk `step` at halfway point
- `SpriteCharacter` renders the correct sprite based on `orientation`, `step`, `legSide`, and color offset
- Sprite mirroring: right-facing uses left sprite with `scale(-1,1)`. Up/down step=1 alternates leg mirroring via `legSide`

## Environment rendering

**`GridEnvironment`** (non-scrolling): renders all tiles directly. Camera fixed at (0,0).

**`ScrollingGridEnvironment`** (scrolling): camera follows player. Offset = `floor(player_pos / GRID_SIZE) - floor(canvas_dim / 2 / GRID_SIZE)`. Only visible tiles rendered. Matrix transform smooths sub-tile movement.

**Tile validation** (`tile_can_pass`): checks bounds, tile walkability (see `ENV_TILES_CONFIG.walkability`), NPC blocking, and object collision via bounding rects.

**Interaction** (`interact(agent)`): looks at tile in agent's facing direction, finds objects there, calls first object's `interact()`.

## Maps

Each map is defined in its own file under `configs/maps/`. The `map_registry` in `registry.js` maps numeric IDs to map objects.

Map structure:
```
{ grid_size, tiles (2D array), passages, objects, scrolling (optional), bg_image (optional) }
```

| ID | File | Scrolling | Key features |
|----|------|-----------|-------------|
| 0 | home.js | yes | Starting area, old_man_1 NPC, passages to building/stoner house/fields/cave |
| 1 | building.js | no | Ground floor staircase, locked door, stairs up |
| 2 | stoner_room.js | no | Interior with Buddhabrot canvas, stoner_dude_1 NPC |
| 3 | fields.js | yes | Forest/clearing, old_man_2 NPC, whirlpool link |
| 4 | cave.js | yes | Purple cave system, passages to fields/home/lake |
| 5 | lake_cave.js | no | Lake background image, stoner_dude_lake NPC |
| 6 | building.js | no | Second floor apartment |
| 7 | building.js | no | Upper floor staircase, stairs down, door to apartment |

Passages use `{i, j, destination_id, new_i, new_j}` where `i` is column and `j` is row.

## NPCs and objects

**NPCs** extend `SpriteCharacter` with random wandering (10% chance per step, 12-frame countdown) and dialogue arrays. Spacebar triggers interaction → `Text` overlay.

**Interactive objects:**
- `TextObject` — displays dialogue via `Text` overlay
- `LinkObject` — opens URL via `window.open()`
- `CanvasObject` — activates a `Canvas` overlay (e.g., Buddhabrot fractal)

## Sprite system

- Tilesheet (`tiles.png`): 17px offset, 1px border per tile. Tile IDs map to `{x, y}` positions via `ENV_TILES_CONFIG.mapping`. Walkable tiles: [0,1,2,3,4,7,29,32,57,58,59,74,75]
- Character sprites (`character_sprites.png`): 40x40 per sprite, 16px offset. 4 color variants (red/blue/green/brown), 8 rows per color (`color_offset`). Each character has 2 steps × 4 directions
- `load_tile_arr()` extracts individual tiles/sprites from sheets into arrays

## Input handling

- **Keyboard**: W/A/S/D for movement (continuous via `pressed_key`), Space to interact/advance text, E to dismiss overlays
- **Touch** (mobile): 5 virtual `RectButton`s drawn on-screen (4 directional + spacebar)

## Script load order

Scripts are loaded via `<script>` tags in `index.html`. Order matters — dependencies must load before dependents:

1. `p5.js` → 2. `globals.js` → 3. `utils.js` → 4. `object.js` → 5. `agent.js` → 6. `overlays.js` → 7. `NPC.js` → 8. `character_configs.js` → 9. `complex.js` → 10. `buddhabrot_canvas.js` → 11. `object_configs.js` → 12. `environment.js` → 13. map files → 14. `registry.js` → 15. `sketch.js`
