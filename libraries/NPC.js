
function rand_int(max_int) {
    return Math.floor(Math.random() * max_int)
}

class NPC extends SpriteCharacter {
    
    
    walk_prob = 0.5
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
    }

    update_object() {
        
        if (millis() % 1000 < 20) {
            if (random(0, 1) > this.walk_prob) {
                var direction_int = rand_int(4)
                var direction = this.int_to_direction[direction_int]
                this.move(direction)
                this.draw_object()
            }
        }
    }
    
    interact() { // currently copy of TextObject.interact
        var sample = this.dialogue[rand_int(this.dialogue.length)]
        this.world.text_instance = new Text(sample, this.name)
        this.world.text_instance.display_text()
        this.world.text_instance.next()
    }

}


        
    
    