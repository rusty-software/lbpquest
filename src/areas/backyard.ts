import Location from '../engine/Location';
import Item from '../engine/Item';
import GameEngine from '../engine/GameEngine';

let mainText: string = "The backyard has a large, jauntily decorated tent in it, the kind that would uncomfortably house all the LBPers for a poker game during a raging thunderstorm. ";
let flapText: string = "The front flap is closed, and appears to be blocked by a parking lot gate, the arm firmly down. ";
let exitText: string = "\n\nGoing southeast will take you to the east end of the pool, and southwest to the west end of the pool.";

function desc() {
    return mainText +
        flapText +
        exitText;
}

export const backyard = new Location()
    .setId("Backyard")
    .setDesc(desc());

let leftToFeed: number = 5;
export function feedMeter(gameEngine: GameEngine, pokerChip: Item, tent: Location) {
    if (gameEngine.currentLocation !== backyard) {
        return "You can't used the poker chip here.";
    }
    gameEngine.removeInventoryItem(pokerChip.name);
    leftToFeed--;
    if (leftToFeed === 0) {
        backyard.removeItem("gate");
        flapText = "The front flap is open, the parking gate's arm almost waving you inside. ";
        backyard.setDesc(desc());
        backyard.link("through flap", tent);
        return "As you place the fifth poker chip into the slot, the gate's arm slowly raises, granting you access to the tent via the flap.";
    }
    return "You put the poker chip into the meter.";
}

const gate = new Item()
    .setExamine(() => {
        let leftText: string = leftToFeed > 1 ? leftToFeed + " more chips" : "1 more chip";
        return "The parking lot gate is pretty standard, except that you can't manage to get around it, and its coin slot looks like it accepts poker chips. It also looks like it requires " + leftText + " before it will open." 
    })
    .setTakeable(false)
    .setTake(() => "You cannot take the parking gate. It just wouldn't be right.")
    .setUse(() => "In Soviet Russia, parking gate USE YOU!");

backyard.addItem("gate", gate);