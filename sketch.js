
let pressed_key;
let counter = 0
class World {}

function preload() {
  tiles_png = loadImage("data/tiles.png")
  sprites_png = loadImage("data/character_sprites.png")
}

function setup() {

  createCanvas(600, 450);

  

  world = new World();
  
  
  char_sprite_arr = load_tile_arr(10, 10, char_sprites, sprites_png);
  
  current_env = new GridEnvironment(world, env_tiles, home_map);

  
  player = new SpriteCharacter(world,
                               current_env.grid_size * 15, // x
                               current_env.grid_size * 10, // y
                               25, // width
                               25, // height
                               5, // step size
                               player_sprites);
  world.player = player;
  world.char_sprite_arr = char_sprite_arr;
  world.current_env = current_env;
  
  
  current_env.draw_environment();
  current_env.draw_contents();
  world.player.draw_object();

}
  

function draw() {
    if (counter % 5 == 0 && pressed_key != null) {
        key_action(pressed_key)
    }   

    if (world.text_instance == null) {
        world.current_env.update_contents();
    }
    if (world.canvas_instance != null) {
        world.canvas_instance.draw_canvas();
    }

    counter += 1
}

function key_action(key) {
    

    var key_direction_map = {
        'w': 'up',
        's': 'down',
        'd': 'right',
        'a': 'left'
    };

    if (key in key_direction_map) {
        world.player.move(key_direction_map[key]);

        world.player.draw_object();

        var passage = world.current_env.check_passage(world.player);

        if (passage != null) {
            env_dict = map_registry[passage.destination_id];
            world.current_env = new GridEnvironment(world, env_tiles, env_dict);
            world.current_env.draw_environment();
            world.current_env.draw_contents();
            world.player.x = passage.new_x
            world.player.y = passage.new_y
            world.player.draw_object();
        }
        return
    } 
    
    if (key == ' ') {
        if ((world.text_instance == null) & (world.canvas_instance == null)) {
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
            
    


