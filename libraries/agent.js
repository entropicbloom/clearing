

class Agent extends Object {

    
    constructor(world, x, y, object_width, object_height, step_size) {
        this.step_size = step_size;
        this.move_vec_dict = get_move_vec_dict(step_size);
        this.orientation = 'down';
        super(Agent, this).__init__(world, x, y, object_width, object_height);
    }
    
    move(direction) {
        // redraw environment where player was standing
        this.world.current_env.redraw_at_object(this);
        // redraw player
        if (this != this.world.player) {
            this.world.player.draw_object();
        }
    
        
        // update player location
        move_vec = this.move_vec_dict[direction];
        this.x, this.y = this.new_location(direction);
        this.orientation = direction;
        this.step += 1;
        
        if (!this.world.current_env.object_can_pass(this)) {
            this.undo_move(direction);
        }
    }
    
    new_location(direction, multiplier=1) {
        move_vec = this.move_vec_dict[direction];
        new_x = this.x + move_vec[0] * multiplier;
        new_y = this.y + move_vec[1] * multiplier;
        return new_x, new_y;
    }
        
    undo_move(direction) {
        move_vec = this.move_vec_dict[direction];
        this.x -= move_vec[0];
        this.y -= move_vec[1];
        this.orientation = direction;
    }
    
    draw_object() {
        fill(255, 255, 255);
        circle(this.get_x(), this.get_y(), this.object_height);
    }
    
    get_rect_points() {
        rect_points = [
            (this.x + this.object_width / 2, this.y + this.object_height / 2),
            (this.x - this.object_width / 2, this.y + this.object_height / 2),
            (this.x + this.object_width / 2, this.y - this.object_height / 2),
            (this.x - this.object_width / 2, this.y - this.object_height / 2)
        ];
        
        return rect_points;
    }
}


class SpriteCharacter extends Agent {
    
    char_sprites = None;

    constructor(world, x, y, object_width, object_height, step_size, char_sprites) {
        this.char_sprites = char_sprites;
        super(world, x, y, object_width, object_height, step_size);
    }
    
    draw_object() {
        step_nr = this.step % 2;
        sprite_i, sprite_j, mirror = this.char_sprites[step_nr][this.orientation];
        current_sprite = this.world.char_sprite_arr[sprite_i][sprite_j];
        
        if (mirror) {
            pushMatrix();
            scale(-1,1);
            image(current_sprite, -this.x - this.object_width / 2, this.y - this.object_height / 2, this.object_width, this.object_height);
            popMatrix();
        } else {
            image(current_sprite, this.x - this.object_width / 2, this.y - this.object_height / 2, this.object_width, this.object_height);
        }
    }
}
    
function get_move_vec_dict(distance) {
    return {
        'up': (0, -distance),
        'down': (0, distance),
        'left': (-distance, 0),
        'right': (distance, 0)
    };
}