import Location from '../engine/Location';
import Item from '../engine/Item';

let vrText: string = "The living room is spacious, especially since all of the furniture has been pushed out of the way to make room for the VR setup, which looks pretty sweet/sweat. ";
let pornText: string = "You notice that the porn is prevalent here, the most appealing of which is an old copy of \"Bovine Boudoir\". ";
let bricabracText: string = "There are also baskets full of various and sundry decorative bric-a-brac littered on every flat surface. ";
let exitText = "\n\nTo the northeast is the bar, and the kitchen is to the east. To the west is a hallway leading to some bedrooms. The front door to the south leads to the courtyard.";

function getDesc() {
    return vrText +
        pornText +
        bricabracText +
        exitText;
}

const livingroom = new Location()
    .setId("Living Room")
    .setDesc(getDesc());

const porn = new Item()
    .setExamine(() => "\"Bovine Boudoir\", August 1999 edition. The cover is an extremely provocative picture of Bessie in profile.")
    .setTakeable(true)
    .setTake(() => {
        pornText = "You notice that the porn is prevalent here, but none of it appeals to you. ";
        livingroom.setDesc(getDesc());

        return "You put the porn in your rucksack."
    })
    .setUse(() => "TODO: logic to ensure proper usage")
    .on("read", () => "You thumb through the magazine, pausing on the most alluring of the pictures. Gertie got the centerfold, but your favorite is Henrietta.")

const deerHorn = new Item()
    .setExamine(() => "nice horn")
    .setTakeable(true)
    .setTake(() => {
        bricabrac.setExamine(() => "Most of the bric-a-brac is made up of animal bones, almost certainly from deer.")
        return "You put the deer horn into your rucksack."
    })
    .setUse(() => "TODO: logic to ensure proper usage");

const bricabrac = new Item()
    .setExamine(() => {
        livingroom.addItem("deer horn", deerHorn);
        return "Most of the bric-a-brac is made up of animal bones, almost certainly from deer. One deer horn in particular catches your eye. Maybe it's the way it sticks up straight... like a... uh... tree.";
    })
    .setTakeable(false)
    .setTake(() => "There's too much bric-a-brac to take all of it. You might focus on a single piece.")
    .setUse(() => "There's no real use for bric-a-brac, is there?");

livingroom.addItem("porn", porn);
livingroom.addItem("bric-a-brac", bricabrac);

/* 
vr
*/
export default livingroom;