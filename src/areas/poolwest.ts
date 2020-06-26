import Location from '../engine/Location';
import Item from '../engine/Item';
import GameEngine from '../engine/GameEngine';

function desc() {
    let mainText: string = "This is the west side of the pool. It's slightly deeper than the east side. "
    let exitText: string = "\n\nThe other end of the pool is to your east, and the firepit is to the west. Going northeast will take you into the backyard, where there's a jauntily decorated tent.";
    return mainText
        + exitText;
}

export const poolwest = new Location()
    .setId("Pool (West End)")
    .setDesc(desc());

let blueChipTaken = false;
export const pool = new Item()
    .setExamine(() => {
        let text: string = "The water looks clean. Clean-ish. It's hard to tell how many people have already peed in it, honestly. ";
        if (!blueChipTaken) {
            text += "You can barely make out a slightly darker blue thing sitting on the bottom of the pool, but you really can't see what it is.";
        }
        return text;
    });
poolwest.addItem("pool", pool);

export function usePool(gameEngine: GameEngine) {
    if (gameEngine.currentLocation !== poolwest) {
        return "There's no real use for that here.";
    }
    if (!gameEngine.inventoryContains("snorkel")) {
        return "Without some kind of protective gear, you would last two seconds in that pool.";
    }
    if (blueChipTaken) {
        return "You swim around for a few minutes, basking in the protection the snorkel provides you.";
    }
    poolwest.addItem("blue chip", blueChip);
    return "You jump into the pool, the snorkel providing you with protection from whatever substances might be in the water. Through the snorkel, you can now see that the thing on the bottom of the pool is a blue poker chip.";
}

export const blueChip = new Item()
    .setExamine(() => "The blue poker chip is in good, if wet, condition.")
    .setTakeable(true)
    .setTake(() => {
        blueChipTaken = true;
        return "You put the blue poker chip into your obviously waterproof rucksack."
    });
