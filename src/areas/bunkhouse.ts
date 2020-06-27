import Location from '../engine/Location';
import Item from '../engine/Item';
import GameEngine from '../engine/GameEngine';

let mainText: string = "The bunkhouse is as warm and inviting as ever, with a special emphasis on 'warm.' ";
let cabinetText: string = "The well-worn _cupboard_ in the kitchenette looks like it's recently had some doors installed. ";
let fishText: string = "A poorly-taxidermied _fish_ adorns the wall. ";
let exitText: string = "\n\nThe pool is to your west."

const desc = () => {
    return mainText +
    cabinetText +
    fishText +
    exitText;
}

export const bunkhouse = new Location()
    .setId("Bunkhouse")
    .setDesc(desc());

export const fish = new Item()
    .setExamine(() => "The fish gapes at you, open-mouthed and glassy-eyed, as if it were still gasping for water.")
    .setTakeable(true)
    .setTake(() => {
        fishText = "";
        bunkhouse.setDesc(desc());
        return "You put the fish into your rucksack."
    });

let cupboardUnlocked: boolean = false;
let cupboardOpen: boolean = false;
let peaceStatueTaken: boolean = false;
let closedText: string = "The cupboard is closed.";
let openWithStatue: string = "The cupboard is open. Its only interesting content is an oddly placed _peace statue_.";
let openSansStatue: string = "The cupboard is open. It doesn't contain anything interesting.";

export const peaceStatue = new Item()
    .setExamine(() => "This is a small, decorative statue with two fingers up, peace-style.")
    .setTake(() => {
        peaceStatueTaken = true;
        return "You put the peace statue in your rucksack."
    })
    .setTakeable(true);

export const useCupboardKey = (gameEngine: GameEngine) => {
    if (gameEngine.currentLocation === bunkhouse) {
        cupboardUnlocked = true;
        gameEngine.removeInventoryItem("small key");
        return "You use the cupboard key to unlock the cupboard.";
    }
    return "This doesn't look like the right place to use the cupboard key.";
}

const cupboard = new Item()
    .setExamine(() => {
        if (cupboardOpen && !peaceStatueTaken) {
            return openWithStatue;
        } else if (cupboardOpen) {
            return openSansStatue;
        }
        return closedText;
    })
    .setTakeable(false)
    .setTake(() => "The cupboard is firmly attached to the wall, sorry.")
    .setUse(() => "You don't really have a use for the cupboard.")
    .on("open", () => {
        if (cupboardUnlocked) {
            cupboardOpen = true;
            bunkhouse.addItem("peace statue", peaceStatue);
            if (peaceStatueTaken) {
                return "You open the cupboard. Nothing interesting is inside.";
            }
            return "You open the cupboard. A familiar looking _peace statue_ is inside.";
        }
        return "The cupboard is locked. Looks like it requires a key."
    })
    .on("close", () => {
        if (cupboardOpen) {
            cupboardOpen = false;
            return "You close the cupboard.";
        }
        return "The cupboard is already closed.";
    });

bunkhouse.addItem("fish", fish);
bunkhouse.addItem("cupboard", cupboard);
