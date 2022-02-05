
player_sprites = {
    step_sprites: [
        {
            'down': {i: 0, j: 0, mirror: false},
            'up': {i: 1, j: 0, mirror: false},
            'left': {i: 2, j: 0, mirror: false},
            'right': {i: 2, j: 0, mirror: true}
        },
        {
            'down': {i: 3, j: 0, mirror: false},
            'up': {i: 4, j: 0, mirror: false},
            'left': {i: 5, j: 0, mirror: false},
            'right': {i: 5, j: 0, mirror: true}
        }
]
}

old_man_sprites = {
    step_sprites: [
        {
            'down': {i: 5, j: 5, mirror: false},
            'up': {i: 6, j: 5, mirror: false},
            'left': {i: 7, j: 5, mirror: false},
            'right': {i: 7, j: 5, mirror: true}
        },
        {
            'down': {i: 0, j: 6, mirror: false},
            'up': {i: 1, j: 6, mirror: false},
            'left': {i: 2, j: 6, mirror: false},
            'right': {i: 2, j: 6, mirror: true}
        }
    ]
}

old_man_1 = new NPC(
    world,
    300, // x
    100, // y
    25, // object_width
    25, // object_height
    10, // step_size
    old_man_sprites, // char_sprites
    [                                       // dialogue
        ['Ah..', 'Good to see you.'],
        ['Ugh'],
        ['A monk asked Seigen, "What is the essence of Buddhism?"', 'Seigen said, "What is the price of rice in Roryo?"'],
        ['Once a monk made a request of Joshu.',
         '"I have just entered the monastery," he said. "Please give me instructions, Master."',
         'Joshu said, "Have you had your breakfast?"',
         '"Yes, I have," replied the monk.',
         '"Then," said Joshu, "wash your bowls."',
         'The monk was enlightened.'],
        ['When the many are reduced to one, to what is the one reduced?'],
        ['A monk asked Master Haryo, "What is the way?"', 'Haryo said, "An open-eyed man falling into the well."'],
        ['One day as Manjusri stood outside the gate, the Buddha called to him, \n "Manjusri, Manjusri, why do you not enter?"',
         'Manjusri replied, "I do not see myself as outside. Why enter?"'],
        ['What is the color of wind?'],
        ['If you meet the Buddha, kill the Buddha.'],
        ['A monk asked Tozan when he was weighing some flax, "What is Buddha?"', 'Tozan said: "This flax weighs three pounds."'],
        ['Two hands clap and there is a sound.', 'What is the sound of one hand?'],
        ['All the worlds in the ten directions are One Bright Pearl.'],
        ['A monk asked Joshu, \n"What is the meaning of the patriarchs coming from the West?"',
         'Joshu said, "The oak tree there in the garden."'],
        ['A monk asked Ummon: "What is Buddha?', 'Ummon answered him: "Dried dung."'],
        ['A monk asked Joshu, "Has a dog Buddha-nature or not?"', 'Joshu answered: "Mu."']
        
    ],
    'Old man' // name
)

stoner_dude_config_1 = new NPC(
    world,
    200,
    200,
    25,
    25,
    10,
    [
        ["What's good"]  
    ],
    'Stoner dude',
)