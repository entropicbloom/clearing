
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
            text(this.header, 10.0, 390)
        }
        
        fill(50, 50, 50)
        text(this.text_arr[this.counter], 20.0, 410.0)
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
    
    constructor(canvas_width, canvas_height) {
        this.canvas_width = canvas_width
        this.canvas_height = canvas_height
        this.counter = 0
    }
        
    draw_contents() {}
    
    draw_canvas() {
        
        fill(255, 255, 255)
        rectMode(CENTER)
        rect(width / 2, height / 2, this.canvas_width, this.canvas_height)
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
        this.world.canvas_instance = this.canvas
    }
}
        