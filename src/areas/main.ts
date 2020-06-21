import GameEngine from '../engine/GameEngine';
import Location from "../engine/Location";
import Item from '../engine/Item';

// declarations
const courtyard = new Location();
const livingroom = new Location();
const fountain = new Item();
const coin = new Item();

// locations
courtyard
    .setId("Courtyard")
    .setDesc("You are in the courtyard of Casa Cantera. You can almost feel the rosemary pollen coat your slightly sweating skin as you listen to the sounds of tepid water trickling through the slightly-functioning fountain. To the north is the door into the Casa.\n\nThere appears to be a note taped to the door.")
    .link("north", livingroom)
    .link("through door", livingroom)
    .setOnEnter(() => tagIt("courtyard"));

livingroom
    .setId("Living Room")
    .setDesc("This is the living room.")
    .link("south", courtyard)
    .link("through door", courtyard)
    .setOnEnter(() => tagIt("livingroom"));

// items
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

export default gameEngine;