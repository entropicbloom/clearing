

char_sprites = {
    'file_name': 'character_sprites.png',
    'offset': 16,
    'border': 0,
}

player_sprites = {
    0: {
        'down': (0, 0, False),
        'up': (1, 0, False),
        'left': (2, 0, False),
        'right': (2, 0, True)
    },
    1: {
        'down': (3, 0, False),
        'up': (4, 0, False),
        'left': (5, 0, False),
        'right': (5, 0, True)
    }
}

old_man_sprites = {
    0: {
        'down': (5, 5, False),
        'up': (6, 5, False),
        'left': (7, 5, False),
        'right': (7, 5, True)
    },
    1: {
        'down': (0, 6, False),
        'up': (1, 6, False),
        'left': (2, 6, False),
        'right': (2, 6, True)
    }
}

old_man_1 = NPC(
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

stoner_dude_config_1 = NPC(
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