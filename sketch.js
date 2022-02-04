

class World {}

var world;

function setup() 

function setup() {
  size(600, 450);

  world = World();
  
  
  char_sprite_arr = load_tile_arr(10, 10, char_sprites);
  current_env = GridEnvironment(world, env_tiles, home_map);
  
  
  player = SpriteCharacter(world,
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
  player.draw_object();

}
  

function draw() {
    
    if (world.text_instance == null) {
        world.current_env.update_contents();
    }
    if (world.canvas_instance != null) {
        world.canvas_instance.draw_canvas();
    }
}

function keyPressed() {
    

    const key_direction_map = new Map();
    key_direction_map.set('w', 'up');
    key_direction_map.set('s', 'down');
    key_direction_map.set('d', 'right');
    key_direction_map.set('a', 'left');
    
    if (keyCode in key_direction_map.keys()) {

        world.player.move(key_direction_map[key]);
        world.player.draw_object();
        
        env_id, new_coordinates = world.current_env.check_passage(world.player);

        if (env_id > -1) {
            env_dict = map_registry[env_id];
            world.current_env = GridEnvironment(world, env_tiles, env_dict);
            world.current_env.draw_environment();
            world.current_env.draw_contents();
            world.player.x, world.player.y = new_coordinates;
            world.player.draw_object();
        }
        return
    } 
    
    if (keyCode == ' ') {
        if ((world.text_instance == null) & (world.canvas_instance == null)) {
            world.current_env.interact(world.player);
          return
        }
        if (world.text_instance != null) {
            if (world.text_instance.more_text_available()) {
                world.text_instance.display_text();
                world.text_instance.next();
            } else{
                draw_scene();
                world.text_instance = None;
          }
          return
        }
      }

        
    if (keyCode == 'e') {
        world.text_instance = None;
        world.canvas_instance = None;
        draw_scene();
    }
  }

function draw_scene() {
    world.current_env.draw_environment();
    world.current_env.draw_contents();
    world.player.draw_object();
}
            
    


