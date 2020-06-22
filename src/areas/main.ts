import GameEngine from '../engine/GameEngine';
import Location from "../engine/Location";
import Item from '../engine/Item';
import courtyard from './courtyard'
import diningroom from './diningroom'

/*
pool
    blue chip on bottom
    can swim anytime
    cannot dive without snorkel gear
    dive with snorkel gear to get the blue chip

garage
    requires thieves' tools to open the door
    kayak in garage
    snorkel gear in kayak

VR 

snacks

bar
    requires tequila, triple sec, lime, and ice

    making the marg reveals a green chip under the blender

*/

// locations
const livingroom = new Location();
const kitchen = new Location();

// items
const diningTable = new Item();
const thumbStatue = new Item();
const peaceStatue = new Item();
const okayStatue = new Item();
// const whiteChip = new Item();
// const redChip = new Item();
// const blueChip = new Item();
// const greenChip = new Item();
const blackChip = new Item();

// location details
courtyard
    .link("north", livingroom)
    .link("through door", livingroom)
    .setOnEnter(() => tagIt("courtyard"));

livingroom
    .setId("Living Room")
    .setDesc("This is the living room. To the south lies the courtyard, and the kitchen is to the east.")
    .link("south", courtyard)
    .link("east", kitchen)
    .setOnEnter(() => tagIt("livingroom"));

kitchen
    .setId("Kitchen")
    .setDesc("You're in the kitchen. To the east is the dining room, and to the west is the living room.")
    .link("west", livingroom)
    .link("east", diningroom)
    .setOnEnter(() => tagIt("kitchen"));

function shuffle(arr: any[]) {
    let currentIndex = arr.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex -= 1;
      
          temporaryValue = arr[currentIndex];
          arr[currentIndex] = arr[randomIndex];
          arr[randomIndex] = temporaryValue;
    }
    return arr;
}

let mafiaPlayable: boolean = false;
let mafiaWon: boolean = false;
let blackChipTaken: boolean = false;
let mafiaPlayers: string[] = ["John", "Paul"];
let townPlayers: string[] = ["Joseph", "Tom", "Henry", "Max"];
let executed: string[] = [];

function handleAccuse(name: string, type: string, arr: string[]) {
    const idx = arr.indexOf(name);
    if (idx > -1) {
        arr.splice(idx, 1);
    }
    executed.push(name + " (" + type + ")");
    if (mafiaPlayers.length === 0) {
        return wonMafia();
    } else if (mafiaPlayers.length > townPlayers.length) {
        return lostMafia();
    }
    return playMafia();
}

const mafia = new Item();
const John = new Item()
    .on("accuse", () => {
        return handleAccuse("John", "mafia", mafiaPlayers);
    });
const Paul = new Item()
    .on("accuse", () => {
        return handleAccuse("Paul", "mafia", mafiaPlayers);
    });
const Joseph = new Item()
    .on("accuse", () => {
        return handleAccuse("Joseph", "civilian", townPlayers);
    });
const Tom = new Item()
    .on("accuse", () => {
        return handleAccuse("Tom", "civilian", townPlayers);
    });
const Henry = new Item()
    .on("accuse", () => {
        return handleAccuse("Henry", "civilian", townPlayers);
    });
const Max = new Item()
    .on("accuse", () => {
        return handleAccuse("Max", "civilian", townPlayers);
    });
const playMafia = () => {
    if (mafiaPlayable) {
        let players = shuffle(mafiaPlayers.concat(townPlayers));
        let response = "You... are a civilian."
        + "\n\nThe Moderator speaks.\n\nRemaining players (besides you) are: " + players.join(", ")
        + "\n\nYou have executed: " + executed.join(", ")
        + "\n\nYou may accuse a player by entering `accuse <player name>`. If you the balance tips in the mafia's favor, the game is over!";
        return response;
    } else if (mafiaWon && !blackChipTaken) {
        return "You've already won the Mafia game. You just need to take the black poker chip.";
    } 
    return "With whom?";
};
const lostMafia = () => {
    mafiaPlayers = ["John", "Paul"];
    townPlayers = ["Joseph", "Tom", "Henry", "Max"];
    executed = [];
    
    return "\"The mafia has won!\" exclaims the Moderator. \"The game will be reset. Better luck next time, kid.\"";
}
const wonMafia = () => {
    diningroom.addItem("black poker chip", blackChip);
    mafiaWon = true;
    mafiaPlayable = false;

    return "\"You've won the game!\" declares the Moderator. \"Please accept this as a token of your prowess.\"\n\nThe Moderator slides a black poker chip toward you."
}
const quitMafia = () => {
    return "You stand up and leave the table, the Moderator casting a confused look at you.";
}

let diningRoomText = "The dining room is dominated by a large glass dining table. A door to the north leads outside, and the kitchen is to your west."
let diningRoomMafiaText = "The dining room is dominated by a large glass dining table. Seven people are sitting around the table, looking at you expectently. A door to the north leads outside, and the kitchen is to your west.";

diningroom
    .link("west", kitchen)
    .setOnEnter(() => tagIt("diningroom"));

// item details
let thumbPlaced = false;
let peacePlaced = false;
let okayPlaced = false;
let notAllStatuesPlacedText = "You place the statue in one of the empty spots on the table.";
let allStatuesPlacedText = "As you place the final statue on the table, a group of seven guys, none of whom you recognize, walk into the kitchen. They introduce themselves as Henry, John, Joseph, Max, Paul, Tom, and Moderator. They take seats around the table, and Moderator starts shuffling some cards.\n\n\"Care for a game of Mafia?\" Moderator asks.";

diningTable
    .setExamine(() => {
        if (mafiaPlayable) {
            return "The table is resplendent with three statues, and is surrounded by seven people looking at you expectently.";
        } else if (mafiaWon && !blackChipTaken) {
            return "The table is covered in fingerprints, but is resplendent with three hand statues. A black poker chip is near the statues.";
        } else if (mafiaWon) {
            return "The table is covered in fingerprints, but is resplendent with three hand statues.";
        }
        return "The table is covered in fingerprints, except for three circles. It looks as if some things used to adorn the table top but were recently removed.";
    })
    .setTake(() => "The dining table definitely will NOT fit in your rucksack.")
    .setTakeable(false);

diningroom.addItem("dining table", diningTable);

mafia
    .setExamine(() => {
        return "examining mafia. Should list game status as well as list commands and how to use them.";
    })
    .setTake(() => "The Moderator looks at you sternly, saying \"Those aren't your cards.\"")
    .setTakeable(false)
    .setUse(() => "You can accuse someone or quit the game.")
    .on("play", playMafia)
    .on("quit", quitMafia);

diningroom.addItem("mafia", mafia);
diningroom.addItem("john", John);
diningroom.addItem("paul", Paul);
diningroom.addItem("joseph", Joseph);
diningroom.addItem("tom", Tom);
diningroom.addItem("henry", Henry);
diningroom.addItem("max", Max);

thumbStatue
    .setExamine(() => "This is a small, decorative statue with the thumb up, Fonzie-style.")
    .setTake(() => "You put the thumb statue in your rucksack.")
    .setTakeable(true)
    .setUse(() => {
        if (gameEngine.currentLocation === diningroom) {
            thumbPlaced = true;
            diningroom.addItem("thumb statue", thumbStatue);
            gameEngine.removeInventoryItem("thumb statue");
            peaceStatue.setTake(() => "The thumb statue looks perfect where it is. You leave it there.")
            thumbStatue.setTakeable(false);
            if (peacePlaced && okayPlaced) {
                diningroom.setDesc(diningRoomMafiaText);
                mafiaPlayable = true;
                return allStatuesPlacedText;
            }
            return notAllStatuesPlacedText;
        }
        return "This doesn't look like the right place to use the thumb statue."
    });

peaceStatue
    .setExamine(() => "This is a small, decorative statue with two fingers up, peace-style.")
    .setTake(() => "You put the peace statue in your rucksack.")
    .setTakeable(true)
    .setUse(() => {
        if (gameEngine.currentLocation === diningroom) {
            peacePlaced = true;
            diningroom.addItem("peace statue", peaceStatue);
            gameEngine.removeInventoryItem("peace statue");
            peaceStatue.setTake(() => "The peace statue looks perfect where it is. You leave it there.")
            peaceStatue.setTakeable(false)
            if (thumbPlaced && okayPlaced) {
                diningroom.setDesc(diningRoomMafiaText);
                mafiaPlayable = true;
                return allStatuesPlacedText;
            }
            return notAllStatuesPlacedText;
        }
        return "This doesn't look like the right place to use the peace statue."
    });

okayStatue
    .setExamine(() => "This is a small, decorative statue with the pointer finger touching the thumb, gaze-style.")
    .setTake(() => "You put the okay statue in your rucksack.")
    .setTakeable(true)
    .setUse(() => {
        if (gameEngine.currentLocation === diningroom) {
            okayPlaced = true;
            diningroom.addItem("okay statue", okayStatue);
            gameEngine.removeInventoryItem("okay statue");
            okayStatue.setTake(() => "The okay statue looks perfect where it is. You leave it there.")
            okayStatue.setTakeable(false)
             if (thumbPlaced && peacePlaced) {
                diningroom.setDesc(diningRoomMafiaText);
                mafiaPlayable = true;
                return allStatuesPlacedText;
            }
            return notAllStatuesPlacedText;
        }
        return "This doesn't look like the right place to use the okay statue."
    });

blackChip
    .setExamine(() => "The black poker chip looks completely smooth and shiny, like it's hardly been used.")
    .setTake(() => {
        blackChipTaken = true;
        diningroom.setDesc(diningRoomText);
        return "You put the black poker chip into your rucksack. As you do, the people around the table rise, tip their hats to you, and make their way out."
    })
    .setTakeable(true)
    .setUse(() => "checks here to limit usage");

const gameEngine = new GameEngine(courtyard);
gameEngine.setStartLocation(courtyard);

const startTime = new Date();
function timeDiffInSeconds(): number {
    return Math.floor((new Date().getTime() - startTime.getTime()) / 1000);
}

const gtag: (a: any, b:any, c:any) => void = (global as any).gtag;
const tagIt = (action: string) =>
    !!gtag && gtag('event', action, {
        event_category: 'game',
        event_label: new Date().toUTCString(),
        value: timeDiffInSeconds(),
    });
tagIt('start');

// HACK ZONE
// courtyard.addItem("thumb statue", thumbStatue);
// courtyard.addItem("peace statue", peaceStatue);
// courtyard.addItem("okay statue", okayStatue);
// courtyard.link("dining room", diningroom);
// gameEngine.send("take thumb statue");
// gameEngine.send("take peace statue");
// gameEngine.send("take okay statue");
// gameEngine.send("go dining room");
// gameEngine.send("use thumb statue");
// gameEngine.send("use peace statue");
// gameEngine.send("use okay statue");
// END HACK ZONE

export default gameEngine;