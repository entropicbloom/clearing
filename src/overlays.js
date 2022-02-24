
class Text {
    
    constructor(text_arr, header) {
        /*
        A list of texts that one can click through.
        Saves at which point of the list of texts the player is in `counter`.
        Optionally supports a `header` which will serve as a title.
        */
        this.text_arr = text_arr;
        this.counter = 0;
        this.header = header;
    }
        
    more_text_available() {
        return this.counter < this.text_arr.length;
    }
        
    next() {
        this.counter += 1;
    }

    display_text() {
        fill(255, 220, 235);
        rect(0, 369, 599, 80);
        
        
        if (this.header != null) {
            fill(0, 0, 0);
            text(this.header, 10.0, 390);
        }
        
        fill(50, 50, 50);
        text(this.text_arr[this.counter], 20.0, 410.0);
    }

}

class TextObject extends WorldObject{

    constructor(world, x, y, object_width=0, object_height=0, dialogue, name) {
        super(world, x, y, object_width, object_height)
        this.dialogue = dialogue
        this.name = name
    }
    
    interact() {
        var sample = this.dialogue[rand_int(this.dialogue.length)]
        this.world.text_instance = new Text(sample, this.name)
        this.world.text_instance.display_text()
        this.world.text_instance.next()
    }

}

class Canvas {
    
    constructor(canvas_width, canvas_height, refresh_background) {
        this.canvas_width = canvas_width
        this.canvas_height = canvas_height
        this.refresh_background = refresh_background
        this.counter = 0
    }
    
    reset() {
        this.counter = 0
    }
        
    draw_contents() {}
    
    draw_canvas() {
        
        
        if (this.refresh_background == true || this.counter == 0) {
            fill(255, 255, 255)
            rectMode(CENTER)
            rect(width / 2, height / 2, this.canvas_width, this.canvas_height)
        }
        rectMode(CORNER)
        
        push()
        translate(width / 2 - this.canvas_width / 2, height / 2 - this.canvas_height / 2)
        this.draw_contents()
        pop()
        
        this.counter += 1
    }
        
}

class CanvasObject extends WorldObject {

    
    constructor(world, x, y, object_width, object_height, canvas) {
        super(world, x, y, object_width, object_height)
        this.canvas = canvas
        
    }
        
    interact() {
        this.canvas.reset()
        this.world.canvas_instance = this.canvas
    }
}
        
class RectButton {
    constructor(x_offset, y_offset, button_width, button_height, callback, callback_arg) {
        this.x_offset = x_offset;
        this.y_offset = y_offset;
        this.button_width = button_width;
        this.button_height = button_height
        this.callback = callback
        this.callback_arg = callback_arg
    }

    try_press(location) {
        var in_x_range = location.x > this.x_offset && location.x < (this.x_offset + this.button_width)
        var in_y_range = location.y > this.y_offset && location.y < (this.y_offset + this.button_height)
        if (in_x_range && in_y_range) {
            this.callback(this.callback_arg)
        }
    }

    draw_button() {
        noFill()
        stroke(255, 255, 255)
        rect(this.x_offset, this.y_offset, this.button_width, this.button_height)
    }
}