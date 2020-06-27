import Location from '../engine/Location';
import Item from '../engine/Item';

class Courtyard extends Location {
    public coin = new Item()
        .setExamine(() => "The coin is a currency you don't recognize, but appears to be made of a copper/nickel mix and is about the size of a half dollar.")
        .setTake(() => {
            this.fountain.setExamine(() => "The fountain gurgles sporatically.");
            return "You snatch the coin from the fountain bowl, drying it and your hands on your shirt, then put the coin into your rucksack.";
        })
        .setTakeable(true);

    private fountain = new Item()
        .setExamine(() => {
            this.addItem("coin", this.coin);
            return "The fountain gurgles sporatially, but the water is clear enough to make you aware of something glittering at the bottom of its bowl. It looks like a coin of some kind.";
        })
        .setTake(() => "The fountain is fixed in place, and even if you could move it, probably wouldn't fit in your rucksack.")
        .setUse(() => "You consider sipping from the fountain's lukewarm water, but think better of it, given what everyone else does in the pool...");

    private noteText: string = "(in a hastily/messily scrawled pen)"
    + "\n\nGreetings, fellow LBPer! The door's open. We're all in the tent out back. See you there!"
    + "\n\n(there is no signature)";

    private note = new Item()
        .setExamine(() => this.noteText)
        .setTake(() => "You realize that you should leave this here for anyone that arrives after you.")
        .setTakeable(false)
        .setUse(() => "You use the hell out of that note.")
        .on("read", () => this.noteText);

    public constructor(tagIt: (action: string) => void) {
        super();
        this.setId("Courtyard");
        this.setDesc("You are in the courtyard of Casa Cantera. You can almost feel the rosemary pollen coat your lightly sweating skin as you listen to the sounds of tepid water trickling through the barely-functioning _fountain_.\n\nTo the north is the door into the Casa. There appears to be a _note_ taped to it.");
        this.addItem("fountain", this.fountain);
        this.addItem("note", this.note);
        this.setOnEnter(() => tagIt("courtyard"));
    }
}

export default Courtyard;