import Item from "../engine/Item";

export const thumbStatue = new Item()
    .setExamine(() => "This is a small, decorative statue with the thumb up, Fonzie-style.")
    .setTake(() => "You put the thumb statue in your rucksack.")
    .setTakeable(true);

export const peaceStatue = new Item()
    .setExamine(() => "This is a small, decorative statue with two fingers up, peace-style.")
    .setTake(() => "You put the peace statue in your rucksack.")
    .setTakeable(true);

export const okayStatue = new Item()
    .setExamine(() => "This is a small, decorative statue with the pointer finger touching the thumb, gaze-style.")
    .setTake(() => "You put the okay statue in your rucksack.")
    .setTakeable(true);
