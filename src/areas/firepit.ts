import Location from '../engine/Location';
import GameEngine from '../engine/GameEngine';
import Item from '../engine/Item';

export const firepit = new Location()
    .setId("Firepit")
    .setDesc("The firepit is ringed..." + 
    "\n\nA door to the south leads back inside the house, and the pool is to the east.");

export const skeweredEarl = new Item()
    .setExamine(() => "The earl is skewered on the end of the deer horn. It would be perfect for eating, if only it were roasted.")
    .setTakeable(true)
    .setTake(() => "");

export function roastSkeweredEarl(gameEngine: GameEngine) {
    if (gameEngine.currentLocation !== firepit) {
        return "There's nothing with which to roast the skewered earl properly here.";
    }
    if (!gameEngine.inventoryContains("robe")) {
        return "As you approach the fire pit, the heat from the suddenly flaring flames starts to blister your skin. If only you had some protection...";
    }
// TODO: red poker chip interaction
    return "TODO";
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