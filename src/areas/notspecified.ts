import Item from "../engine/Item";

export const robe = new Item()
    .setExamine(() => "The cowskin robe, cinched securely around your waist with the frayed rope, looks great and feels even better. It offers some protection from the elements.")
    .setTakeable(true)
    .setTake(() => "");

export const snorkel = new Item()
    .setTakeable(true);