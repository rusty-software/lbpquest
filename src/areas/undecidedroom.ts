import Location from '../engine/Location';
import Item from '../engine/Item';
import GameEngine from '../engine/GameEngine';

let mainText: string = "This bedroom was dubbed The Undecided Bedroom due to its wall art -- four prints stating 'Yes', 'No', 'Maybe', and 'OK'. A bookcase is built into one wall, its books arranged by color -- black on the top shelves, and light blue on the middle. ";
let chestText: string = "There's a chest with a fancy lock set against the wall under the four prints. "
let exitText: string = "\n\nThe door to the north leads back to the hallway."

const desc = () => {
    return mainText +
    chestText + 
    exitText;
}
export const undecidedroom = new Location()
    .setId("Undecided Bedroom")
    .setDesc(desc());

let chestUnlocked: boolean = false;
let chestOpen: boolean = false;
let okayStatueTaken: boolean = false;
let closedText: string = "The chest is closed.";
let openWithStatue: string = "The chest is open. Its only interesting content is an oddly placed okay statue.";
let openSansStatue: string = "The chest is open. It doesn't contain anything interesting.";
export const useOrnateKey = (gameEngine: GameEngine) => {
    if (gameEngine.currentLocation !== undecidedroom) {
        return "You really don't have a use for that here.";
    }
    if (chestUnlocked) {
        return "You've already unlocked the chest using the ornate key!";
    }
    gameEngine.removeInventoryItem("ornate key");
    chestUnlocked = true;
    return "You use the ornate key to unlock the chest.";
}

const chest = new Item()
    .setExamine(() => {
        if (chestOpen && !okayStatueTaken) {
            return openWithStatue;
        } else if (chestOpen) {
            return openSansStatue;
        }
        return closedText;
    })
    .setTakeable(false)
    .setTake(() => "The chest is too large and heavy to take.")
    .setUse(() => "You don't really have a use for the chest, since your rucksack can hold anything you need.")
    .on("open", () => {
        if (chestUnlocked) {
            chestOpen = true;
            undecidedroom.addItem("okay statue", okayStatue);
            if (okayStatueTaken) {
                return "You open the chest. It is empty of interesting objects.";
            }
            return "You open the chest. A familiar looking okay statue is inside."
        }
        return "The chest is locked. Looks like it requires a key."
    })
    .on("close", () => {
        if (chestOpen) {
            chestOpen = false;
            return "You close the chest.";
        }
        return "The chest is already closed.";
    });
undecidedroom.addItem("chest", chest);

export const okayStatue = new Item()
    .setExamine(() => "This is a small, decorative statue with the pointer finger touching the thumb, gaze-style.")
    .setTake(() => "You put the okay statue into your rucksack.")
    .setTakeable(true);

export const pouch = new Item()
    .setExamine(() => "The leather pouch contains a collection of odd looking wiry implements. The nerd in you wonders if they are thieves tools.")
    .setTakeable(true)
    .setTake(() => "You add the pouch of thieves tools to your rucksack.");

export const thievesTools = new Item()
    .setExamine(() => "The leather pouch contains a collection of odd looking wiry implements. The nerd/rogue in you realizes that they are thieves tools.")
    .setTakeable(true)
    .setTake(() => "You add the pouch of thieves tools to your rucksack.");

let toolsTaken: boolean = false;
const readBook = () => {
    let text: string = "You open the book to read it, but discover that the pages have been hollowed out. ";
    if (!toolsTaken) {
        text += "A leather pouch sits inside the hollowed out area. The pouch appears to hold an old fashioned set of thieves tools.";
        undecidedroom.addItem("pouch", pouch);
        undecidedroom.addItem("thieves tools", thievesTools);
        toolsTaken = true;
    }

    return text; 
}

const book = new Item()
    .setExamine(() => "The blue book is laying on its side and is slightly larger than any of the other books in the bookcase.")
    .setUse(() => readBook())
    .on("read", () => readBook());

const bookcase = new Item()
    .setExamine(() => {
        undecidedroom.addItem("book", book);
        return "The bookcase has a bunch of books on it, but only the blue book looks like it might be worth reading."
    })
    .setTakeable(false)
    .setTake(() => "The bookcase is built into the wall. You aren't going to be able to take it.");

undecidedroom.addItem("bookcase", bookcase);