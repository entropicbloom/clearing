
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
            'down': {i: 0, j: 6, mirror: false},
            'up': {i: 1, j: 6, mirror: false},
            'left': {i: 2, j: 6, mirror: false},
            'right': {i: 2, j: 6, mirror: true}
        },
        {
            'down': {i: 5, j: 5, mirror: false},
            'up': {i: 6, j: 5, mirror: false},
            'left': {i: 7, j: 5, mirror: false},
            'right': {i: 7, j: 5, mirror: true}
        }
    ]
}


stoner_dude_sprites = {
    step_sprites: [
        {
            'down': {i: 4, j: 19, mirror: false},
            'up': {i: 5, j: 19, mirror: false},
            'left': {i: 6, j: 19, mirror: false},
            'right': {i: 6, j: 19, mirror: true}
        },
        {
            'down': {i: 1, j: 19, mirror: false},
            'up': {i: 2, j: 19, mirror: false},
            'left': {i: 3, j: 19, mirror: false},
            'right': {i: 3, j: 19, mirror: true}
        }
    ]
}



old_man_1 = new NPC(
    world,
    300, // x
    100, // y
    25, // object_width
    25, // object_height
    5, // step_size
    old_man_sprites, // char_sprites
    'brown',
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

old_man_2 = new NPC(
    world,
    300, // x
    200, // y
    25, // object_width
    25, // object_height
    5, // step_size
    old_man_sprites, // char_sprites
    'red',
    [       
        ["I'm lost."]
    ],                      // dialogue
    'Lost old man' // name
)

stoner_dude_1 = new NPC(
    world,
    200,
    200,
    25,
    25,
    5,
    stoner_dude_sprites,
    'green',
    [
        ['My two feet feel like one single object in consciousness.'],
        ['The auto correction due to redundancies in language is fascinating, even for whole phrases.'],
        ['Much more effortlessly present'],
        ['Alles existiert in mir'],
        ['Consciousness is a graph of possible experiences', 'Subgraphs are conscious?',
         'Edge contraction makes more complex conscious experience'],
        ['I can look deeper into a sensation, feeling'],
        ['Me and the universe are like layers in an onion intertwined'],
        ['Being high is like being overpowered in mediation'],
        ['All selfish acts are signs of love for your future self. Narcissism?'],
        ['Reality is what persists in consciousness'],
        ['Pay attention to the drums in motherboard'],
        ['The words just try to capture a feeling'],
        ['One conscious experience is not flat in the time dimension'],
        ['Every atom is doing its best to produce consciousness, if they do'],
        ["Distances don't exist, try to feel them"],
        ['My legs being together in physical reality makes them the same object in consciousness',
         'Objects in consciousness being shared and carried by both legs'],
        ['When visualizing something, the imagination is very limited as it must portray it viewed from a certain perspective',
         'Perspective is ego'],
        ['The less abstract layers of consciousness are revealed on substances'],
        ["I can feel the space between my legs, it's all one object, including the legs"],
        ['Love = appreciate fully the presence of someone'],
        ['If consciousness is like a deep neural network',
        'then getting hi or meditating is like experiencing the earlier (less abstract) layers'],
        ['What I see and feel and here is the best representation of the associated neurons firing'],
        ["It's a pain to respond to thoughts, don't bother.",
         'Even when the ego says please me please me, tell me everything will be ok etc.'],
         ["Is crazy that we see it visual field when it's dark.",
          "The weird patterns are probably feedback signals into v cortex of what the brain expects"]
    ],
    'Stoner dude',
)