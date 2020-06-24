import GameEngine from '../engine/GameEngine';
import courtyard from './courtyard';
import livingroom from './livingroom';
import bar from './bar';
import hallway from './hallway'
import undecidedroom from './undecidedroom';
import {rugroom, thumbStatue, cowskin, wearCowskin} from './rugroom';
import firepit from './firepit';
import kitchen from './kitchen';
import {diningroom, placeThumb, placePeace, placeOkay} from './diningroom';
import {pooleast, useFish, cupboardKey} from './pooleast';
import poolwest from './poolwest';
import backyard from './backyard';
import tent from './tent';
import {bunkhouse, useCupboardKey, fish, peaceStatue} from './bunkhouse';
import garage from './garage';
import insidegarage from './insidegarage';
import {okayStatue, rope} from './notspecified';

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

thief book
    instructions on using thieves' tools

snacks

bar
    requires tequila, triple sec, lime, and ice

    making the marg reveals a green chip under the blender

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
    .link("through flap", tent)
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
fish
    .setUse(() => useFish(gameEngine, fish));

cupboardKey
    .setUse(() => useCupboardKey(gameEngine, cupboardKey));

cowskin
    .on("wear", () => wearCowskin(gameEngine));

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
courtyard.addItem("rope", rope);
gameEngine.send("take rope");
gameEngine.send("examine fountain");
gameEngine.send("take coin");
gameEngine.send("n");
gameEngine.send("w");
gameEngine.send("w");

// END HACK ZONE

export default gameEngine;