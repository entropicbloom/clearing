

var Agent = class Agent extends WorldObject {

    constructor(world, tile_i, tile_j, object_width, object_height) {
        super(world, tile_i, tile_j, object_width, object_height);
        this.orientation = 'down';
        this.step = 0;

        // Tile-based interpolation state
        this.isMoving = false;
        this.fromX = this.x;
        this.fromY = this.y;
        this.toX = this.x;
        this.toY = this.y;
        this.moveProgress = 0;
        this.moveDuration = 16; // frames to complete one tile move
        this.legSide = 0; // alternates between 0 and 1 each move for leg mirroring
    }

    move(direction) {
        if (this.isMoving) return false;

        var delta = DIRECTION_DELTA[direction];
        var target_i = this.tile_i + delta.di;
        var target_j = this.tile_j + delta.dj;

        if (!this.world.current_env.tile_can_pass(target_i, target_j, this)) {
            this.orientation = direction;
            this.step = 0;
            return false;
        }

        this.orientation = direction;
        this.step = (this.step + 1) % 2;
        this.legSide = (this.legSide + 1) % 2;

        this.fromX = this.x;
        this.fromY = this.y;
        this.tile_i = target_i;
        this.tile_j = target_j;
        this.toX = target_i * GRID_SIZE + GRID_SIZE / 2;
        this.toY = target_j * GRID_SIZE + GRID_SIZE / 2;
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
            this.x = this.toX;
            this.y = this.toY;
            this.isMoving = false;
        } else {
            this.x = this.fromX + (this.toX - this.fromX) * t;
            this.y = this.fromY + (this.toY - this.fromY) * t;
        }
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

    constructor(world, tile_i, tile_j, object_width, object_height, char_sprites, color) {
        super(world, tile_i, tile_j, object_width, object_height);
        this.char_sprites = char_sprites;
        this.color = color
    }

    draw_object() {
        var step_nr = this.step % 2;

        var char_sprites_at_step = this.char_sprites.step_sprites[step_nr][this.orientation];
        var color_offset = this.get_color_offset()

        var current_sprite = this.world.char_sprite_arr[char_sprites_at_step.i + color_offset][char_sprites_at_step.j];

        // For up/down walking sprites, mirror on alternate legs to show the other leg
        var shouldMirror = char_sprites_at_step.mirror;
        if (step_nr === 1 && this.legSide === 1 && (this.orientation === 'up' || this.orientation === 'down')) {
            shouldMirror = !shouldMirror;
        }

        var draw_y = this.y - this.object_height / 2 - this.world.current_env.get_y_offset()
        if (shouldMirror) {
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
