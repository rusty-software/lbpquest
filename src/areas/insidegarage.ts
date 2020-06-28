import Location from '../engine/Location';
import Item from '../engine/Item';
import ItemKey from './itemenums';

export const insidegarage = new Location()
    .setId("Inside the Garage")
    .setDesc(`You are inside the garage. The space is littered with the trappings of tools of a lawn long neglected. You notice a _${ItemKey.Kayak}_ perched precariously atop a broken down ATV.` 
    + "\n\nThe only exit is back through the door.");

let snorkelTaken: boolean = false;
export const snorkel = new Item()
    .setExamine(() => "The snorkel has a fully intact face mask, although the breathing tube looks questionable.")
    .setTakeable(true)
    .setTake(() => {
        snorkelTaken = true;
        return "You put the snorkel into your rucksack."
    });
insidegarage.addItem(ItemKey.Snorkel, snorkel);

const kayak = new Item()
    .setExamine(() => {
        let text: string = "The kayak is sunflare orange and might even stay afloat in water.";
        if (!snorkelTaken) {
            text += `There appears to be a _${ItemKey.Snorkel}_ stuffed into the kayak's seat.`;
        }
        return text; 
    })
    .setTakeable(false)
    .setTake(() => "You heave a bit, but quickly realize that getting the kayak is a two-person job.")
    .setUse(() => "There are no rivers in this game, and we all know that the pool is no place for a kayak.");
insidegarage.addItem(ItemKey.Kayak, kayak);