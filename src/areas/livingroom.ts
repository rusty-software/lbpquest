import Location from '../engine/Location';
import Item from '../engine/Item';
import GameEngine from '../engine/GameEngine';
import { vr } from './vr';

let vrText: string = "The living room is spacious, especially since all of the furniture has been pushed out of the way to make room for the VR setup. The vr headset, in particular, looks pretty sweet/sweat. ";
let pornText: string = "You notice that the porn is prevalent here, the most appealing of which is an old copy of \"Bovine Boudoir\". ";
let bricabracText: string = "There are also baskets full of various and sundry decorative bric-a-brac littered on every flat surface. ";
let exitText = "\n\nTo the northeast is the bar, and the kitchen is to the east. To the west is a hallway leading to some bedrooms. The front door to the south leads to the courtyard.";

const desc = () => {
    return vrText +
        pornText +
        bricabracText +
        exitText;
}

export const livingroom = new Location()
    .setId("Living Room")
    .setDesc(desc());

export const porn = new Item()
    .setExamine(() => "\"Bovine Boudoir\", June 1999 edition. The cover is an extremely provocative picture of Bessie in profile.")
    .setTakeable(true)
    .setTake(() => {
        pornText = "You notice that the porn is prevalent here, but none of it appeals to you. ";
        livingroom.setDesc(desc());

        return "You put the porn in your rucksack."
    })
    .on("read", () => "You thumb through the magazine, pausing on the most alluring of the pictures. Gertie got the centerfold, but your favorite is Henrietta.")

export const horn = new Item()
    .setExamine(() => "It's a nice specimin, about a foot long, slightly curved, and very pointy.")
    .setTakeable(true)
    .setTake(() => {
        bricabrac.setExamine(() => "Most of the bric-a-brac is made up of animal bones, almost certainly from deer.")
        return "You put the deer horn into your rucksack."
    });

const bricabrac = new Item()
    .setExamine(() => {
        livingroom.addItem("horn", horn);
        return "Most of the bric-a-brac is made up of animal bones, almost certainly from deer. One deer horn in particular catches your eye. Maybe it's the way it sticks up straight... like a... uh... tree.";
    })
    .setTakeable(false)
    .setTake(() => "There's too much bric-a-brac to take all of it. You might focus on a single piece.")
    .setUse(() => "There's no real use for bric-a-brac, is there?");

let inVR: boolean = false;
export const useHeadset = (gameEngine: GameEngine, headset: Item, vr: Location) => {
    livingroom.link("vr", vr);
    inVR = true;
    vr.addItem("headset", headset);

    gameEngine.send("go vr");
    return "";
}

export const removeHeadset = (gameEngine: GameEngine, headset: Item) => {
    if (!inVR) {
        return "You aren't wearing the vr headset right now.";
    }
    vr.removeItem("headset");
    livingroom.unlink("vr");
    livingroom.addItem("headset", headset);
    vr.link("reality", livingroom);
    gameEngine.send("go reality");
    vr.unlink("reality");
    inVR = false;

    return "You have returned to non-virtual reality.";
}

export const headset = new Item()
    .setExamine(() => "The vr headset is slightly bulky, and smells (and feels) of stale sweat... the funk of 40,000 uses.")
    .setTakeable(false)
    .setTake(() => "Given that the vr headset will only work in the living room, you decide NOT to put it into your rucksack.")
    .on("remove", () => {
        if (!inVR) {
        }
        inVR = false;
        livingroom.unlink("vr");

        return "You remove the vr headset, returning you to non-virtual reality.";
    })

livingroom.addItem("porn", porn);
livingroom.addItem("bric-a-brac", bricabrac);
livingroom.addItem("headset", headset);