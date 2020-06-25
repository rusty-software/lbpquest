import GameEngine from '../engine/GameEngine';
import courtyard from './courtyard';
import {livingroom,
    headset,
    useHeadset,
    removeHeadset} from './livingroom';
import {vr,
    whiteChip} from './vr'
import bar from './bar';
import {hallway, 
    rope, 
    useRope} from './hallway'
import {undecidedroom, okayStatue} from './undecidedroom';
import {rugroom, 
    thumbStatue, 
    cowskin, 
    wearCowskin, 
    deerHead, 
    breakDeerhead,
    blueBook,
    readBlueBook} from './rugroom';
import firepit from './firepit';
import kitchen from './kitchen';
import {diningroom, 
    placeThumb, 
    placePeace, 
    placeOkay,
    blackChip} from './diningroom';
import {pooleast, useFish, cupboardKey} from './pooleast';
import poolwest from './poolwest';
import {backyard, feedMeter} from './backyard';
import tent from './tent';
import {bunkhouse, 
    useCupboardKey, 
    fish, 
    peaceStatue} from './bunkhouse';
import garage from './garage';
import insidegarage from './insidegarage';
import {robe,
    greenChip, 
    blueChip, 
    redChip} from './notspecified';

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
    white poker chip

snacks?

bar
    requires tequila, triple sec, lime, and ice

    making the marg reveals a green chip under the blender

firepit
    too hot to get close to without robe
    use horn 
    cook earl
        results in red poker chip

*/

// location wiring
courtyard
    .link("n", livingroom)
    .link("through door", livingroom)
    .setOnEnter(() => tagIt("courtyard"));

livingroom
    .link("s", courtyard)
    .link("ne", bar)
    .link("e", kitchen)
    .link("w", hallway)
    .link("through door", courtyard)
    .setOnEnter(() => tagIt("livingroom"));

bar
    .link("sw", livingroom)
    .setOnEnter(() => tagIt("bar"));

kitchen
    .link("w", livingroom)
    .link("e", diningroom)
    .setOnEnter(() => tagIt("kitchen"));

diningroom
    .link("w", kitchen)
    .link("n", pooleast)
    .setOnEnter(() => tagIt("diningroom"));

hallway
    .link("e", livingroom)
    .link("s", undecidedroom)
    .link("w", rugroom)
    .link("n", firepit)
    .setOnEnter(() => tagIt("hallway"));

undecidedroom
    .link("n", hallway)
    .setOnEnter(() => tagIt("undecidedroom"));

rugroom
    .link("e", hallway)
    .setOnEnter(() => tagIt("rugroom"));

firepit
    .link("s", hallway)
    .link("e", poolwest)
    .setOnEnter(() => tagIt("firepit"));

poolwest
    .link("ne", backyard)
    .link("e", pooleast)
    .link("w", firepit)
    .setOnEnter(() => tagIt("poolwest"));

pooleast
    .link("w", poolwest)
    .link("nw", backyard)
    .link("s", diningroom)
    .link("e", bunkhouse)
    .link("se", garage)
    .setOnEnter(() => tagIt("pooleast"));

backyard
    .link("se", pooleast)
    .link("sw", poolwest)
    .setOnEnter(() => tagIt("backyard"));

tent
    .link("through flap", backyard)
    .setOnEnter(() => tagIt("tent"));

bunkhouse
    .link("w", pooleast)
    .setOnEnter(() => tagIt("bunkhouse"));

garage
    .link("nw", pooleast)
    .link("through door", insidegarage)
    .setOnEnter(() => tagIt("garage"));

insidegarage
    .link("through door", garage)
    .setOnEnter(() => tagIt("insidegarage"));

// item wiring
headset
    .setUse(() => useHeadset(gameEngine, headset, vr))
    .on("remove", () => removeHeadset(gameEngine, headset));

fish.setUse(() => useFish(gameEngine, fish));

cupboardKey.setUse(() => useCupboardKey(gameEngine, cupboardKey));

cowskin.on("wear", () => wearCowskin(gameEngine, robe));

deerHead
    .on("break", () => breakDeerhead(gameEngine))
    .on("smash", () => breakDeerhead(gameEngine))
    .on("throw", () => breakDeerhead(gameEngine))
    .on("destroy", () => breakDeerhead(gameEngine));

blueBook.on("read", () => readBlueBook(gameEngine));

rope.setUse(() => useRope(gameEngine, robe));

thumbStatue.setUse(() => placeThumb(gameEngine, thumbStatue));
peaceStatue.setUse(() => placePeace(gameEngine, peaceStatue));
okayStatue.setUse(() => placeOkay(gameEngine, okayStatue));

blackChip.setUse(() => feedMeter(gameEngine, blackChip, tent));
redChip.setUse(() => feedMeter(gameEngine, redChip, tent));
blueChip.setUse(() => feedMeter(gameEngine, blueChip, tent));
greenChip.setUse(() => feedMeter(gameEngine, greenChip, tent));
whiteChip.setUse(() => feedMeter(gameEngine, whiteChip, tent));

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
backyard.addItem("black poker chip", blackChip);
backyard.addItem("red poker chip", redChip);
backyard.addItem("blue poker chip", blueChip);
backyard.addItem("green poker chip", greenChip);
backyard.addItem("white poker chip", whiteChip);

// END HACK ZONE

export default gameEngine;