import Location from '../engine/Location';
import Item from '../engine/Item';
import GameEngine from '../engine/GameEngine';

let mainText: string = "This bedroom was dubbed The Undecided Bedroom due to its wall art -- four prints stating 'Yes', 'No', 'Maybe', and 'OK'. "
let chestText: string = "There's a chest with a fancy lock set against the wall under the four prints. "
let exitText: string = "\n\nThe door to the north leads back to the hallway."

function desc() {
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
export function useOrnateKey(gameEngine: GameEngine) {
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
            return "You open the chest."
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

// TODO: bookcase