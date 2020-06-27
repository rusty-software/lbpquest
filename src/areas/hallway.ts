import Location from '../engine/Location';
import Item from '../engine/Item';
import GameEngine from '../engine/GameEngine';

let mainText = "The hallway is long and narrow. "
let firepitDoorText = "On the north wall, a door leads outside to the firepit. "
let ropeText = "A length of frayed _rope_ dangles unobtrusively from the firepit door handle. It looks like it might've been securing the door closed at some point. "
let otherExitsText = "There are also doors to the south and west that lead to bedrooms, and the living room is to the east. "

const desc = () => {
    return mainText +
    firepitDoorText +
    ropeText +
    otherExitsText;
}

export const hallway = new Location()
    .setId("Hallway")
    .setDesc(desc());

export const useRope = (gameEngine: GameEngine, robe: Item) => {
    if (gameEngine.inventoryContains("robe")) {
        return "You're already using the rope to keep the cowskin robe on."
    }
    if (!gameEngine.inventoryContains("rope")) {
        return "You have to take the rope before you can use it.";
    }
    if (!gameEngine.inventoryContains("cowskin")) {
        return "You tie the rope around your waist. It makes a pretty nice belt.";
    }
    gameEngine.removeInventoryItem("rope");
    gameEngine.removeInventoryItem("cowskin");
    gameEngine.currentLocation.addItem("robe", robe);
    gameEngine.send("take robe");

    return "Using the rope, you fashion a robe out of the fine cowskin.";
}

let ropeTaken: boolean = false;
export const rope = new Item()
    .setExamine(() => {
        let ropeDesc = "The rope is several feet long and, while frayed at the ends, is otherwise sturdy.";
        if (!ropeTaken) {
            return "The rope dangles from the door handle unobtrusively. " + ropeDesc;
        }
        return ropeDesc;
    })
    .setTakeable(true)
    .setTake(() => {
        ropeText = "";
        hallway.setDesc(desc());
        return "You put the rope into your rucksack."
    });
hallway.addItem("rope", rope);