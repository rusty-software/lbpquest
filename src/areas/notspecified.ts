import Item from "../engine/Item";

export const robe = new Item()
    .setExamine(() => "The cowskin robe, cinched securely around your waist with the frayed rope, looks great and feels even better. It offers some protection from the elements.")
    .setTakeable(true)
    .setTake(() => "");

export const redChip = new Item()
    .setTakeable(true)
    .setTake(() => "");

export const blueChip = new Item()
    .setTakeable(true)
    .setTake(() => "");

export const greenChip = new Item()
    .setTakeable(true)
    .setTake(() => "");

export const whiteChip = new Item()
    .setTakeable(true)
    .setTake(() => "");
