
function rand_int(max_int) {
    return Math.floor(Math.random() * max_int)
}

class NPC extends SpriteCharacter {


    walk_prob = 1
    int_to_direction = {
        0: 'up',
        1: 'down',
        2: 'left',
        3: 'right'
    }

    constructor(world, x, y, object_width, object_height, step_size, char_sprites, color, dialogue, name) {
        super(world, x, y, object_width, object_height, step_size, char_sprites, color)
        this.dialogue = dialogue
        this.name = name
        this.step_count_down_start = 12
        this.step_count_down = this.step_count_down_start
        this.walk_prob = 0.1
    }

    update_object() {

        // Advance interpolation if currently moving
        if (this.isMoving) {
            this.update_movement();
            // Redraw: clear old tiles and draw at new interpolated position
            this.world.current_env.redraw_at_object(this);
            this.draw_object();
            // Also redraw player in case NPC walked over their tiles
            if (this.world.player) {
                this.world.player.draw_object();
            }
            return;
        }

        // Only start new moves when idle
        if (this.step_count_down == 0) {

            if (Math.random() < this.walk_prob) {
                var direction_int = rand_int(4)
                var direction = this.int_to_direction[direction_int]
                this.move(direction)
            }
            this.step_count_down = this.step_count_down_start
        } else {
            this.step_count_down -= 1
        }

    }

    interact() { // currently copy of TextObject.interact
        var sample = this.dialogue[rand_int(this.dialogue.length)]
        this.world.text_instance = new Text(sample, this.name)
        this.world.text_instance.display_text()
        this.world.text_instance.next()
    }

}




