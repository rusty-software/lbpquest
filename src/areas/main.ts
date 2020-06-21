import GameEngine from '../engine/GameEngine';
import Location from "../engine/Location";
import Item from '../engine/Item';

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

dining room
    fingerprints all over the table, but outlines of 3 missing hand decorations
    adding decorations, the mafia team walks in and sits down

    mafia
        bad guys: john, paul
        good guys: joseph, tom, henry, max

        accusing both bad guys before numBad >= numGood earns you the black chip


*/

// locations
const courtyard = new Location();
const livingroom = new Location();
const kitchen = new Location();
const diningroom = new Location();

// items
const fountain = new Item();
const coin = new Item();
const thumbStatue = new Item();
const peaceStatue = new Item();
const okayStatue = new Item();
// const whiteChip = new Item();
// const redChip = new Item();
// const blueChip = new Item();
// const greenChip = new Item();
// const blackChip = new Item();

// location details
courtyard
    .setId("Courtyard")
    .setDesc("You are in the courtyard of Casa Cantera. You can almost feel the rosemary pollen coat your slightly sweating skin as you listen to the sounds of tepid water trickling through the slightly-functioning fountain. To the north is the door into the Casa.\n\nThere appears to be a note taped to the door.")
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

diningroom
    .setId("Dining Room")
    .setDesc("The dining room is dominated by a large glass dining table. A door to the north leads outside, and the kitchen is to your west.")
    .link("west", kitchen)
    .setOnEnter(() => tagIt("diningroom"));

// item details
coin
    .setExamine(() => "The coin is a currency you don't recognize, but appears to be made of a copper/nickel mix and is about the size of a half dollar.")
    .setTake(() => {
        fountain.setExamine(() => "The fountain gurgles sporatically.");
        return "You snatch the coin from the fountain bowl, drying it and your hands on your shirt, then put the coin into your rucksack.";
    })
    .setTakeable(true)
    .setUse(() => "Logic to ensure location and viability and stuff.");

fountain
    .setExamine(() => {
        courtyard.addItem("coin", coin);
        return "The fountain gurgles sporatially, but the water is clear enough to make you aware of something glittering at the bottom of its bowl. It looks like a coin of some kind.";
    })
    .setTake(() => "The fountain is fixed in place, and even if you could move it, probably wouldn't fit in your rucksack.")
    .setUse(() => "You consider sipping from the fountain's lukewarm water, but think better of it, given what everyone else does in the pool...");

courtyard.addItem("fountain", fountain);

let thumbPlaced = false;
let peacePlaced = false;
let okayPlaced = false;
let notAllStatuesPlacedText = "You place the statue in one of the empty spots on the table.";
let allStatuesPlacedText = "As you place the final statue on the table, a group of seven guys, none of whom you recognize, walk into the kitchen. They introduce themselves as Henry, John, Joseph, Max, Paul, Tom, and Narrator. They take seats around the table, and Narrator starts shuffling some cards.\n\n\"Care for a game of Mafia?\" Narrator asks.";
let diningRoomMafiaText = "The dining room is dominated by a large glass dining table. Seven people are sitting around the table, looking at you expectently. A door to the north leads outside, and the kitchen is to your west.";

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
                return allStatuesPlacedText;
            }
            return notAllStatuesPlacedText;
        }
        return "This doesn't look like the right place to use the okay statue."
    });


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
courtyard.addItem("thumb statue", thumbStatue);
courtyard.addItem("peace statue", peaceStatue);
courtyard.addItem("okay statue", okayStatue);
courtyard.link("dining room", diningroom);
gameEngine.send("take thumb statue");
gameEngine.send("take peace statue");
gameEngine.send("take okay statue");
gameEngine.send("go dining room");
// END HACK ZONE

export default gameEngine;