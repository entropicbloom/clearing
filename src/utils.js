


function load_tile_arr(num_tiles_x, num_tiles_y, tile_dict, tile_img) {
    var tile_arr = [...Array(num_tiles_y)].map(e => Array(num_tiles_x).fill(null))
    image(tile_img, 0, 0)


    // read all individual tiles
    for (var i = 0; i < tile_arr.length; i++) {
        for (var j = 0; j < tile_arr[0].length; j++) {
            offset = tile_dict['offset']
            img_cropped = tile_img.get(i * offset + tile_dict['border'], j * offset + tile_dict['border'],
                                    offset - tile_dict['border'], offset - tile_dict['border'])
            tile_arr[i][j] = img_cropped
        }
    }


    return tile_arr
    
}