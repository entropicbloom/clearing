let tiles_png;
let sprites_png;
let world;

let dir_button_dim = 50
let dir_button_x_offset = 50
let dir_button_y_offset = 280

let CHAR_SPRITES_CONFIG = {
    'offset': 16,
    'border': 0,
    'colors': ['red', 'blue', 'green', 'brown'],
    'color_offset': 8
};

/*
OUTDOORS
0: ground
1: grass
2: high grass
3: flower lower right
4: flower upper left
5: tree top
6: tree trunk
7: pink floor
8: whirlpool
9: water
10: reef (?)
11: water upper border
12: water upper right corner
13: water right border
14: rock upper left
15: rock upper right
16: rock lower left
17: rock lower right
18: mountain top
19: mountain wall front
20: mountail corner front left
21: mountain wall left
22: mountian corner front right
23: mountian wall right
24: mountain top rear
56: sign


HOUSES
25: green house roof left
26: green house roof
27: green house roof right
28: green house left
29: green house door
30: green house window
31: green house right
37: simple house left
38: simple house wall
39: simple house right
40: simple house left corner
41: simple house bottom
42: simple house right corner
43: simple house window left wall
44: simple house window left
45: simple house window right
46: simple house window right wall
47: small green roof left
48: small green roof middle
49: small green roof right
50: big green roof top left
51: big green roof top middle
52 big green roof top right
53: big green roof bottom left
54: big green roof bottom middle
55 big green roof bottom right


INSIDE
32: floor
33: black
34: wall
35: computer top
36: computer bottom

*/



let ENV_TILES_CONFIG = {
    'offset': 17,
    'border': 1,
    'mapping': {
        0: {x: 0, y: 0},
        1: {x: 0, y: 1},
        2: {x: 0, y: 2},
        3: {x: 0, y: 3},
        4: {x: 0, y: 4},
        5: {x: 0, y: 5},
        6: {x: 0, y: 6},
        7: {x: 0, y: 7},
        8: {x: 0, y: 8},
        9: {x: 0, y: 9},
        10: {x: 0, y: 10},
        11: {x: 6, y: 9},
        12: {x: 7, y: 9},
        13: {x: 7, y: 10},
        14: {x: 1, y: 2},
        15: {x: 2, y: 2},
        16: {x: 1, y: 3},
        17: {x: 2, y: 3},
        18: {x: 1, y: 12},
        19: {x: 1, y: 13},
        20: {x: 0, y: 13},
        21: {x: 0, y: 12},
        22: {x: 2, y: 13},
        23: {x: 2, y: 12},
        24: {x: 1, y: 11},
        25: {x: 10, y: 6},
        26: {x: 11, y: 6},
        27: {x: 13, y: 6},
        28: {x: 10, y: 7},
        29: {x: 11, y: 7},
        30: {x: 12, y: 7},
        31: {x: 13, y: 7},
        32: {x: 7, y: 13},
        33: {x: 19, y: 0},
        34: {x: 6, y: 15},
        35: {x: 8, y: 13},
        36: {x: 8, y: 14},
        37: {x: 1, y: 5},
        38: {x: 2, y: 5},
        39: {x: 3, y: 5},
        40: {x: 1, y: 6},
        41: {x: 2, y: 6},
        42: {x: 3, y: 6},
        43: {x: 3, y: 11},
        44: {x: 4, y: 11},
        45: {x: 3, y: 12},
        46: {x: 4, y: 12},
        47: {x: 6, y: 21},
        48: {x: 7, y: 21},
        49: {x: 8, y: 21},
        50: {x: 6, y: 19},
        51: {x: 7, y: 19},
        52: {x: 8, y: 19},
        53: {x: 6, y: 20},
        54: {x: 7, y: 20},
        55: {x: 8, y: 20},
        56: {x: 9, y: 1}
        
    },
    'walkability': [0, 1, 2, 3, 4, 7, 29, 32]
    
}