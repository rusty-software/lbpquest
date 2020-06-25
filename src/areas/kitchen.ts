import Location from '../engine/Location';
import Item from '../engine/Item';
import GameEngine from '../engine/GameEngine';

let mainText: string = "The kitchen is exactly as you left it from the last LBP -- a riot of HEB loot. At least there are no ants! ";
let exitText: string = "\n\nTo the east is the dining room, and to the west is the living room.";

let snacksTaken: boolean = false;
let cupTaken: boolean = false;
let limeTaken: boolean = false;
let artsApplied: boolean = false;
function desc() {
    let counterText: string = "The counter is, simply put, a treasure trove. ";
    if (snacksTaken && cupTaken && limeTaken) {
        counterText = "The counter is a mess, but you don't feel inspired either to pick over it or clean it. ";
    } else {
        if (!snacksTaken) {
            counterText += "All of your favorite snacks are here. ";
        }
        if (!cupTaken) {
            counterText += "You manage to locate at least a single clean cup. "
        }
        if (!limeTaken) {
            counterText += "While the bananas are already gone, there's at least one lime left. ";
        }
    }

    let fridgeText: string = "The fridge is covered in arts and crafts, although there is a blank space left. "
    if (artsApplied) {
        fridgeText = "The fridge is covered in arts and crafts, including your questionable contribution. "
    }
    return mainText  
        + fridgeText 
        + counterText
        + exitText;
}

export const kitchen = new Location()
    .setId("Kitchen")
    .setDesc(desc()); 

const snacks = new Item()
    .setExamine(() => "The <YOUR FAVORITE SNACKS> look SO good... It's been a year since you've had them, after all.")
    .setTakeable(true)
    .setTake(() => {
        snacksTaken = true;
        kitchen.setDesc(desc());
        return "You put the snacks into your rucksack."
    });
kitchen.addItem("snacks", snacks);
// TODO: use snacks?

const cup = new Item()
    .setExamine(() => "The cup looks simply perfect for holding a margarita.")
    .setTakeable(true)
    .setTake(() => {
        cupTaken = true;
        kitchen.setDesc(desc());
        return "You put the cup into your rucksack."
    });
kitchen.addItem("cup", cup);
// TODO: use cup?

const lime = new Item()
    .setExamine(() => "The lime looks simply perfect for squeezing into a margarita.")
    .setTakeable(true)
    .setTake(() => {
        limeTaken = true;
        kitchen.setDesc(desc());
        return "You put the lime into your rucksack."
    });
kitchen.addItem("lime", lime);
// TODO: use lime 

export function usePorn(gameEngine: GameEngine) {
    if (gameEngine.currentLocation === kitchen) {
        artsApplied = true;
        kitchen.setDesc(desc());
        gameEngine.removeInventoryItem("porn");
        return "After inspecting the offerings already on the fridge, you attach your copy of \"Bovine Boudoir\" to the door using the ladybug magnet clip. You swear you hear the fridge sigh as you feel the door loosen.";
    }
    return "You can't find a use for the porn here.";
}

let earlTaken: boolean = false;
const earl = new Item()
    .setExamine(() => "The earl looks delicious, but it should probably be cooked before you eat it.")
    .setTakeable(true)
    .setTake(() => {
        if (artsApplied) {
            earlTaken = true;
            return "You put the earl into your rucksack.";
        }
        return "";
    });

const fridge = new Item()
    .setExamine(() => {
        let fridgeDesc: string = "The fridge seems to be holding up alright under the strain of the LBP groceries and arts and crafts. ";
        if (artsApplied && !earlTaken) {
            fridgeDesc += "There is an earl inside.";
        }
        return fridgeDesc;
    })
    .on("open", () => {
        let fridgeContents: string = "Opening the fridge, you see a LOT of things better left untouched. "
        if (artsApplied) {
            if (earlTaken) {
                return fridgeContents;
            }
            kitchen.addItem("earl", earl);
            return fridgeContents + "The exception is an earl. You want that earl. You NEED that earl!";
        }
        return "You try to open the fridge, but the door won't budge. If only there was something on it to give it a little extra weight. Or decor.";
    });
kitchen.addItem("fridge", fridge);

/*
// TODO: earls? snacks? arts and crafts supplies/tools?
*/

