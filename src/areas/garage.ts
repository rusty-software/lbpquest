import Location from '../engine/Location';
import GameEngine from '../engine/GameEngine';
import ItemKey from './itemenums';

let doorUnlocked: boolean = false;
const desc = () => {
    let text: string = "You are outside the garage. ";
    let lockedText: string = `The ${ItemKey.GarageDoor} is firmly closed and locked, preventing entry. `;
    let exitText: string = "\n\nThe pool is to your northwest. ";
    if (doorUnlocked) {
        lockedText = `The _${ItemKey.GarageDoor}_ was locked, but has recently been expertly unlocked without using a key. `;
        exitText += `You can also go through the garage _${ItemKey.GarageDoor}_ to see what's inside. `;
    }
    return text
        + lockedText
        + exitText;
}
export const garage = new Location()
    .setId("Garage")
    .setDesc(desc()); 

export const useTools = (gameEngine: GameEngine, linkInsideGarage: () => void) => {
    if (gameEngine.currentLocation !== garage) {
        return "It doesn't look like you can use that here.";
    }
    if (doorUnlocked) {
        return `You've already unlocked the ${ItemKey.GarageDoor}. You just need to go through it.`;
    }
    if (!gameEngine.inventoryContains(ItemKey.Thievery)) {
        return "You have no idea how to use thieves tools!";
    }
    doorUnlocked = true;
    linkInsideGarage();
    garage.setDesc(desc());
    return `Using your knowledge of thievery, you pick the lock to the garage using the thieves tools. The _${ItemKey.GarageDoor}_ is now open -- you just have to go through it.`;
}