import Location from '../engine/Location'
import Item from '../engine/Item';
import GameEngine from '../engine/GameEngine';
import ItemKey from './itemenums';

let iceAvailable: boolean = false;
const desc = () => {
    let mainText: string = `You are in the bar. All of the implements you need to make a mean marg are here... Well, almost... There's a _${ItemKey.Vitamix}_, _${ItemKey.Tequila}_, and _${ItemKey.TripleSec}_... but no lime. `;
    let iceText: string = `You presume there's ice in the _${ItemKey.IceMaker}_. `
    let exitText: string = "\n\nSouthwest leads back to the living room.";
    if (iceAvailable) {
        iceText = `There is some _${ItemKey.Ice}_ available in the ice maker.`;
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
bar.addItem(ItemKey.Tequila, tequila);

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
bar.addItem(ItemKey.TripleSec, triplesec);

let limeUsed: boolean = false;
export const useLime = (gameEngine: GameEngine) => {
    if (limeUsed) {
        return "You've already added the lime.";
    }

    limeUsed = true;
    gameEngine.removeInventoryItem(ItemKey.Lime);
    return "You cut the lime, squeezing each wedge into the vitamix. Then you thrown the rinds in for good measure.";
}

let iceUsed: boolean = false;
const ice = new Item()
    .setExamine(() => "Looks pretty cold, but not Sonic-style crunchy.")
    .setTakeable(false)
    .setTake(() => "Eh, it'll probably melt before you can get out of the bar area...")
    .setUse(() => {
        iceUsed = true;
        return "You add the ice to the vitamix."
    });

export const greenChip = new Item()
    .setExamine(() => "The green poker chip looks slightly sticky and smells of tequila.")
    .setTakeable(true)
    .setTake(() => {
        chipTaken = true;
        return "You put the green poker chip into your rucksack.";
    });

let sips: number = 0;
let chipTaken: boolean = false;
export const takeMarg = (gameEngine: GameEngine) => {
    if (!gameEngine.inventoryContains(ItemKey.Cup)) {
        gameEngine.removeInventoryItem(ItemKey.Marg);
        bar.addItem(ItemKey.Marg, marg);
        return "You don't have anything to pour the marg into!";
    }
    gameEngine.removeInventoryItem(ItemKey.Cup);
    return "You put the marg into your rucksack. You're sure it'll be fine.";
}

export const drinkMarg = (gameEngine: GameEngine) => {
    if (sips > 4) {
        if (!chipTaken) {
            gameEngine.currentLocation.addItem(ItemKey.GreenChip, greenChip);
            gameEngine.send(`take ${ItemKey.GreenChip}`);

            return `On taking this sip, something slides forward from the bottom of the cup. Looking inside, you see a green poker chip. You slide it into your rucksack.`;
        }

        return "You've taken the last sip of the marg. It was great while it lasted.";
    }
    sips++;
    switch (sips) {
        case 1: {
            return "You take a sip of the marg. It's pleasantly citrusy and intoxicating. There's still plenty left in the cup."
        }
        case 2: {
            return "You take a sip of the marg. It's pleazantly citrusey and intoxicating. There's a little less than plenty left in the cup."
        }
        case 3: {
            return "You take a sip of the marg. It's ploozantly citrusay and intoxicating. There's about half left in the cup."
        }
        case 4: {
            return "You take a sip of the marg. It's citroosly pleesant and intoxicating. There's less than half left in the cup."
        }
        case 5: {
            return "You take a sip of the marg. It's clitrantly ploosey and intoxicating. There's only a little left in the cup."
        }
    }
    return "";
}

export const marg = new Item()
    .setExamine(() => "This marg was brought to you by the vitamix.")
    .setTakeable(true);

let cupUsed: boolean = false;
export const useCup = (gameEngine: GameEngine) => {
    if (gameEngine.currentLocation !== bar) {
        return "You can't use the cup here.";
    }
    if (!margMade) {
        return "You don't have a use for the cup... yet...";
    }
    cupUsed = true
    gameEngine.send(`take ${ItemKey.Marg}`);

    return "You pour the _marg_ out of the vitamix and into your cup. It's ready for drinking!";
}

let margMade: boolean = false;
const vitamix = new Item()
    .setExamine(() => {
        if (margMade) {
            if (cupUsed) {
                return "The vitamix is empty, having been used to make a delicious _marg_.";
            }
            return "You've already made the _marg_! You should pour it into something from which to drink.";
        }
        if (!tequilaPoured && !triplesecPoured && !limeUsed && !iceUsed) {
            return "The vitamix is currently empty.";
        } else if (tequilaPoured && triplesecPoured && limeUsed && iceUsed && !margMade) {
            return "The vitamix looks full! Time to make the marg!";
        }
        let contents: string = "The vitamix currently contains:\n\n";
        if (tequilaPoured) { contents += "tequila\n"; }
        if (triplesecPoured) { contents += "triple sec\n"; }
        if (limeUsed) { contents += "lime\n"; }
        if (iceUsed) { contents += "ice\n"; }

        return contents;
    })
    .setTakeable(false)
    .setUse(() => {
        if (tequilaPoured && triplesecPoured && limeUsed && iceUsed && !margMade) {
            margMade = true;
            bar.addItem("marg", marg);
            return "Flipping the switch, the vitamix works its votexy magic and produces a lovely looking _marg_.";
        }
        return "The vitamix doesn't look like it's ready to be used.";
    });
bar.addItem("vitamix", vitamix);

let quote1Done: boolean = false;
let quote2Done: boolean = false;
let quote3Done: boolean = false;
const doQuotes = (prefix: string) => {
    if (quote1Done && quote2Done && quote3Done) {
        bar.addItem("ice", ice);
        iceAvailable = true;
        bar.setDesc(desc());

        return "The ice maker says, \"You've proven yourself worthy of ice!\" After some internal clicking, you realize the _ice_ is available.";
    }
    if (!quote1Done) {
        bar.addItem("rj", rj);
        return prefix + "\n\nWho will provide?";
    }
    if (!quote2Done) {
        bar.addItem("wooden dolly", woodenDolly);
        return prefix + "\n\nWhat should I go home and play with?";
    }

    bar.addItem("hungry", hungry);
    return prefix + "\n\nWhere will you never go as long as you stick with me?";
}

const rj = new Item()
    .on("say", () => {
        if (!quote1Done) {
            quote1Done = true;
            bar.removeItem("rj");
            return doQuotes("Correct! Next...");
        }
        return "";
    });

const woodenDolly = new Item()
    .on("say", () => {
        if (!quote2Done) {
            quote2Done = true;
            bar.removeItem("wooden dolly");
            return doQuotes("Correct! Next...");
        }
        return "";
    });

const hungry = new Item()
    .on("say", () => {
        if (!quote3Done) {
            quote3Done = true;
            bar.removeItem("hungry");
            return doQuotes("");
        }
        return "";
    })

const icemaker = new Item()
    .setExamine(() => "The ice maker hums quietly to itself.")
    .setTakeable(false)
    .setTake(() => "The ice maker is built into the bar and can't be taken.")
    .setUse(() => doQuotes("The ice maker speaks! \"Answer my questions to get the ice!\" (start your response with \"say\")"))
    .on("open", () => doQuotes("The ice maker speaks! \"Answer my questions to get the ice!\" (start your response with \"say\")"));
bar.addItem(ItemKey.IceMaker, icemaker);