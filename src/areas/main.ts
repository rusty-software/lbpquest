import GameEngine from '../engine/GameEngine';

import Courtyard from './Courtyard';

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
    , okayStatue
    , pouch
    , thievesTools} from './undecidedroom';

import {rugroom, 
    thumbStatue, 
    cowskin, 
    wearCowskin, 
    deerHead, 
    breakDeerhead,
    book,
    readBook,
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

import {backyard, feedMeter} from './backyard';

import Tent from './Tent';

import {bunkhouse, 
    useCupboardKey, 
    fish, 
    peaceStatue} from './bunkhouse';

import {garage, useTools} from './garage';

import {insidegarage, snorkel} from './insidegarage';

import {robe} from './notspecified';

/*
snacks?
*/

// location wiring
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


bunkhouse
    .link("w", pooleast)
    .setOnEnter(() => tagIt("bunkhouse"));

garage
    .link("nw", pooleast)
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

fish.setUse(() => useFish(gameEngine));
cupboardKey.setUse(() => useCupboardKey(gameEngine));

rope.setUse(() => useRope(gameEngine, robe));
cowskin.on("wear", () => wearCowskin(gameEngine, robe));

deerHead
    .on("break", () => breakDeerhead(gameEngine))
    .on("smash", () => breakDeerhead(gameEngine))
    .on("throw", () => breakDeerhead(gameEngine))
    .on("destroy", () => breakDeerhead(gameEngine));
book.on("read", () => readBook(gameEngine));

ornateKey.setUse(() => useOrnateKey(gameEngine));
pouch.setUse(() => useTools(gameEngine, linkInsideGarage));
thievesTools.setUse(() => useTools(gameEngine, linkInsideGarage));
const linkInsideGarage = () => {
    garage.link("through door", insidegarage);
}

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


const startTime = new Date();
const timeDiffInSeconds = (): number => {
    return Math.floor((new Date().getTime() - startTime.getTime()) / 1000);
}

const gtag: (a: any, b:any, c:any) => void = (global as any).gtag;
const tagIt = (action: string) =>
    !!gtag && gtag('event', action, {
        event_category: 'game',
        event_label: new Date().toUTCString(),
        value: timeDiffInSeconds(),
    });

const courtyard = new Courtyard(tagIt);
const gameEngine = new GameEngine(courtyard);
gameEngine.setStartLocation(courtyard);

courtyard
    .link("n", livingroom)
    .link("through door", livingroom);

livingroom
    .link("s", courtyard)
    .link("ne", bar)
    .link("e", kitchen)
    .link("w", hallway)
    .link("through door", courtyard)
    .setOnEnter(() => tagIt("livingroom"));


const tent = new Tent(gameEngine, tagIt);
tent.link("through flap", backyard);
blackChip.setUse(() => feedMeter(gameEngine, blackChip, tent));
redChip.setUse(() => feedMeter(gameEngine, redChip, tent));
blueChip.setUse(() => feedMeter(gameEngine, blueChip, tent));
greenChip.setUse(() => feedMeter(gameEngine, greenChip, tent));
whiteChip.setUse(() => feedMeter(gameEngine, whiteChip, tent));
courtyard.coin.setUse(() => tent.useCoin());

// HACK ZONE
// backyard.addItem("coin", coin);
// backyard.addItem("black", blackChip);
// backyard.addItem("blue", blueChip);
// backyard.addItem("green", greenChip);
// backyard.addItem("red", redChip);
// backyard.addItem("white", whiteChip);
// gameEngine.send("n");
// gameEngine.send("e");
// gameEngine.send("e");
// gameEngine.send("n");
// gameEngine.send("nw");
// gameEngine.send("use black");
// gameEngine.send("use blue");
// gameEngine.send("use green");
// gameEngine.send("use red");
// gameEngine.send("use white");
// gameEngine.send("take coin");
// gameEngine.send("go through flap");
// END HACK ZONE

tagIt("start");

export default gameEngine;