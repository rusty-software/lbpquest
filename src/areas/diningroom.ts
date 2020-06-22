import GameEngine from '../engine/GameEngine';
import Location from "../engine/Location";
import Item from "../engine/Item";

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

export const diningroom = new Location()
    .setId("Dining Room")
    .setDesc(diningRoomText);

const diningTable = new Item()
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

let thumbPlaced = false;
let peacePlaced = false;
let okayPlaced = false;
let notAllStatuesPlacedText = "You place the statue in one of the empty spots on the table.";
let allStatuesPlacedText = "As you place the final statue on the table, a group of seven guys, none of whom you recognize, walk into the kitchen. They introduce themselves as Henry, John, Joseph, Max, Paul, Tom, and Moderator. They take seats around the table, and Moderator starts shuffling some cards.\n\n\"Care for a game of Mafia?\" Moderator asks.";

export function placeThumb(gameEngine: GameEngine, thumbStatue: Item) {
    if (gameEngine.currentLocation === diningroom) {
        thumbPlaced = true;
        diningroom.addItem("thumb statue", thumbStatue);
        gameEngine.removeInventoryItem("thumb statue");
        thumbStatue.setTake(() => "The thumb statue looks perfect where it is. You should leave it there.")
        thumbStatue.setTakeable(false);
        if (peacePlaced && okayPlaced) {
            diningroom.setDesc(diningRoomMafiaText);
            mafiaPlayable = true;
            return allStatuesPlacedText;
        }
        return notAllStatuesPlacedText;
    }
    return "This doesn't look like the right place to use the thumb statue."
}

export function placePeace(gameEngine: GameEngine, peaceStatue: Item) {
    if (gameEngine.currentLocation === diningroom) {
        peacePlaced = true;
        diningroom.addItem("peace statue", peaceStatue);
        gameEngine.removeInventoryItem("peace statue");
        peaceStatue.setTake(() => "The peace statue looks perfect where it is. You should leave it there.")
        peaceStatue.setTakeable(false)
        if (thumbPlaced && okayPlaced) {
            diningroom.setDesc(diningRoomMafiaText);
            mafiaPlayable = true;
            return allStatuesPlacedText;
        }
        return notAllStatuesPlacedText;
    }
    return "This doesn't look like the right place to use the peace statue."
}

export function placeOkay(gameEngine: GameEngine, okayStatue: Item) {
    if (gameEngine.currentLocation === diningroom) {
        okayPlaced = true;
        diningroom.addItem("okay statue", okayStatue);
        gameEngine.removeInventoryItem("okay statue");
        okayStatue.setTake(() => "The okay statue looks perfect where it is. You should leave it there.")
        okayStatue.setTakeable(false)
        if (thumbPlaced && peacePlaced) {
            diningroom.setDesc(diningRoomMafiaText);
            mafiaPlayable = true;
            return allStatuesPlacedText;
        }
        return notAllStatuesPlacedText;
    }
    return "This doesn't look like the right place to use the okay statue."
}

const mafia = new Item()
    .setExamine(() => {
        return "examining mafia. Should list game status as well as list commands and how to use them.";
    })
    .setTake(() => "The Moderator looks at you sternly, saying \"Those aren't your cards.\"")
    .setTakeable(false)
    .setUse(() => "You can accuse someone or quit the game.")
    .on("play", playMafia)
    .on("quit", quitMafia);

export const blackChip = new Item()
    .setExamine(() => "The black poker chip looks completely smooth and shiny, like it's hardly been used.")
    .setTake(() => {
        blackChipTaken = true;
        diningroom.setDesc(diningRoomText);
        return "You put the black poker chip into your rucksack. As you do, the people around the table rise, tip their hats to you, and make their way out."
    })
    .setTakeable(true)
    .setUse(() => "checks here to limit usage");

diningroom.addItem("dining table", diningTable);
diningroom.addItem("mafia", mafia);
diningroom.addItem("john", John);
diningroom.addItem("paul", Paul);
diningroom.addItem("joseph", Joseph);
diningroom.addItem("tom", Tom);
diningroom.addItem("henry", Henry);
diningroom.addItem("max", Max);

