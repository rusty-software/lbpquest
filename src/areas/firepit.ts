import Location from '../engine/Location';
import GameEngine from '../engine/GameEngine';
import Item from '../engine/Item';

let mainDesc = "The firepit is ringed by a series of pale yellow, plastic chairs, which seem to be slowly melting before the force of a much larger than expected and completely unattended open fire. "
let exitDesc = "\n\nA door to the south leads back inside the house, and the pool is to the east.";

function desc() {
    return mainDesc
        + exitDesc;
}

export const firepit = new Location()
    .setId("Firepit")
    .setDesc(desc());

function createRedChip(gameEngine: GameEngine) {
    gameEngine.removeInventoryItem("skewered earl");
    gameEngine.removeInventoryItem("robe");
    firepit.addItem("red chip", redChip);
    gameEngine.send("take red chip");
    return "With your cowskin robe protecting you, you extend the skewered earl to the flames. The fire greedily consumes the earl, turning it from a tender sanguine red to elongated coal brick in the blink of an eye. The flame progresses up what's left of the deer horn skewer and begins to burn your fashionable cowskin robe. In a panic, you tear the robe off, fumbling the skewer. Both skewer and robe fall to the ground burning as you leap backwards. A moment later, the flames have died down, and you notice that from the ashes of the earl you can see the edge of something small, round, and red. Brushing the ashes away, you pick up a red poker chip and put it into your rucksack before anything weirder has a chance to happen.";
}

export function usePit(gameEngine: GameEngine) {
    if (!gameEngine.inventoryContains("robe")) {
        return "As you approach the fire pit, the heat from the suddenly flaring flames starts to blister your skin. If only you had some protection..."
    }
    if (!gameEngine.inventoryContains("skewered earl")) {
        if (gameEngine.inventoryContains("earl") && !gameEngine.inventoryContains("horn")) {
            return "You realize your hand will cook before the earl is done. If only you had something with which to skewer the earl...";
        }
        if (gameEngine.inventoryContains("horn") && !gameEngine.inventoryContains("earl")) {
            return "It looks like you could use the deer horn as a skewer, if only you had something to put on it...";
        }
        return "You've got the earl, and you've got the deer horn. Maybe you should do something with those, now that you're at the firepit...?"
    }

    return createRedChip(gameEngine);
}

export const pit = new Item()
    .setExamine(() => "The firepit is roaring mightily. The flames are at least four feet high.");
firepit.addItem("pit", pit);

export const skeweredEarl = new Item()
    .setExamine(() => "The earl is skewered on the end of the deer horn. It would be perfect for eating, if only it were roasted.")
    .setTakeable(true)
    .setTake(() => "");

export const redChip = new Item()
    .setExamine(() => "The poker chip is red, with a small emblem of an earl on a horn in the middle, and feels slightly hot to the touch.")
    .setTakeable(true)
    .setTake(() => "");

export function roastSkeweredEarl(gameEngine: GameEngine) {
    if (gameEngine.currentLocation !== firepit) {
        return "There's nothing with which to roast the skewered earl properly here.";
    }
    if (!gameEngine.inventoryContains("robe")) {
        return "As you approach the fire pit, the heat from the suddenly flaring flames starts to blister your skin. If only you had some protection...";
    }

    return createRedChip(gameEngine);
}

export function useEarlAndHorn(gameEngine: GameEngine, tryItem: string) {
    if (gameEngine.inventoryContains("earl") && gameEngine.inventoryContains("horn")) {
        gameEngine.currentLocation.addItem("skewered earl", skeweredEarl);
        gameEngine.send("take skewered earl");
        gameEngine.removeInventoryItem("earl");
        gameEngine.removeInventoryItem("horn");
        return "You plunge the pointy end of the deer horn into the earl, priming the earl for roasting.";
    }

    if (tryItem === "horn" && !gameEngine.inventoryContains("earl")) {
        return "You wave the horn around like a magic wand.\n\nNothing happens.\n\nMaybe if you put something on it...?";
    }
    if (tryItem === "earl" && !gameEngine.inventoryContains("horn")) {
        return "You wave the earl around like a magic wand.\n\nNothinghappens.\n\nMaybe if you put it on something...?";
    }
    return "";
}