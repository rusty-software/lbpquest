import GameEngine from '../engine/GameEngine';
import Location from "../engine/Location";

// declarations
const courtyard = new Location();
const livingroom = new Location();

// locations
courtyard
    .setId("Courtyard")
    .setDesc("You are in the courtyard of Casa Cantera. You can almost feel the rosemary pollen coat your slightly sweating skin as you listen to the sounds of tepid water trickling through the slightly-functioning fountain. To the north is the door into the Casa.\n\nThere appears to be a note taped to the door.")
    .link("north", livingroom)
    .link("through door", livingroom);

livingroom
    .setId("Living Room")
    .setDesc("This is the living room.")
    .link("south", courtyard)
    .link("through door", courtyard);

const gameEngine = new GameEngine(courtyard);
gameEngine.setStartLocation(courtyard);

const startTime = new Date();
function timeDiffInSeconds(): number {
    return Math.floor((new Date().getTime() - startTime.getTime()) / 1000);
}

const gtag: (a: any, b:any, c:any) => void = (global as any).gtag;
const tagIt = (action: string) =>
    !!gtag && gtag('event', action, {
        event_category: 'game',
        event_label: new Date().toUTCString(),
        value: timeDiffInSeconds(),
    });
tagIt('start');

export default gameEngine;