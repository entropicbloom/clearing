
var GRID_SIZE = 30;

var DIRECTION_DELTA = {
    'up': {di: 0, dj: -1},
    'down': {di: 0, dj: 1},
    'left': {di: -1, dj: 0},
    'right': {di: 1, dj: 0}
};

var WorldObject = class WorldObject {

    constructor(world, tile_i, tile_j, object_width=0, object_height=0) {
        this.world = world;
        this.tile_i = tile_i;
        this.tile_j = tile_j;
        this.object_width = object_width;
        this.object_height = object_height;
        // Pixel position for rendering (tile center)
        this.x = tile_i * GRID_SIZE + GRID_SIZE / 2;
        this.y = tile_j * GRID_SIZE + GRID_SIZE / 2;
    }

    sync_position() {
        this.x = this.tile_i * GRID_SIZE + GRID_SIZE / 2;
        this.y = this.tile_j * GRID_SIZE + GRID_SIZE / 2;
    }

    get_x() {
        return this.x
    }

    get_y() {
        return this.y
    }

    draw_object() {}

    update_object() {}

    interact() {}

    get_rect_points() {
        var rect_points = [
            {x: Math.floor(this.x + this.object_width / 2), y: Math.floor(this.y + this.object_height / 2)},
            {x: Math.floor(this.x - this.object_width / 2), y: Math.floor(this.y + this.object_height / 2)},
            {x: Math.floor(this.x + this.object_width / 2), y: Math.floor(this.y - this.object_height / 2)},
            {x: Math.floor(this.x - this.object_width / 2), y: Math.floor(this.y - this.object_height / 2)}
        ];

        return rect_points;
    }
}
