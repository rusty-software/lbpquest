import Location from '../engine/Location';
import Item from '../engine/Item';

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
        ottoman.setExamine(() => ottomanDesc());
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

let thumbStatueTaken: boolean = false;
export const thumbStatue = new Item()
    .setExamine(() => "This is a small, decorative statue with the thumb up, Fonzie-style.")
    .setTake(() => {
        thumbStatueTaken = true;
        thumbStatueInsideText = "";
        ottoman.setExamine(() => ottomanDesc());
        return "You put the thumb statue in your rucksack."
    })
    .setTakeable(true);


/*
rugs
deer head statue
bookcase
ottoman
*/
