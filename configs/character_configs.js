
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
          "The weird patterns are probably feedback signals into v cortex of what the brain expects"],
        ["We don't understand each other because everyone is talking about concepts in their own minds."],
        ["Dreaming is probably a constant dance between higher and lower levels of the brain.",
         "The lower levels are created by feedback signals carrying more abstract information from higher levels.",
         "Higher levels in turn change as a function of certain low level configurations."],
        ["Would suicide exist without consciousness?"],
        ["A rich conscious experience is like a delicious soup to which a chef ands all kinds of spices"],
        ["Concrete theory: on cannabis we are more conscious of lower-level cortical areas than higher ones."],
        ["Living is exploring and charting the map of consciousness."],
        ["Physics is the communication medium between conscious entities."],
        ["When you have no sensory input the abstract layers of the brain will instantiate the concrete ones"],
        ["Lying with display on face (helmet mode) hides but suggests reality behind eyes.",
         "The brain feels free to construct most likely world"],
        ["Consciousness is like an expanding and retracting sphere with turbulence in middle.", 
         "If the sphere is small then it's completely filled out by turbulence.", "The sphere oscillates."],
        ["Yearning something is getting a glimpse of a greater feeling.", "Be grateful for the glimpse.",
          "It's small but great, don't be sad about it."],
        ["One of my most beautiful memories is my earliest memory from the sea, getting to the sign, standing in the shallow water,",
         "the wind, the horizon, the fresh blue water,", "the possibilities, the beach, endlessness, fulfillment, childlike ignorance."],
        ["We are explorers of qualia.", "This includes pain. But that's ok, don't hold back. Explore it all. (Without inflicting it I yourself please)"],
        ["I'm like the human eye.", "I need to constantly keep moving otherwise I will stop seeing the things that are beautiful."],
        ["Sometimes the ego takes up a huge chunk of your consciousness, but it is never it."],
        ["Consciousness is a layered experience, corresponding to different abstraction layers.",
         "Drugs can, among other things, chance the equalizer setting of that layering."]
        ["Consciousness is like a gel and if you stretch it to contain many things it loses density and becomes more unclear."],
        ["Is consciousness fundamentally based on changes?",
         "And can it therefore only be experienced from the transition of one state into the next?"],
        ["Imagined places in consciousness are more real than just their picture.",
         "The mind builds the physics around it."],
        ["Pain and joy are like a coating over neutral qualia. But sometimes it is transparent.",
         "In some ways the true shape of some qualia might be visible."],
        ["You're always gonna feel like this, having problems and worries, and that's ok. It's completely fine."],
        ["Shapes in qualia are network formations of a graph of neurons"],
        ["What is the activity in the cortex when imagining mathematical space?"],
        ["Some thoughts have sounds, you can listen to them."],
        ["My childhood is full of bliss. (warm days and nights at the sea and with the family), I should be grateful"],
        ["Some kind of rendering procedure must be in use when visually imagining things."],
        ["Bloom (radiohead): a red mechanic berry, flashing between red and mechanic"],
        ["Consciousness is a landscape of local attractors (substrate is network).", 
         "Going down an [...] attractor = pleasure?"],
        ["Truths are often blurry and complicated. Being confused may be the truest sometimes."],
        ["To try and to fail is ok"],
        ["Loving is the most important thing,",
         "but sometimes you need the right people to make that love come to the surface."]
        ["Mindfulness can turn painful things into weird things."],
        ["I need to forgive myself for being flawed."],
        ["I’ve experienced beauty and pain, and that’s what things will always be like."],
        ["Most of my pain comes from “you have to thoughts”,", "masts of wood that are pushed in my direction.", "Let them through.",
         "These masts of pressure are my agents (minski) that want to make sure they will stay alive.",
         "Tell them you will not abandon them"],
        ["Feel life and don’t forget that it’s not two separate halves of gold and brown.",
         "It’s a gradient block with multiple valances in it"],
        ["Memories are echoes of experience.", "A profound experience will create ripples, i.e. memories.",
         "Intense experiences are like impacts into the sea of recollection."],
        ["It’s hard to accept that decisions cut away one of the possible paths."],
        ["Consciousness is produced in absolute darkness."],
        ["Listening to a song is a way of looking at a mathematical structure"],
        ["A voice is a sound we perceive as infused with vitality."]
    ],
    'Stoner dude',
)

stoner_dude_2 = new NPC(
    world,
    250,
    200,
    25,
    25,
    5,
    stoner_dude_sprites,
    'blue',
    [
        ['When afraid, bet on love.'],
        ['I came here on a sneaky 7 tram.'],
        ['Here is how I would visualize betting on love:',
         'A red solid heart, slightly shining, flying upwards, against waves of transparent mud.'],
        ['Consciousness is an island in a sea of unconscious influences.'],
        ['Enjoy life like a cheese.'],
        ['The love in us all will do it.'],
        ['It’s important to distinguish real love from fake versions.'],
        ['Ride the waves and the tides.'],
        ['Bet on love to yourself.', 'All you can do is bet on love and be kind to yourself.',
         'Everything else will follow'],
        ['The sound at the beginning of "Love In The Time Of Lexapro" is the most beautiful, fine, shiny mist.',
         'Later in the song I hear metal ball with a flower on top (head).'],
        ['We contain everything.']

    ],
    'Stoner dude',
)