import GameEngine from '../engine/GameEngine';
import courtyard from './courtyard';

import {livingroom,
    headset,
    useHeadset,
    removeHeadset,
    porn,
    horn} from './livingroom';

import {vr,
    whiteChip} from './vr'

import {bar,
    useLime,
    marg,
    takeMarg,
    greenChip,
    useCup,
    drinkMarg} from './bar';

import {hallway, 
    rope, 
    useRope} from './hallway'

import {undecidedroom
    , useOrnateKey
    , okayStatue} from './undecidedroom';

import {rugroom, 
    thumbStatue, 
    cowskin, 
    wearCowskin, 
    deerHead, 
    breakDeerhead,
    blueBook,
    readBlueBook,
    ornateKey} from './rugroom';

import {firepit,
    pit,
    usePit,
    useEarlAndHorn,
    skeweredEarl,
    roastSkeweredEarl,
    redChip} from './firepit';

import {kitchen, 
    usePorn,
    lime,
    cup,
    earl} from './kitchen';

import {diningroom, 
    placeThumb, 
    placePeace, 
    placeOkay,
    blackChip} from './diningroom';

import {pooleast, 
    useFish, 
    cupboardKey} from './pooleast';

import {poolwest,
    pool, 
    usePool,
    blueChip} from './poolwest';

import {backyard, 
    feedMeter} from './backyard';

import tent from './tent';

import {bunkhouse, 
    useCupboardKey, 
    fish, 
    peaceStatue} from './bunkhouse';

import garage from './garage';

import insidegarage from './insidegarage';

import {robe, snorkel} from './notspecified';

/*

garage
    requires thieves' tools to open the door
    kayak in garage
    snorkel gear in kayak

snacks?

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

porn.setUse(() => usePorn(gameEngine));
horn.setUse(() => useEarlAndHorn(gameEngine, "horn"));

earl.setUse(() => useEarlAndHorn(gameEngine, "earl"));
cup.setUse(() => useCup(gameEngine));
lime.setUse(() => useLime(gameEngine));
marg
    .setTake(() => takeMarg(gameEngine))
    .on("drink", () => drinkMarg(gameEngine));

fish.setUse(() => useFish(gameEngine, fish));
cupboardKey.setUse(() => useCupboardKey(gameEngine, cupboardKey));

rope.setUse(() => useRope(gameEngine, robe));
cowskin.on("wear", () => wearCowskin(gameEngine, robe));
deerHead
    .on("break", () => breakDeerhead(gameEngine))
    .on("smash", () => breakDeerhead(gameEngine))
    .on("throw", () => breakDeerhead(gameEngine))
    .on("destroy", () => breakDeerhead(gameEngine));
blueBook.on("read", () => readBlueBook(gameEngine));
ornateKey.setUse(() => useOrnateKey(gameEngine));

pit.setUse(() => usePit(gameEngine));
skeweredEarl
    .setUse(() => roastSkeweredEarl(gameEngine))
    .on("roast", () => roastSkeweredEarl(gameEngine));

pool.setUse(() => usePool(gameEngine))
    .on("swim in", () => usePool(gameEngine));
snorkel.setUse(() => usePool(gameEngine));

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

poolwest.addItem("snorkel", snorkel);
// END HACK ZONE

export default gameEngine;