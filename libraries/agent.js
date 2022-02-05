

var Agent = class Agent extends WorldObject {

    
    constructor(world, x, y, object_width, object_height, step_size) {
        super(world, x, y, object_width, object_height);
        this.step_size = step_size;
        this.move_vec_dict = get_move_vec_dict(step_size);
        this.orientation = 'down';
        this.step = 0;
    }
    
    move(direction) {
        // redraw environment where player was standing
        this.world.current_env.redraw_at_object(this);
        // redraw player
        if (this != this.world.player) {
            this.world.player.draw_object();
        }
    
        
        // update player location
        var new_location = this.get_new_location(direction);
        this.x = new_location.x
        this.y = new_location.y
        this.orientation = direction;
        this.step += 1;
        
        if (!this.world.current_env.object_can_pass(this)) {
            this.undo_move(direction);
        }
    }
    
    get_new_location(direction, multiplier=1) {
        var move_vec = this.move_vec_dict[direction];
        var new_x = this.x + move_vec.x * multiplier;
        var new_y = this.y + move_vec.y * multiplier;
        return {x: new_x, y: new_y};
    }
        
    undo_move(direction) {
        var move_vec = this.move_vec_dict[direction];
        this.x -= move_vec.x;
        this.y -= move_vec.y;
        this.orientation = direction;
    }
    
    draw_object() {
        fill(255, 255, 255);
        circle(this.get_x(), this.get_y(), this.object_height);
    }
    
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


var SpriteCharacter = class SpriteCharacter extends Agent {
    
    constructor(world, x, y, object_width, object_height, step_size, char_sprites) {
        super(world, x, y, object_width, object_height, step_size);
        this.char_sprites = char_sprites;
    }
    
    draw_object() {
        var step_nr = this.step % 2;

        var char_sprite_config = this.char_sprites.step_sprites[step_nr][this.orientation];
        var current_sprite = this.world.char_sprite_arr[char_sprite_config.i][char_sprite_config.j];
        
        if (char_sprite_config.mirror) {
            push();
            scale(-1,1);
            image(current_sprite, -this.x - this.object_width / 2, this.y - this.object_height / 2, this.object_width, this.object_height);
            pop();
        } else {
            image(current_sprite, this.x - this.object_width / 2, this.y - this.object_height / 2, this.object_width, this.object_height);
        }
    }
}
    
function get_move_vec_dict(distance) {
    return {
        'up': {x: 0, y: -distance},
        'down': {x: 0, y: distance},
        'left': {x: -distance, y: 0},
        'right': {x: distance, y: 0}
    };
}