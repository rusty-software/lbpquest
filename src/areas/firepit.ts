import Location from '../engine/Location';
import GameEngine from '../engine/GameEngine';
import Item from '../engine/Item';
import ItemKey from './itemenums';

let mainDesc = `The _${ItemKey.Firepit}_ is ringed by a series of pale yellow, plastic chairs, which seem to be slowly melting before the force of a much larger than expected and completely unattended open fire. `
let exitDesc = "\n\nA door to the south leads back inside the house, and the pool is to the east.";

let chipCreated: boolean = false;
let chipTaken: boolean = false;
const desc = () => {
    let chipText: string = "";
    if (chipCreated && !chipTaken) {
        chipText = `There is a _${ItemKey.RedChip}_ here. `;
    }

    return mainDesc
        + chipText
        + exitDesc;
}

export const firepit = new Location()
    .setId("Firepit")
    .setDesc(desc());

const createRedChip = (gameEngine: GameEngine) => {
    gameEngine.removeInventoryItem(ItemKey.SkeweredEarl);
    gameEngine.removeInventoryItem(ItemKey.Robe);
    firepit.addItem(ItemKey.RedChip, redChip);
    chipCreated = true;
    firepit.setDesc(desc());

    return `With your cowskin robe protecting you, you extend the skewered earl to the flames. The fire greedily consumes the earl, turning it from a tender sanguine red to elongated coal brick in the blink of an eye. The flame progresses up what's left of the deer horn skewer and begins to burn your fashionable cowskin robe. In a panic, you tear the robe off, fumbling the skewer. Both skewer and robe fall to the ground burning as you leap backwards. A moment later, the flames have died down, and you notice that from the ashes of the earl you can see the edge of something small, round, and red. Brushing the ashes away, you realize that it is a _${ItemKey.RedChip}_.`;
}

export const usePit = (gameEngine: GameEngine) => {
    if (!gameEngine.inventoryContains(ItemKey.Robe)) {
        return "As you approach the fire pit, the heat from the suddenly flaring flames starts to blister your skin. If only you had some protection..."
    }
    if (!gameEngine.inventoryContains(ItemKey.SkeweredEarl)) {
        if (gameEngine.inventoryContains(ItemKey.Earl) && !gameEngine.inventoryContains(ItemKey.DeerHorn)) {
            return "You realize your hand will cook before the earl is done. If only you had something with which to skewer the earl...";
        }
        if (gameEngine.inventoryContains(ItemKey.DeerHorn) && !gameEngine.inventoryContains(ItemKey.Earl)) {
            return "It looks like you could use the deer horn as a skewer, if only you had something to put on it...";
        }
        return "You've got the earl, and you've got the deer horn. Maybe you should do something with those, now that you're at the firepit...?"
    }

    return createRedChip(gameEngine);
}

export const pit = new Item()
    .setExamine(() => "The firepit is roaring mightily. The flames are at least four feet high.");
firepit.addItem(ItemKey.Firepit, pit);

export const skeweredEarl = new Item()
    .setExamine(() => "The earl is skewered on the end of the deer horn. It would be perfect for eating, if only it were roasted.")
    .setTakeable(true)
    .setTake(() => "");

export const redChip = new Item()
    .setExamine(() => "The poker chip is red, with a small emblem of an earl on a horn in the middle, and feels slightly hot to the touch.")
    .setTakeable(true)
    .setTake(() => {
        chipTaken = true;
        firepit.setDesc(desc());
        return "You put the red poker chip into your rucksack."
    });

export const roastSkeweredEarl = (gameEngine: GameEngine) => {
    if (gameEngine.currentLocation !== firepit) {
        return "There's nothing with which to roast the skewered earl properly here.";
    }
    if (!gameEngine.inventoryContains(ItemKey.Robe)) {
        return "As you approach the fire pit, the heat from the suddenly flaring flames starts to blister your skin. If only you had some protection...";
    }

    return createRedChip(gameEngine);
}

export const useEarlAndHorn = (gameEngine: GameEngine, tryItem: string) => {
    if (gameEngine.inventoryContains(ItemKey.Earl) 
        && gameEngine.inventoryContains(ItemKey.DeerHorn)) {
        gameEngine.currentLocation.addItem(ItemKey.SkeweredEarl, skeweredEarl);
        gameEngine.send(`take ${ItemKey.SkeweredEarl}`);
        gameEngine.removeInventoryItem(ItemKey.Earl);
        gameEngine.removeInventoryItem(ItemKey.DeerHorn);
        return "You plunge the pointy end of the deer horn into the earl, priming the earl for roasting.";
    }

    if (tryItem === ItemKey.DeerHorn 
        && !gameEngine.inventoryContains(ItemKey.Earl)) {
        return "You wave the deer horn around like a magic wand.\n\nNothing happens.\n\nMaybe if you put something on it...?";
    }
    if (tryItem === ItemKey.Earl && !gameEngine.inventoryContains(ItemKey.DeerHorn)) {
        return "You wave the earl around like a magic wand.\n\nNothing happens.\n\nMaybe if you put it on something...?";
    }
    return "";
}