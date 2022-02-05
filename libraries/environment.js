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
    
    interact(interacting_agent) {}
}                
        
class GridEnvironment extends Environment {

    constructor(world, tile_dict, grid_map) {
        super()
        this.world = world;  // reference to world
        this.tile_dict = tile_dict;  // dictionary defining encoding of tiling textures
        this.grid_map = grid_map;  // dictionary defining current environment map
        this.env_width = grid_map['width'];  // width of environment in pixels
        this.env_height = grid_map['height'];  // height of environment in pixels
        this.grid_size = grid_map['grid_size'];  // width and height of one grid cell
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
                this.draw_cell({i: i_val, j: j_val});
            }
        }
    }
    
    draw_cell(tile) {

        var tile_type = this.grid_map['tiles'][tile.j][tile.i];
        
        if (tile_type >= 0) {
            var tile_coordinates = this.tile_dict['mapping'][tile_type];
            var tile_img = this.tile_arr[tile_coordinates.x][tile_coordinates.y]; // x and y might be reversed
            image(tile_img, tile.i * this.grid_size, tile.j * this.grid_size, this.grid_size, this.grid_size);
        } else {
            fill(0, 0, 0);
            square(tile.i * this.grid_size, tile.j * this.grid_size, this.grid_size);
        }
    }

    redraw_at_object(object) {
        var covered_tiles = this.get_covered_tiles(object);
        for (var i = 0; i < covered_tiles.length; i++) {
            this.draw_cell(covered_tiles[i]);
        }
    }
    
    redraw_at(position) {
        var tile = this.to_grid_coordinates(position);
        this.draw_cell(tile);
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
        for (var i_val = min_i; i_val<= max_i; i_val++) {
            for (var j_val = min_j; j_val <= max_j; j_val++) {
                covered_tiles.push({i: i_val, j: j_val});
            }
        }

        return covered_tiles;
    }

    tile_is_walkable(tile, object) {
        // check tile type
        if (tile.i > width / this.grid_size - 1 || tile.i < 0 || tile.j > height / this.grid_size - 1 || tile.j < 0) {
            return False;
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
        for (var i = 0; i < extended_objects.length; i++) {
            
            var object = extended_objects[i];
            var object_tile = this.to_grid_coordinates({x: object.x, y: object.y});
            if (tile.i == object_tile.i && tile.j == object_tile.j) {
                objects_on_tile_list.push(object);
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