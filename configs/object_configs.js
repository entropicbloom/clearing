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

// The whirlpool
let whirlpool = new LinkObject(
    world,
    20, // tile_i
    8,  // tile_j
    25,
    25,
    'https://entropicbloom.com'
);

// Mysterious clearing objects
let clearing_stone = new TextObject(
    world,
    5,  // tile_i (top of the stone)
    8,  // tile_j
    25,
    25,
    [
        ["Worn stone. Warm to the touch."],
        ["Faint marks in the surface. Not writing. Older than writing."],
        ["It hums when you're not listening."]
    ]
);

let locked_door = new TextObject(
    world,
    3,  // tile_i
    3,  // tile_j
    30,
    30,
    [["The door is locked."]]
);

let clearing_rocks = new TextObject(
    world,
    16, // tile_i (rocks by pond)
    10, // tile_j
    25,
    25,
    [
        ["Placed, not fallen."],
        ["One stone. There were two."]
    ]
);
