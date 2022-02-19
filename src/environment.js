Array.range = (start, end) => Array.from({length: (end - start)}, (v, k) => k + start);

class Environment {

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
    
    redraw_at(position) {}

    redraw_at_object(object) {}

    object_can_pass(object) {}

    check_passage(object) {}

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
        super()
        this.world = world;  // reference to world
        this.tile_dict = tile_dict;  // dictionary defining encoding of tiling textures
        this.grid_map = grid_map;  // dictionary defining current environment map
        this.grid_size = grid_map['grid_size'];  // width and height of one grid cell
        this.env_width = grid_map['tiles'][0].length * this.grid_size;  // width of environment in pixels
        this.env_height = grid_map['tiles'].length * this.grid_size; // height of environment in pixels
        this.tile_arr = load_tile_arr(40, 30, tile_dict, tiles_png);  // 2D array containing images of all environment tiles
        
        this.initialize_contents();
    }

    initialize_contents() {
        this.objects = this.grid_map['objects'];
        for (var i = 0; i < this.objects.length; i++) {
            this.objects[i].world = this.world;
        }
    }
    
    draw_environment() {
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
        } else {
            fill(0, 0, 0);
            square(tile_place.i * this.grid_size, tile_place.j * this.grid_size, this.grid_size);
        }
    }

    redraw_at_object(object) {
        var covered_tiles = this.get_covered_tiles(object);
        for (var i = 0; i < covered_tiles.length; i++) {
            this.draw_cell(covered_tiles[i], this.subtract_offset(covered_tiles[i]));
        }
    }
    
    redraw_at(position) {
        var tile = this.to_grid_coordinates(position);
        this.draw_cell(tile, tile);
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
            
            // get rect points of rectangle enclosing all covered tiles
            min_i = Math.min(min_i, rect_points_tile.i);
            min_j = min(min_j, rect_points_tile.j);
            max_i = max(max_i, rect_points_tile.i);
            max_j = max(max_j, rect_points_tile.j);
        }

        var covered_tiles = [];
        for (var i_val = min_i; i_val<= max_i; i_val++) {
            for (var j_val = min_j; j_val <= max_j; j_val++) {
                covered_tiles.push({i: i_val, j: j_val});
            }
        }

        return covered_tiles;
    }

    tile_is_walkable(tile, object) {
        
        // check tile type
        if (tile.i > this.env_width / this.grid_size - 1 || tile.i < 0 ||
            tile.j > this.env_height / this.grid_size - 1 || tile.j < 0) {
            return false;
        }
        var tile_type = this.grid_map['tiles'][tile.j][tile.i];
        var is_walkable = this.tile_dict['walkability'].includes(tile_type);
        
        // check if objects are on tile
        var objects_on_tile = this.objects_on_tile(tile);
        if (objects_on_tile.length > 1) {
            is_walkable = false;
            return
        }
        if (objects_on_tile.length == 1) {
            is_walkable = is_walkable && (objects_on_tile[0] == object);
        }

        return is_walkable;
    }
    
    object_can_pass(object) {
        var covered_tiles = this.get_covered_tiles(object);
        var tile_walkability_list = [];
        for (var idx = 0; idx < covered_tiles.length; idx++) {
            tile_walkability_list.push(this.tile_is_walkable(covered_tiles[idx], object));
        }

        return tile_walkability_list.every(x => x);
    }
    
    objects_on_tile(tile) {
        var objects_on_tile_list = [];
        var extended_objects = this.objects.concat([this.world.player]);

        // iterate through all objects in environment
        for (var i = 0; i < extended_objects.length; i++) {
            
            var object = extended_objects[i];
            var object_tiles = this.get_covered_tiles(object)

            // iterate through all tiles covered by current object
            for (var tile_idx = 0; tile_idx < object_tiles.length; tile_idx++) {
                var object_tile = object_tiles[tile_idx]
                if (tile.i == object_tile.i && tile.j == object_tile.j) {
                    objects_on_tile_list.push(object);
                    break;
                }
            }
        }
        return objects_on_tile_list;
    }
    
    interact(interacting_agent) {
        var new_location = interacting_agent.get_new_location(interacting_agent.orientation, 6);
        var tile = this.to_grid_coordinates(new_location);
        var objects_faced = this.objects_on_tile(tile);
        if (objects_faced.length > 0 && objects_faced[0] != interacting_agent) {
            objects_faced[0].interact();
        }
    }
    
    check_passage(object) {
        var covered_tiles = this.get_covered_tiles(object);
        for (var tile_idx = 0; tile_idx < covered_tiles.length; tile_idx++) {
            var covered_tile = covered_tiles[tile_idx];
            
            for (var passage_idx = 0; passage_idx < this.grid_map['passages'].length; passage_idx++) {
                var passage = this.grid_map['passages'][passage_idx];
                
                if (covered_tile.i == passage.i && covered_tile.j == passage.j)  {
                    return passage;
                }
            }
        }
        return null;
    }
}

class ScrollingGridEnvironment extends GridEnvironment {


    update_offset() {
        var player_pos = this.world.player.get_position();
        var player_coords = this.to_grid_coordinates(player_pos);
        this.i_offset = player_coords.i - parseInt(width / 2 / this.grid_size)
        this.j_offset = player_coords.j - parseInt(height / 2 / this.grid_size)
    }


    move_environment(position) {
        background(0, 0, 0)
        this.update_offset()
        translate(-(this.world.player.x % this.grid_size), -(this.world.player.y % this.grid_size)) // smooth scrolling
        this.draw_environment()
        this.draw_contents()     
    }

    update_contents() { // required to maintain translation for map objects
        push()
        translate(-(this.world.player.x % this.grid_size), -(this.world.player.y % this.grid_size))
        for (var i = 0; i < this.objects.length; i++) {
            this.objects[i].update_object();
        }
        pop()
    }

    get_i_offset() {return this.i_offset}
    
    get_j_offset() {return this.j_offset}


    constructor(world, tile_dict, grid_map) {
        super(world, tile_dict, grid_map)
        this.update_offset()
    }

    draw_environment() {
        for (var j_val = 0; j_val < this.grid_map['tiles'].length; j_val++) {
            for (var i_val = 0; i_val < this.grid_map['tiles'][0].length; i_val++) {
                var tile = {i: i_val, j: j_val}
                this.draw_cell(this.add_offset(tile), tile);
            }
        }
    }
}