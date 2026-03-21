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
    4,  // tile_i
    4,  // tile_j
    30, // object_width
    30, // object_height
    new BuddhabrotCanvas(200, 200, 20, false)
);

let stoner_house_sign = new TextObject(
    world,
    12, // tile_i
    11, // tile_j
    30,
    30,
    [['Stoner House']]
);

let lake_sign = new TextObject(
    world,
    7,  // tile_i
    11, // tile_j
    30,
    30,
    [['Lake Zürich, 18.6.2022, Evening in Nature']]
);
