import Location from '../engine/Location';
import Item from '../engine/Item';
import GameEngine from '../engine/GameEngine';

let mainText: string = "This is the east end of the pool. It's slightly shallower than the west end, and sports a hot tub to the side as well. ";
let hottubText: string = "The hot tub is bubbling merrily, and there's a very thin haze of steam coming off its water's surface. ";
let keyText: string = "";
let exitText: string = "\n\nThe other end of the pool is to the west, and the bunkhouse is to the east. To the northwest lies the backyard which sports a jauntily decorated tent, and the garage is to the southeast. A door to the south leads back inside the house." ;

function desc() {
    return mainText +
    hottubText +
    keyText +
    exitText;
}

export const pooleast = new Location()
    .setId("Pool (East End)")
    .setDesc(desc());

export const cupboardKey = new Item()
    .setExamine(() => "The key is small and slightly tarnished, but sturdy enough to be used to open a lock of some kind.")
    .setTakeable(true)
    .setTake(() => {
        keyText = "";
        pooleast.setDesc(desc());
        return "You put the small key into your rucksack."
    });

export function useFish(gameEngine: GameEngine, fish: Item) {
    if (gameEngine.currentLocation === pooleast) {
        pooleast.addItem("small key", cupboardKey);
        gameEngine.removeInventoryItem("fish");
        hottubText = "The hot tub is bubbling merrily, and there's a very thin haze of steam coming off its water's surface. There's also a happy fish swimming around in it. "
        keyText = "A small key sits on the edge of the hot tub. "
        pooleast.setDesc(desc());
        return "You release the fish into the hot tub. It floats there a moment, then, much to your surprise, starts flapping its fins and wiggling its tail. It submerges for a moment, then comes back to the surface, making a gagging sound. A moment later, it regurgitates a small key onto the edge of the hottub. Apparently some fisherman of little means had used it as a lure in order to catch this fish. The fish stares at you a moment, then submerges again. You are sure that, had it possessed eyelids, it would have just winked at you."

    }
    return "This doesn't look like the right place to use the fish.";
}
