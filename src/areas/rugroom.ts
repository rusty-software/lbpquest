import Location from '../engine/Location';
import Item from '../engine/Item';
import GameEngine from '../engine/GameEngine';
import { thievesTools } from './undecidedroom';

let mainText: string = "This bedroom was dubbed The Cowskin Rug Bedroom due to its floors being covered in cowskin rugs. An ottoman sits in front of a fireplace, oddly out of place. A bookcase is built into one wall, its books arranged by color -- white, black, red, and blue. ";
let deerHeadText: string = "There's a deer head statue sitting as an awkward decoration on a glass coffee table. ";
let exitText: string = "\n\nThe door to the east leads back to the hallway.";

function desc() {
    return mainText +
    deerHeadText + 
    exitText;
}

export const rugroom = new Location()
    .setId("Cowskin Rug Bedroom")
    .setDesc(desc());

let ottomanText: string = "Tie ottoman looks out of place, given there's no chair or couch near it. You wonder if it is meant to be used for something other than foot-resting... ";
let cushionDislodgeText: string = "";
let thumbStatueInsideText: string = "";
function ottomanDesc() {
    return ottomanText +
    cushionDislodgeText + 
    thumbStatueInsideText;
}
const ottoman = new Item()
    .setExamine(() => ottomanDesc())
    .setTakeable(false)
    .setTake(() => "As oddly out of place as it is, you think the ottoman should probably stay where it is.")
    .setUse(() => {
        rugroom.addItem("cushion", cushion);
        return "You try putting your feet on the ottoman, and notice that the top cushion seems loose."
    });

rugroom.addItem("ottoman", ottoman);

let cushionMoved = false;
function dislodgeCushion() {
    if (!cushionMoved) {
        cushionMoved = true;
        cushionDislodgeText = "The cushion atop the ottoman has been dislodged. ";
        thumbStatueInsideText = "There is a thumb statue inside the ottoman. ";
        rugroom.addItem("thumb statue", thumbStatue);
        return "Dislodging the cushion reveals a small storage compartment inside the ottoman. A familiar looking thumb statue is inside."
    }
    return "You've already dislodged the cushion.";
}
const cushion = new Item()
    .setExamine(() => {
        if (cushionMoved) {
            return "The cushion atop the ottoman has been dislodged. It looks really good this way."
        }
        return "The cushion atop the ottoman feels like it could be moved."
    })
    .setTakeable(false)
    .setTake(() => "As much fun as it would be to carry around the ottoman's cushion, you don't want to permanently tear the thing off.")
    .setUse(() => "You consider laying your head on the cushion, but as your nose gets closer to it, your reasoning brain slows you down, bringing you to a stop while still a safe distance away.")
    .on("move", () => dislodgeCushion())
    .on("dislodge", () => dislodgeCushion());

export const thumbStatue = new Item()
    .setExamine(() => "This is a small, decorative statue with the thumb up, Fonzie-style.")
    .setTake(() => {
        thumbStatueInsideText = "";
        return "You put the thumb statue in your rucksack."
    })
    .setTakeable(true);

export function wearCowskin(gameEngine: GameEngine, robe: Item) {
    if (!gameEngine.inventoryContains("cowskin")) {
        return "You have to take the cowskin before you can wear it.";
    }
    if (!gameEngine.inventoryContains("rope")) {
        return "You try to wear the cowskin, but it slips off of you. If only you had something with which to secure it...";
    }
    gameEngine.removeInventoryItem("rope");
    gameEngine.removeInventoryItem("cowskin");
    gameEngine.currentLocation.addItem("robe", robe);
    gameEngine.send("take robe");

    return "You fashion a robe out of the fine cowskin rug, using the rope to secure it.";
}
export const cowskin = new Item()
    .setExamine(() => "The cowskin is high quality, and looks to be just your size.")
    .setTakeable(true)
    .setTake(() => "You put the cowskin in your rucksack.")
    .setUse(() => "You're not exactly sure how to use the cowskin, except that it might look great if you were wearing it.");
rugroom.addItem("cowskin", cowskin);

export const ornateKey = new Item()
    .setExamine(() => "The key is fancy, with a fleur-de-lis as its bow and bitting that resembles a sunburst.")
    .setTakeable(true)
    .setTake(() => "You put the ornate key into your rucksack.");

export function breakDeerhead(gameEngine: GameEngine) {
    gameEngine.removeInventoryItem("deer head statue");
    deerHeadText = "";
    gameEngine.currentLocation.addItem("ornate key", ornateKey);

    return "You make short work of the deer head statue. It shatters into at least a gazillion pieces. An ornate key is among its remains.";
}
export const deerHead = new Item()
    .setExamine(() => "The deer head decoration looks quite hefty and potentially dangerous.")
    .setTakeable(true)
    .setTake(() => {
        deerHeadText = "";
        rugroom.setDesc(desc());
        return "You put the deerhead statue in your rucksack."
    })
    .setUse(() => {
        return "As you prepare to somehow use the deer head statue, you notice a tinkling sound coming from inside it.";
    })
    .on("hint", () => "Maybe try breaking the damn thing.");
rugroom.addItem("deer head statue", deerHead);

const thievery = new Item()
    .setExamine(() => "You know the ways of the thief!")
    .setTakeable(true)
    .setTake(() => "")
    .setUse(() => "You can't actively use the knowledge by itself. You probably need some tools of the trade.");
rugroom.addItem("thievery", thievery);

export function readBook(gameEngine: GameEngine) {
    if (gameEngine.inventoryContains("thievery")) {
        return "You've already gained the knowledge of thievery!";
    }

    gameEngine.send("take thievery");
    return "You thumb through `The Way of Thieves`, pausing on the section on how to use thieves tools.";
 }

export const book = new Item()
    .setExamine(() => "A well-worn blue book, titled `The Way of Thieves`.")
    .setTakeable(false)
    .setTake(() => "You wisely leave `The Way of Thieves` where it is. The irony of that action is not lost on you.");

const bookcase = new Item()
    .setExamine(() => {
        rugroom.addItem("book", book);
        return "The bookcase has a bunch of books on it, but only the blue book looks like it might be worth reading."
    })
    .setTakeable(false)
    .setTake(() => "The bookcase is built into the wall. You aren't going to be able to take it.");
rugroom.addItem("bookcase", bookcase);