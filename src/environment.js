Array.range = (start, end) => Array.from({length: (end - start)}, (v, k) => k + start);

class Environment {

    constructor(bg_image_name) {
        this.bg_image = pictures[bg_image_name]
    }

    initialize_contents() {}

    update_contents() {
        for (var i = 0; i < this.objects.length; i++) {
            this.objects[i].update_object();
        }
    }

    draw_contents() {
        for (var i = 0; i < this.objects.length; i++) {
            this.objects[i].draw_object();
        }
    }

    draw_background() {
        if (this.bg_image != null) {
            image(this.bg_image, 0, 0, this.env_width, this.env_height)
        } else {
            background(0, 0, 0)
        }
    }

    redraw_at_object(object) {}

    tile_can_pass(tile_i, tile_j, moving_object) { return true; }

    check_passage(object) { return null; }

    move_environment(position) {}

    get_i_offset() {return 0}

    get_j_offset() {return 0}

    get_x_offset() {return this.get_i_offset() * this.grid_size}

    get_y_offset() {return this.get_j_offset() * this.grid_size}

    add_offset(tile) {
        return {i: tile.i + this.get_i_offset(), j: tile.j + this.get_j_offset()}
    }

    subtract_offset(tile) {
        return {i: tile.i - this.get_i_offset(), j: tile.j - this.get_j_offset()}
    }

    interact(interacting_agent) {}
}

class GridEnvironment extends Environment {

    constructor(world, tile_dict, grid_map) {
        super(grid_map['bg_image'])
        this.world = world;
        this.tile_dict = tile_dict;
        this.grid_map = grid_map;
        this.grid_size = grid_map['grid_size'];
        this.env_width = grid_map['tiles'][0].length * this.grid_size;
        this.env_height = grid_map['tiles'].length * this.grid_size;
        this.tile_arr = load_tile_arr(40, 30, tile_dict, pictures['tiles_png']);

        this.initialize_contents();
    }

    initialize_contents() {
        this.objects = this.grid_map['objects'];
        for (var i = 0; i < this.objects.length; i++) {
            this.objects[i].world = this.world;
        }
    }

    draw_environment() {
        this.draw_background()
        for (var j_val = 0; j_val < this.grid_map['tiles'].length; j_val++) {
            for (var i_val = 0; i_val < this.grid_map['tiles'][0].length; i_val++) {
                var tile = {i: i_val, j: j_val}
                this.draw_cell(tile, tile);
            }
        }
    }

    draw_cell(tile, tile_place) {
        if (tile.i >= this.grid_map['tiles'][0].length || tile.j >= this.grid_map['tiles'].length ||
            tile.i < 0 || tile.j < 0) {
            return
        }

        var tile_type = this.grid_map['tiles'][tile.j][tile.i];

        if (tile_type >= 0) {
            var tile_coordinates = this.tile_dict['mapping'][tile_type];
            var tile_img = this.tile_arr[tile_coordinates.x][tile_coordinates.y];
            image(tile_img, tile_place.i * this.grid_size, tile_place.j * this.grid_size, this.grid_size, this.grid_size);
        }
    }

    redraw_at_object(object) {
        var covered_tiles = this.get_covered_tiles(object);
        for (var i = 0; i < covered_tiles.length; i++) {
            this.draw_cell(covered_tiles[i], this.subtract_offset(covered_tiles[i]));
        }
    }

    to_grid_coordinates(position) {
        var i_val = parseInt(position.x / this.grid_size);
        var j_val = parseInt(position.y / this.grid_size);
        return {i: i_val, j: j_val};
    }

    get_covered_tiles(object) {
        var rect_points = object.get_rect_points();
        var min_i = 999;
        var max_i = 0;
        var min_j = 999;
        var max_j = 0;

        for (var i = 0; i < rect_points.length; i++) {
            var rect_points_tile = this.to_grid_coordinates(rect_points[i]);
            min_i = Math.min(min_i, rect_points_tile.i);
            min_j = min(min_j, rect_points_tile.j);
            max_i = max(max_i, rect_points_tile.i);
            max_j = max(max_j, rect_points_tile.j);
        }

        var covered_tiles = [];
        for (var i_val = min_i; i_val <= max_i; i_val++) {
            for (var j_val = min_j; j_val <= max_j; j_val++) {
                covered_tiles.push({i: i_val, j: j_val});
            }
        }

        return covered_tiles;
    }

    tile_can_pass(tile_i, tile_j, moving_object) {
        // bounds check
        if (tile_i < 0 || tile_j < 0 ||
            tile_i >= this.grid_map['tiles'][0].length ||
            tile_j >= this.grid_map['tiles'].length) {
            return false;
        }
        // walkability check
        var tile_type = this.grid_map['tiles'][tile_j][tile_i];
        if (!this.tile_dict['walkability'].includes(tile_type)) {
            return false;
        }
        // block NPCs from entering passage tiles
        if (moving_object instanceof NPC) {
            for (var p = 0; p < this.grid_map['passages'].length; p++) {
                var passage = this.grid_map['passages'][p];
                if (tile_i === passage.i && tile_j === passage.j) {
                    return false;
                }
            }
        }
        // object collision check
        var objects = this.objects_on_tile(tile_i, tile_j);
        for (var i = 0; i < objects.length; i++) {
            if (objects[i] !== moving_object) return false;
        }
        return true;
    }

    objects_on_tile(tile_i, tile_j) {
        var results = [];
        var all_objects = this.objects.concat([this.world.player]);
        for (var i = 0; i < all_objects.length; i++) {
            if (all_objects[i].tile_i === tile_i && all_objects[i].tile_j === tile_j) {
                results.push(all_objects[i]);
            }
        }
        return results;
    }

    interact(interacting_agent) {
        var delta = DIRECTION_DELTA[interacting_agent.orientation];
        var target_i = interacting_agent.tile_i + delta.di;
        var target_j = interacting_agent.tile_j + delta.dj;
        var objects = this.objects_on_tile(target_i, target_j);
        if (objects.length > 0 && objects[0] !== interacting_agent) {
            objects[0].interact();
        }
    }

    check_passage(object) {
        for (var idx = 0; idx < this.grid_map['passages'].length; idx++) {
            var passage = this.grid_map['passages'][idx];
            if (object.tile_i === passage.i && object.tile_j === passage.j) {
                return passage;
            }
        }
        return null;
    }
}

class ScrollingGridEnvironment extends GridEnvironment {

    constructor(world, tile_dict, grid_map) {
        super(world, tile_dict, grid_map)
        this.update_offset()
    }

    update_offset() {
        // Use pixel position (which interpolates smoothly) for offset calculation
        var player_i = parseInt(this.world.player.x / this.grid_size);
        var player_j = parseInt(this.world.player.y / this.grid_size);
        this.i_offset = player_i - parseInt(width / 2 / this.grid_size)
        this.j_offset = player_j - parseInt(height / 2 / this.grid_size)
    }

    move_environment(position) {
        this.draw_background()
        this.update_offset()
        resetMatrix()
        translate(-(this.world.player.x % this.grid_size), -(this.world.player.y % this.grid_size))
        this.draw_environment()
        this.draw_contents()
    }

    get_i_offset() {return this.i_offset}

    get_j_offset() {return this.j_offset}

    draw_environment() {
        this.draw_background()
        for (var j_val = 0; j_val < this.grid_map['tiles'].length; j_val++) {
            for (var i_val = 0; i_val < this.grid_map['tiles'][0].length; i_val++) {
                var tile = {i: i_val, j: j_val}
                this.draw_cell(this.add_offset(tile), tile);
            }
        }
    }
}
