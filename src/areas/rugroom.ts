import Location from '../engine/Location';
import Item from '../engine/Item';
import GameEngine from '../engine/GameEngine';
import ItemKey from './itemenums';

let mainText: string = `This bedroom was dubbed The Cowskin Rug Bedroom due to its floors being covered in _${ItemKey.Cowskin}_s. An _${ItemKey.Ottoman}_ sits in front of a fireplace, oddly out of place. A _${ItemKey.RugroomBookcase}_ is built into one wall, its books arranged by color -- white, black, red, and blue. `;
let deerHeadText: string = `There's a _${ItemKey.DeerHeadStatue}_ sitting as an awkward decoration on a glass coffee table. `;
let exitText: string = "\n\nThe door to the east leads back to the hallway.";

const desc = () => {
    return mainText +
    deerHeadText + 
    exitText;
}

export const rugroom = new Location()
    .setId("Cowskin Rug Bedroom")
    .setDesc(desc());

let ottomanText: string = `The ottoman looks out of place, given there's no chair or couch near it. You wonder if it is meant to be used for something other than foot-resting... `;
let cushionDislodgeText: string = "";
let thumbStatueInsideText: string = "";
const ottomanDesc = () => {
    return ottomanText +
    cushionDislodgeText + 
    thumbStatueInsideText;
}
const ottoman = new Item()
    .setExamine(() => ottomanDesc())
    .setTakeable(false)
    .setTake(() => `As oddly out of place as it is, you think the ${ItemKey.Ottoman} should probably stay where it is.`)
    .setUse(() => {
        rugroom.addItem(ItemKey.Cushion, cushion);
        return `You try putting your feet on the ${ItemKey.Ottoman}, and notice that the top _${ItemKey.Cushion}_ seems loose.`
    });

rugroom.addItem(ItemKey.Ottoman, ottoman);

let cushionMoved = false;
const dislodgeCushion = () => {
    if (!cushionMoved) {
        cushionMoved = true;
        cushionDislodgeText = `The ${ItemKey.Cushion} atop the ${ItemKey.Ottoman} has been dislodged. `;
        thumbStatueInsideText = `There is a _${ItemKey.ThumbStatue}_ inside the ${ItemKey.Ottoman}. `;
        rugroom.addItem(ItemKey.ThumbStatue, thumbStatue);
        return `Dislodging the ${ItemKey.Cushion} reveals a small storage compartment inside the ottoman. A familiar looking _${ItemKey.ThumbStatue}_ is inside.`
    }
    return `You've already dislodged the ${ItemKey.Cushion}.`;
}
const cushion = new Item()
    .setExamine(() => {
        if (cushionMoved) {
            return `The ${ItemKey.Cushion} atop the ${ItemKey.Ottoman} has been dislodged. It looks really good this way.`
        }
        return `The ${ItemKey.Cushion} atop the ${ItemKey.Ottoman} feels like it could be moved.`
    })
    .setTakeable(false)
    .setTake(() => `As much fun as it would be to carry around the ${ItemKey.Ottoman}'s ${ItemKey.Cushion}, you don't want to permanently tear the thing off.`)
    .setUse(() => `You consider laying your head on the ${ItemKey.Cushion}, but as your nose gets closer to it, your reasoning brain slows you down, bringing you to a stop while still a safe distance away.`)
    .on("move", () => dislodgeCushion())
    .on("dislodge", () => dislodgeCushion());

export const thumbStatue = new Item()
    .setExamine(() => "This is a small, decorative statue with the thumb up, Fonzie-style.")
    .setTake(() => {
        thumbStatueInsideText = "";
        return "You put the thumb statue in your rucksack."
    })
    .setTakeable(true);

export const wearCowskin = (gameEngine: GameEngine, robe: Item) => {
    if (!gameEngine.inventoryContains(ItemKey.Cowskin)) {
        return `You have to take the _${ItemKey.Cowskin}_ before you can wear it.`;
    }
    if (!gameEngine.inventoryContains(ItemKey.Rope)) {
        return `You try to wear the ${ItemKey.Cowskin}, but it slips off of you. If only you had something with which to secure it...`;
    }
    gameEngine.removeInventoryItem(ItemKey.Rope);
    gameEngine.removeInventoryItem(ItemKey.Cowskin);
    gameEngine.currentLocation.addItem(ItemKey.Robe, robe);
    gameEngine.send(`take ${ItemKey.Robe}`);

    return `You fashion a ${ItemKey.Robe} out of the fine ${ItemKey.Cowskin}, using the ${ItemKey.Rope} to secure it.`;
}
export const cowskin = new Item()
    .setExamine(() => `The ${ItemKey.Cowskin} is high quality, and looks to be just your size.`)
    .setTakeable(true)
    .setTake(() => `You put the ${ItemKey.Cowskin} in your rucksack.`)
    .setUse(() => `You're not exactly sure how to use the ${ItemKey.Cowskin}, except that it might look great if you were wearing it.`);
rugroom.addItem(ItemKey.Cowskin, cowskin);

export const ornateKey = new Item()
    .setExamine(() => "The key is fancy, with a fleur-de-lis as its bow and bitting that resembles a sunburst.")
    .setTakeable(true)
    .setTake(() => "You put the ornate key into your rucksack.");

export const breakDeerhead = (gameEngine: GameEngine) => {
    gameEngine.removeInventoryItem(ItemKey.DeerHeadStatue);
    deerHeadText = "";
    rugroom.setDesc(desc());
    gameEngine.currentLocation.addItem(ItemKey.OrnateKey, ornateKey);

    return `You make short work of the deer head statue. It shatters into at least a gazillion pieces. An _${ItemKey.OrnateKey}_ is among its remains.`;
}
export const deerHead = new Item()
    .setExamine(() => "The deer head decoration looks quite hefty and potentially dangerous.")
    .setTakeable(true)
    .setTake(() => {
        deerHeadText = "";
        rugroom.setDesc(desc());
        return "You put the deerhead statue in your rucksack."
    })
    .setUse(() => {
        return "As you prepare to somehow use the deer head statue, you notice a tinkling sound coming from inside it.";
    })
    .on("shake", () => "You hear something rattling around inside. If only you could somehow get at it...")
    .on("open", () => "Open it? Really? Surely you can think of something more violent...")
    .on("hint", () => "Maybe try breaking the damn thing.");
rugroom.addItem(ItemKey.DeerHeadStatue, deerHead);

const thievery = new Item()
    .setExamine(() => "You know the ways of the thief!")
    .setTakeable(true)
    .setTake(() => "")
    .setUse(() => "You can't actively use the knowledge by itself. You probably need some tools of the trade.");
rugroom.addItem(ItemKey.Thievery, thievery);

export const readBook = (gameEngine: GameEngine) => {
    if (gameEngine.inventoryContains(ItemKey.Thievery)) {
        return "You've already gained the knowledge of thievery!";
    }

    gameEngine.send(`take ${ItemKey.Thievery}`);
    return "You thumb through `The Way of Thieves`, pausing on the section on how to use thieves tools.";
}

export const book = new Item()
    .setExamine(() => "A well-worn blue book, titled `The Way of Thieves`.")
    .setTakeable(false)
    .setTake(() => "You wisely leave `The Way of Thieves` where it is. The irony of that action is not lost on you.")
    .setUse(() => "\"Use\" the book...? What does one normally do with books?");

const bookcase = new Item()
    .setExamine(() => {
        rugroom.addItem(ItemKey.RugroomBook, book);
        return `The bookcase has a bunch of books on it, but only the _${ItemKey.RugroomBook}_ looks like it might be worth reading.`
    })
    .setTakeable(false)
    .setTake(() => "The bookcase is built into the wall. You aren't going to be able to take it.");
rugroom.addItem(ItemKey.RugroomBookcase, bookcase);