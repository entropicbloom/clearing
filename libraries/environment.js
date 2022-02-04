class Environment {
    
    objects = None
    
    initialize_contents() {}
    
    update_contents() {
        for (var i = 0; i < this.objects.length; i++) {
            this.objects[i].update_object()
        }
    }
    
    draw_contents() {
        for (var i = 0; i < this.objects.length; i++) {
            this.objects[i].draw_object()
        }
    }
    
    redraw_at(x, y) {}

    redraw_at_object(object) {}

    object_can_pass(object) {}

    check_passage(object) {}
    
    interact(interacting_agent) {}
}                
        
class GridEnvironment extends Environment {

    constructor(world, tile_dict, grid_map) {
        self.world = world;  // reference to world
        self.tile_dict = tile_dict;  // dictionary defining encoding of tiling textures
        self.grid_map = grid_map;  // dictionary defining current environment map
        self.env_width = grid_map['width'];  // width of environment in pixels
        self.env_height = grid_map['height'];  // height of environment in pixels
        self.grid_size = grid_map['grid_size'];  // width and height of one grid cell
        self.tile_arr = load_tile_arr(40, 30, tile_dict);  // 2D array containing images of all environment tiles
        self.initialize_contents();
    }

    initialize_contents() {
        this.objects = self.grid_map['objects'];
        for (var i = 0; i < this.objects.length; i++) {
            this.objects[i].world = this.world;
        }
    }
    
    draw_environment() {
        for (var j = 0; j < this.grid_map['tiles'].length; j++) {
            for (var i = 0; i < this.grid_map['tiles'][0].length; i++) {
                this.draw_cell(i, j);
            }
        }
    }
    
    draw_cell(i, j) {
        tile_type = self.grid_map['tiles'][j][i];
        
        if (tile_type >= 0) {
            tile_coordinates = self.tile_dict['mapping'][tile_type];
            tile_img = self.tile_arr[tile_coordinates[0]][tile_coordinates[1]];
            image(tile_img, i * self.grid_size, j * self.grid_size, self.grid_size, self.grid_size);
        } else {
            fill(0, 0, 0);
            square(i * self.grid_size, j * self.grid_size, self.grid_size);
        }
    }

    redraw_at_object(object) {
        covered_tiles = self.get_covered_tiles(object);
        for (var i = 0; i < this.covered_tiles.length; i++) {
            self.draw_cell(covered_tiles[i].i, covered_tiles[i].j);
        }
    }
    
    redraw_at(x, y) {
        i, j = self.to_grid_coordinates(x, y);
        self.draw_cell(i, j);
    }
    
    to_grid_coordinates(x, y) {
        i = parseInt(x / self.grid_size);
        j = parseInt(y / self.grid_size);
        return i, j
    }
    
    get_covered_tiles(object) {
        rect_points = object.get_rect_points()
        rect_points_tiles = [self.to_grid_coordinates(*rect_point) for rect_point in rect_points]
        tile_is, tile_js = list(zip(*rect_points_tiles))
        covered_tiles = [
           {i: tile_i, j: tile_j} for tile_i in range(min(tile_is), max(tile_is) + 1)
            for tile_j in range(min(tile_js), max(tile_js) + 1)
        ]
        return covered_tiles
    }

    tile_is_walkable(i, j, object) {
        // check tile type
        if (i > width / self.grid_size - 1 || i < 0 || j > height / self.grid_size - 1 || j < 0) {
            return False;
        }
        tile_type = self.grid_map['tiles'][j][i];
        is_walkable = tile_type in self.tile_dict['walkability'];
        
        // check if objects are on tile
        objects_on_tile = self.objects_on_tile(i, j);
        if (objects_on_tile.length > 1) {
            is_walkable = False
            return
        }
        if (objects_on_tile.length == 1) {
            is_walkable = is_walkable && (objects_on_tile[0] == object)
        }

        return is_walkable
    }
    
    object_can_pass(object) {
        covered_tiles = self.get_covered_tiles(object)
        tile_walkability_list = [self.tile_is_walkable(i, j, object) for (i, j) in covered_tiles]
        return all(tile_walkability_list)
    }
    
    objects_on_tile(tile_i, tile_j) {
        objects_on_tile = []
        extended_objects = self.objects.concat([self.world.player])
        for (var i = 0; i < extended_objects.length; i++) {
            object = extended_objects[i]
            object_i, object_j = self.to_grid_coordinates(object.x, object.y)
            if (tile_i == object_i && tile_j == object_j) {
                objects_on_tile.append(object)
            }
        }
        return objects_on_tile
    }
    
    interact(interacting_agent) {
        int_x, int_y = interacting_agent.new_location(interacting_agent.orientation, multiplier=6)
        int_i, int_j = self.to_grid_coordinates(int_x, int_y)
        objects_faced = self.objects_on_tile(int_i, int_j)
        if (objects_faced.length > 0 && objects_faced[0] != interacting_agent) {
            objects_faced[0].interact()
        }
    }
    
    check_passage(object) {
        covered_tiles = self.get_covered_tiles(object)
        for (var tile_idx = 0; tile_idx < covered_tiles.length; tile_idx++) {
            covered_tile = covered_tiles[tile_idx]
            for (var passage_idx = 0; passage_idx < self.grid_map['passages'].length; passage_idx++) {
                passage = self.grid_map['passages'][passage_idx]
                if (covered_tile.x == passage.x && covered_tile.y == passage.y)  {
                    return passage
                }
            }
        }
        return null
    }
}