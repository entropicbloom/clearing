
let pressed_key;
let counter = 0
class World {}

function preload() {
    pictures = {
        'tiles_png': loadImage("data/tiles.png"),
        'sprites_png': loadImage("data/character_sprites.png"),
        'lake_jpg': loadImage("data/lake.jpg")
    }
}

let ctrl_buttons = [
    new RectButton(dir_button_x_offset, dir_button_y_offset + dir_button_dim, dir_button_dim, dir_button_dim, key_action, 'a'),
    new RectButton(dir_button_x_offset + dir_button_dim, dir_button_y_offset, dir_button_dim, dir_button_dim, key_action, 'w'),
    new RectButton(dir_button_x_offset + dir_button_dim, dir_button_y_offset + 2 * dir_button_dim, dir_button_dim, dir_button_dim, key_action, 's'),
    new RectButton(dir_button_x_offset + 2 * dir_button_dim, dir_button_y_offset + dir_button_dim, dir_button_dim, dir_button_dim, key_action, 'd'),
    new RectButton(dir_button_x_offset + 5 * dir_button_dim, dir_button_y_offset + 2 * dir_button_dim, dir_button_dim * 4, dir_button_dim, key_action, ' ')
]

function setup() {

  createCanvas(600, 450);

  world = new World();

  char_sprite_arr = load_tile_arr(40, 40, CHAR_SPRITES_CONFIG, pictures['sprites_png']);
  player = new SpriteCharacter(world,
                               10, // tile_i
                               13, // tile_j
                               25, // width
                               25, // height
                               player_sprites,
                               'blue');
  world.player = player;
  world.char_sprite_arr = char_sprite_arr;

  current_env = new ScrollingGridEnvironment(world, ENV_TILES_CONFIG, home_map);
  world.current_env = current_env;

  draw_scene()
  push()
}


function draw() {
    pop()
    // draw touch buttons and execute if pressed
    if (touches.length > 0) {
        draw_ctrl_buttons()
        for (var i = 0; i < touches.length; i++) {
            touch_action(touches[i])
        }
    }

    // If player is currently moving, advance the interpolation
    if (world.player.isMoving) {
        var prevX = world.player.x;
        var prevY = world.player.y;
        world.player.update_movement();
        redraw_player_movement(prevX, prevY);

        // When movement completes, check for passage transitions
        if (!world.player.isMoving) {
            var passage = world.current_env.check_passage(world.player);
            if (passage != null) {
                handle_passage(passage);
            }
        }
    }

    // If player is idle and a direction key is held, start a new tile move
    if (!world.player.isMoving && pressed_key != null) {
        request_move(pressed_key);
    }

    // update environment contents (NPCs) if no text boxes / canvases are displayed
    if (world.text_instance == null && world.canvas_instance == null) {
        world.current_env.update_contents();
    }

    // if it exists, update current canvas
    if (world.canvas_instance != null) {
        world.canvas_instance.draw_canvas();
    }

    counter += 1
    push()
}

function touch_action(touch) {
    for (var i = 0; i < ctrl_buttons.length; i++) {
        ctrl_buttons[i].try_press(touch)
    }
}

function draw_ctrl_buttons() {
    for (var i = 0; i < ctrl_buttons.length; i++) {
        ctrl_buttons[i].draw_button()
    }
}

function request_move(key) {
    var key_direction_map = {
        'w': 'up',
        's': 'down',
        'd': 'right',
        'a': 'left'
    };

    if (key in key_direction_map && world.text_instance == null && world.canvas_instance == null) {
        var moved = world.player.move(key_direction_map[key]);
        if (!moved) {
            // Blocked but still update the sprite to face the new direction
            world.current_env.redraw_at_object(world.player);
            world.current_env.draw_contents();
            world.player.draw_object();
        }
    }
}

function redraw_player_movement(prevX, prevY) {
    if (world.current_env instanceof ScrollingGridEnvironment) {
        world.current_env.move_environment(world.player.get_position());
    } else {
        // Redraw tiles at the previous position (where sprite was last drawn)
        var realX = world.player.x;
        var realY = world.player.y;
        world.player.x = prevX;
        world.player.y = prevY;
        world.current_env.redraw_at_object(world.player);
        world.player.x = realX;
        world.player.y = realY;
        // Redraw tiles at current position and contents
        world.current_env.redraw_at_object(world.player);
        world.current_env.draw_contents();
    }
    world.player.draw_object();
}

function handle_passage(passage) {
    world.player.tile_i = passage.new_i;
    world.player.tile_j = passage.new_j;
    world.player.sync_position();
    world.player.isMoving = false;

    env_dict = map_registry[passage.destination_id];
    if ('scrolling' in env_dict) {
        world.current_env = new ScrollingGridEnvironment(world, ENV_TILES_CONFIG, env_dict);
        world.current_env.update_offset()
    } else {
        world.current_env = new GridEnvironment(world, ENV_TILES_CONFIG, env_dict);
    }
    resetMatrix()
    push()

    draw_scene()
}

function key_action(key) {

    if (!world || !world.player) return;

    var key_direction_map = {
        'w': 'up',
        's': 'down',
        'd': 'right',
        'a': 'left'
    };

    if (key in key_direction_map && world.text_instance == null && world.canvas_instance == null) {
        request_move(key);
        return
    }

    if (key == ' ') {
        if ((world.text_instance == null) && (world.canvas_instance == null)) {
            world.current_env.interact(world.player);
          return
        }
        if (world.text_instance != null) {
            if (world.text_instance.more_text_available()) {
                world.text_instance.display_text();
                world.text_instance.next();
            } else {
                draw_scene();
                world.text_instance = null;
          }
          return
        }
      }

    if (key == 'e') {
        world.text_instance = null;
        world.canvas_instance = null;
        draw_scene();
    }
  }

function keyPressed() {
    if (['w', 'a', 's', 'd'].includes(key)) {
        pressed_key = key
    }
    key_action(key)
}

function keyReleased() {
    if (pressed_key == key) {
        pressed_key = null
    }
}

function draw_scene() {
    if (world.current_env instanceof ScrollingGridEnvironment) {
        world.current_env.update_offset()
        resetMatrix()
        translate(-(world.player.x % world.current_env.grid_size), -(world.player.y % world.current_env.grid_size))
    }
    world.current_env.draw_environment();
    world.current_env.draw_contents();
    world.player.draw_object();
}

function mouseClicked() {
    grid_pos = world.current_env.to_grid_coordinates({x: mouseX, y: mouseY})
    console.log(world.current_env.add_offset(grid_pos))
}
