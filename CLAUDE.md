# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

WorldJS is a 2D tile-based RPG-style game engine built with **p5.js** (vanilla JavaScript, ES6 classes). It runs directly in the browser via `index.html` — no build system, bundler, or package manager. Just open `index.html` in a browser or use a local HTTP server.

## Architecture

### Game Loop (`sketch.js`)
p5.js `preload()` → `setup()` → `draw()` cycle. The `draw()` function runs at ~60 FPS, handles input (keyboard WASD/Space or touch), updates NPC movement, and renders the active environment with overlays.

### Core Engine (`src/`)
- **`object.js`** — Base `WorldObject` class with position and rectangular collision (`get_rect_points()`)
- **`agent.js`** — `Agent` (movement + collision) → `SpriteCharacter` (animated sprites) → used by NPCs and player
- **`NPC.js`** — `NPC` extends `SpriteCharacter` with random-walk AI and dialogue
- **`environment.js`** — `GridEnvironment` (fixed camera) and `ScrollingGridEnvironment` (camera follows player). Handles tile rendering, collision, passage triggers, and object interaction
- **`overlays.js`** — `Text` (multi-line dialogue boxes) and `Canvas` (drawable overlay surfaces like the Buddhabrot fractal)
- **`utils.js`** — `load_tile_arr()` slices sprite sheets into 2D arrays

### Configuration (`configs/`)
- **`globals.js`** — Sprite/tile config constants (`CHAR_SPRITES_CONFIG`, `ENV_TILES_CONFIG` with tile→coordinate mapping and walkability), touch button positions
- **`maps.js`** — Map tile grids, passage definitions (cross-map transitions), object placements, and `map_registry` (indices 0–5: home, room, stoner_room, fields, cave, lake_cave)
- **`character_configs.js`** — NPC sprite definitions and dialogue arrays
- **`object_configs.js`** — Interactive objects
- **`buddhabrot_canvas.js`** — Fractal canvas implementation

### Global State
The `world` object tracks runtime state: `world.current_env`, `world.player`, `world.text_instance`, `world.canvas_instance`.

## Key Technical Details

- **Tiles**: 17×17px sprites (16px offset + 1px border) from `data/tiles.png`. Tile IDs map to sprite coordinates via `ENV_TILES_CONFIG.mapping`. Walkability per tile type in `ENV_TILES_CONFIG.walkability`.
- **Characters**: 40×40px sprites from `data/character_sprites.png`. Color variants (red/blue/green/brown) offset by 8 sprites. Two-step walk animation per direction.
- **Canvas size**: 600×450px. Grid cell size: 30px (varies per map).
- **Input throttling**: `player_time_constant` (5 frames) between player moves.
- **Map passages**: Trigger zones in maps that transport the player to a target map + coordinates.
