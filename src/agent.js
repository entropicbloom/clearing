

var Agent = class Agent extends WorldObject {

    constructor(world, x, y, object_width, object_height, step_size) {
        super(world, x, y, object_width, object_height);
        this.step_size = step_size;
        this.move_vec_dict = get_move_vec_dict(step_size);
        this.orientation = 'down';
        this.step = 0;

        // Tile-based interpolation state
        this.isMoving = false;
        this.fromX = x;
        this.fromY = y;
        this.toX = x;
        this.toY = y;
        this.moveProgress = 0;
        this.moveDuration = 8; // frames to complete one tile move
    }

    move(direction) {
        // Can't start a new move while already moving
        if (this.isMoving) return false;

        // Calculate target position (one full tile)
        var new_location = this.get_new_location(direction);

        // Temporarily set position to target to check passability
        var oldX = this.x;
        var oldY = this.y;
        this.x = new_location.x;
        this.y = new_location.y;

        if (!this.world.current_env.object_can_pass(this)) {
            // Can't pass — restore position, just face that direction
            this.x = oldX;
            this.y = oldY;
            this.orientation = direction;
            this.step = 0;
            return false;
        }

        // Restore position and begin interpolation toward target
        this.x = oldX;
        this.y = oldY;
        this.orientation = direction;
        this.step = (this.step + 1) % 2;

        this.fromX = oldX;
        this.fromY = oldY;
        this.toX = new_location.x;
        this.toY = new_location.y;
        this.moveProgress = 0;
        this.isMoving = true;

        return true;
    }

    update_movement() {
        if (!this.isMoving) return;

        this.moveProgress += 1;
        var t = this.moveProgress / this.moveDuration;

        // Toggle walk animation frame at the halfway point
        if (this.moveProgress === Math.floor(this.moveDuration / 2)) {
            this.step = (this.step + 1) % 2;
        }

        if (t >= 1) {
            // Snap to target tile
            this.x = this.toX;
            this.y = this.toY;
            this.isMoving = false;
        } else {
            // Linear interpolation
            this.x = this.fromX + (this.toX - this.fromX) * t;
            this.y = this.fromY + (this.toY - this.fromY) * t;
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
        this.step = 1;
    }

    draw_object() {
        fill(255, 255, 255);
        circle(this.get_x(), this.get_y(), this.object_height);
    }

    get_position() {
        return {x: this.x, y: this.y}
    }

    snap_to_grid() {
        var half = this.step_size / 2;
        this.x = Math.floor(this.x / this.step_size) * this.step_size + half;
        this.y = Math.floor(this.y / this.step_size) * this.step_size + half;
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
