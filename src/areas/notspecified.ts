import Item from "../engine/Item";

export const okayStatue = new Item()
    .setExamine(() => "This is a small, decorative statue with the pointer finger touching the thumb, gaze-style.")
    .setTake(() => "You put the okay statue in your rucksack.")
    .setTakeable(true);
