
var WorldObject = class WorldObject {

    
    constructor(world, x, y, object_width=0, object_height=0) {
        this.world = world;
        this.x = x;
        this.y = y;
        this.object_width = object_width;
        this.object_height = object_height;
    }
    
    get_x() {
        return this.x
    }
    
    get_y() {
        return this.y
    }
    
    draw_object() {}
    
    update_object() {}
    
    get_rect_points() {}
    
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