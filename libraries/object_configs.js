class TestCanvas extends Canvas {

    constructor(canvas_width, canvas_height, square_width) {
        super(canvas_width, canvas_height)
        this.square_width = square_width
        this.x = 0
        this.y = 0
        this.direction = 1
    }

    draw_contents() {

        fill(mouseX % 255, mouseY % 255, 150);

        var mouse_y_clipped = Math.max(0, Math.min(mouseY, this.canvas_height - this.square_width));
        square(this.x, mouse_y_clipped, this.square_width);
        
        if (this.x + this.square_width >= this.canvas_width) {
            this.direction = -1;
        }

        if (this.x <= 0) {
            this.direction = 1;
        }

        this.x += this.direction;
    }
}

let test_canvas = new CanvasObject (
    world,
    120, // x
    120, // y
    30, // object_width
    30, // object_height
    new TestCanvas(200, 200, 20) // canvas
);

let stoner_house_sign = new TextObject(
    world,
    30 * 12,
    30 * 11,
    30,
    30,
    [['Stoner House']] // dialogue
);