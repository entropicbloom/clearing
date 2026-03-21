

var Agent = class Agent extends WorldObject {

    
    constructor(world, x, y, object_width, object_height, step_size) {
        super(world, x, y, object_width, object_height);
        this.step_size = step_size;
        this.move_vec_dict = get_move_vec_dict(step_size);
        this.orientation = 'down';
        this.step = 0;
    }
    
    move(direction) {
        var new_location = this.get_new_location(direction);
        var old_x = this.x;
        var old_y = this.y;

        // check collision at new position before committing
        this.x = new_location.x;
        this.y = new_location.y;

        if (!this.world.current_env.object_can_pass(this)) {
            this.x = old_x;
            this.y = old_y;
            this.orientation = direction;
            return;
        }

        // valid move — redraw old position
        this.x = old_x;
        this.y = old_y;
        this.world.current_env.redraw_at_object(this);
        if (this != this.world.player) {
            this.world.player.draw_object();
        }

        // commit new position
        this.x = new_location.x;
        this.y = new_location.y;
        this.orientation = direction;
        this.step = (this.step + 1) % 2;

        if (this == this.world.player) {
            this.world.current_env.move_environment(new_location);
            this.world.player.draw_object();
        }
    }
    
    get_new_location(direction, multiplier=1) {
        var move_vec = this.move_vec_dict[direction];
        var new_x = this.x + move_vec.x * multiplier;
        var new_y = this.y + move_vec.y * multiplier;
        return {x: new_x, y: new_y};
    }
        
    draw_object() {
        fill(255, 255, 255);
        circle(this.get_x(), this.get_y(), this.object_height);
    }

    get_position() {
        return {x: this.x, y: this.y}
    }
}


var SpriteCharacter = class SpriteCharacter extends Agent {
    
    constructor(world, x, y, object_width, object_height, step_size, char_sprites, color) {
        super(world, x, y, object_width, object_height, step_size);
        this.char_sprites = char_sprites;
        this.color = color
    }
    
    draw_object() {
        var step_nr = this.step % 2;

        var char_sprites_at_step = this.char_sprites.step_sprites[step_nr][this.orientation];
        var color_offset = this.get_color_offset()

        var current_sprite = this.world.char_sprite_arr[char_sprites_at_step.i + color_offset][char_sprites_at_step.j];
        
        var draw_y = this.y - this.object_height / 2 - this.world.current_env.get_y_offset()
        if (char_sprites_at_step.mirror) {
            push();
            scale(-1,1);
            var draw_x = -this.x - this.object_width / 2 + this.world.current_env.get_x_offset()
            image(current_sprite, draw_x, draw_y, this.object_width, this.object_height);
            pop();
        } else {
            var draw_x = this.x - this.object_width / 2 - this.world.current_env.get_x_offset()
            image(current_sprite, draw_x, draw_y, this.object_width, this.object_height);
        }
    }

    get_color_offset() {
        var color_idx = CHAR_SPRITES_CONFIG.colors.indexOf(this.color)
        return color_idx * CHAR_SPRITES_CONFIG.color_offset
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