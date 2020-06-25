import Location from '../engine/Location'
import Item from '../engine/Item';
import GameEngine from '../engine/GameEngine';

function desc() {
    let mainText: string = "You are in the bar. All of the implements you need to make a mean marg are here... Well, almost... There's a vitamix, tequila, and triple sec... but no lime. ";
    let iceText: string = "You presume there's ice in the ice maker. "
    let exitText: string = "\n\nSouthwest leads back to the living room.";
    if (iceAvailable) {
        iceText = "Ice is available in the ice maker.";
    }

    return mainText
        + iceText
        + exitText;
}

export const bar = new Location()
    .setId("Bar")
    .setDesc(desc());

let tequilaPoured: boolean = false;
const tequila = new Item()
    .setExamine(() => "The tequila is of average quality, but there's LOTS of it.")
    .setTakeable(false)
    .setTake(() => "The tequila really shouldn't be moved out of the bar.")
    .setUse(() => {
        if (tequilaPoured) {
            return "You've already added the tequila.";
        }
        tequilaPoured = true;
        return "You pour the proper amount of tequila into the vitamix.";
    });
bar.addItem("tequila", tequila);

let triplesecPoured: boolean = false;
const triplesec = new Item()
    .setExamine(() => "The triple sec is of unknown quality, but there's LOTS of it.")
    .setTakeable(false)
    .setTake(() => "The unknown really shouldn't be moved out of the bar.")
    .setUse(() => {
        if (triplesecPoured) {
            return "You've already added the triple sec.";
        }
        triplesecPoured = true;
        return "You pour the proper amount of tequila into the vitamix.";
    });
bar.addItem("triple sec", triplesec);

let limeUsed: boolean = false;
export function useLime(gameEngine: GameEngine) {
    if (limeUsed) {
        return "You've already added the lime.";
    }

    gameEngine.removeInventoryItem("lime");
    return "You cut the lime, squeezing each wedge into the vitamix. Then you thrown the rinds in for good measure.";
}

let iceUsed: boolean = false;
const ice = new Item()
    .setUse(() => {
        iceUsed = true;
        return "You add the ice to the vitamix."
    });


const marg = new Item()
    .setTakeable(true)
    .setTake(() => {
        return "";
    });

    // TODO
export function useCup(gameEngine: GameEngine, cup: Item) {
    if (!margMade) {
        return "You don't have a use for the cup... yet...";
    }

}

let margMade: boolean = false;
const vitamix = new Item()
    .setUse(() => {
        if (tequilaPoured && triplesecPoured && limeUsed && iceUsed) {
            margMade = true;
            return "Flipping the switch"
        }
        return "The vitamix doesn't look like it's ready to be used.";
    })

let quote1Done: boolean = false;
let quote2Done: boolean = false;
let quote3Done: boolean = false;
let iceAvailable: boolean = false;
function doQuotes(prefix: string) {
    if (quote1Done && quote2Done && quote3Done) {
        iceAvailable = true;
        bar.setDesc(desc());

        return "The ice maker says, \"You've proven yourself worthy of ice!\" After some internal clicking, you realize the ice is available.";
    }
    if (!quote1Done) {
        return prefix + "\n\nWho will provide?";
    }
    if (!quote2Done) {
        return prefix + "\n\nWhat should I go home and play with?";
    }

    return prefix + "\n\nWhere will you never go as long as you stick with me?";
}

const rj = new Item() 
    .on("say", () => {
        quote1Done = true;
        return ""
    })

const icemaker = new Item()
    .setExamine(() => "")
    .setTakeable(false)
    .setTake(() => "The ice maker is built into the bar and can't be taken.")
    .setUse(() => doQuotes("The ice maker speaks! \"Answer my questions to get the ice!\" (start your response with \"say\")"));

// TODO: green poker chip