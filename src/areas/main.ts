import GameEngine from '../engine/GameEngine';
import Location from "../engine/Location";
import courtyard from './courtyard';
import livingroom from './livingroom';
import bar from './bar';
import hallway from './hallway'
import undecidedroom from './undecidedroom';
import rugroom from './rugroom';
import {diningroom, placeThumb, placePeace, placeOkay} from './diningroom';
import {thumbStatue, peaceStatue, okayStatue} from './notspecified';
import firepit from './firepit';

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
const kitchen = new Location();

// items
// const whiteChip = new Item();
// const redChip = new Item();
// const blueChip = new Item();
// const greenChip = new Item();

// location wiring
courtyard
    .link("north", livingroom)
    .link("through door", livingroom)
    .setOnEnter(() => tagIt("courtyard"));

livingroom
    .setId("Living Room")
    .setDesc("This is the living room. To the south lies the courtyard, and the kitchen is to the east.")
    .link("south", courtyard)
    .link("northeast", bar)
    .link("east", kitchen)
    .link("west", hallway)
    .setOnEnter(() => tagIt("livingroom"));

kitchen
    .setId("Kitchen")
    .setDesc("You're in the kitchen. To the east is the dining room, and to the west is the living room.")
    .link("west", livingroom)
    .link("east", diningroom)
    .setOnEnter(() => tagIt("kitchen"));

diningroom
    .link("west", kitchen)
    .setOnEnter(() => tagIt("diningroom"));

// item wiring
thumbStatue
    .setUse(() => placeThumb(gameEngine, thumbStatue));

peaceStatue
    .setUse(() => placePeace(gameEngine, peaceStatue));

okayStatue
    .setUse(() => placeOkay(gameEngine, okayStatue));

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