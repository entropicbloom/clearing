
let pressed_key;
let counter = 0
let player_time_constant = 5
class World {}

function preload() {
  tiles_png = loadImage("data/tiles.png")
  sprites_png = loadImage("data/character_sprites.png")
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
  
  
  char_sprite_arr = load_tile_arr(40, 40, CHAR_SPRITES_CONFIG, sprites_png);
  
  current_env = new GridEnvironment(world, ENV_TILES_CONFIG, home_map);

  
  player = new SpriteCharacter(world,
                               current_env.grid_size * 15, // x
                               current_env.grid_size * 10, // y
                               25, // width
                               25, // height
                               5, // step size
                               player_sprites,
                               'blue');
  world.player = player;
  world.char_sprite_arr = char_sprite_arr;
  world.current_env = current_env;
  
  
  current_env.draw_environment();
  current_env.draw_contents();
  world.player.draw_object();
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

    // if key pressed, and if counter condition met, execute key actions
    if (counter % player_time_constant == 0 && pressed_key != null) {
        key_action(pressed_key)
    }   

    // update environment contents if no text boxes / canvases are displayed
    if (world.text_instance == null) {
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

function key_action(key) {

    var key_direction_map = {
        'w': 'up',
        's': 'down',
        'd': 'right',
        'a': 'left'
    };

    if (key in key_direction_map && world.text_instance == null && world.canvas_instance == null) {
        moved = world.player.move(key_direction_map[key]);

        var passage = world.current_env.check_passage(world.player);

        if (passage != null) {
            env_dict = map_registry[passage.destination_id];
            if ('scrolling' in env_dict) {
                world.current_env = new ScrollingGridEnvironment(world, ENV_TILES_CONFIG, env_dict);
            } else {
                world.current_env = new GridEnvironment(world, ENV_TILES_CONFIG, env_dict);
            }
            resetMatrix() // undo effects of scrolling env translation
            world.current_env.draw_environment();
            world.current_env.draw_contents();
            world.player.x = passage.new_x;
            world.player.y = passage.new_y;
            world.player.draw_object();
        }
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
    world.current_env.draw_environment();
    world.current_env.draw_contents();
    world.player.draw_object();
}
            
function mouseClicked() {
    grid_pos = world.current_env.to_grid_coordinates({x: mouseX, y: mouseY})
    console.log(world.current_env.add_offset(grid_pos))
}