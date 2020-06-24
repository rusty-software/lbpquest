import Location from '../engine/Location';

let mainText: string = "This bedroom was dubbed The Undecided Bedroom due to its wall art -- four prints stating 'Yes', 'No', 'Maybe', and 'OK'. "
let chestText: string = "There's a chest against the wall under the four prints. "
let exitText: string = "The door to the north leads back to the hallway."

function desc() {
    return mainText +
    chestText + 
    exitText;
}
const undecidedroom = new Location()
    .setId("Undecided Bedroom")
    .setDesc(desc());

let chestUnlocked: boolean = false;
let chestOpen: boolean = false;
let okayStatueTaken: boolean = false;
let closedText: string = "The chest is closed.";
let openWithStatue: string = "The chest is open. Its only interesting content is an oddly placed okay statue.";
let openSansStatue: string = "The chest is open. It doesn't contain anything interesting.";

/*
chest against wall
bookcase
*/

export default undecidedroom;