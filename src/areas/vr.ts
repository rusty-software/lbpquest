import Location from '../engine/Location';
import Item from '../engine/Item';
import ItemKey from './itemenums';

let mainText: string = "You are in... VIRTUAL REALITY! \n\n";
let menuText: string = "You can play the following games:\n\nJob Simulator\n\nApparently the vr machine isn't very powerful this year. ";
let exitText: string = "\n\nTo leave VR, simply remove the vr headset."

const desc = () => {
    return mainText +
    menuText + 
    exitText;
}
export const vr = new Location()
    .setId("Virtual Reality")
    .setDesc(desc());

let playingJob: boolean = false;
let filledCoffee: boolean = false;
let presented: boolean = false;
let shreddedPaper: boolean = false;
let jobGameHead: string = "You find yourself in a virtual office environment -- a cube, to be precise. \n\n";
let coffeeText: string = `There's an empty _${ItemKey.CoffeeCup}_ on the desk. `;
let computerText: string = `The computer screen displays a _${ItemKey.Powerdot}_ presentation. `;
let paperText: string = `A pile of _${ItemKey.Papers}_ with sensitive spreadsheet data sits next to the desk near the shredder. `;
const playJob = (actionHeader: string) => {
    if (!playingJob) { return ""; }
    if (attendedParty && whiteChipTaken) {
        return "You have already won the game of Job Simulator!";
    }
    if (filledCoffee && presented && shreddedPaper) {
        if (!attendedParty) {
            vr.addItem(ItemKey.RetirementParty, party);
        }
        return jobGameHead +
            `You've done all the tasks! Time to attend your _${ItemKey.RetirementParty}_!`;
    }
    if (filledCoffee) {
        coffeeText = "There's a full cup of coffee on the desk. ";
    }
    if (presented) {
        computerText = "The computer screen is off, since you've finished the presentation. ";
    }
    if (shreddedPaper) {
        paperText = "The desk is clear of any sensitive debris. ";
    }
    return actionHeader +
        jobGameHead +
        coffeeText +
        computerText +
        paperText;
}

const fillCoffee = () => {
    if (filledCoffee) {
        return "You've already filled the coffee cup. Find something else to do.";
    }
    filledCoffee = true;
    return playJob("You fill the cup to the rim with virtual Brim!\n\n");
}
const cup = new Item()
    .setExamine(() => {
        if (filledCoffee) {
            return "It says \"I <heart> JOB\" on the side of the coffee cup. The cup is full of virtual coffee.";
        }
        return "It says \"I <heart> JOB\" on the side of the coffee cup. The cup is empty."
    })
    .setTakeable(false)
    .setTake(() => "You really don't need to take the coffee cup. It's VR, after all.")
    .setUse(() => fillCoffee())
    .on("fill", () => fillCoffee());
vr.addItem(ItemKey.CoffeeCup, cup);

const powerdot = new Item()
    .setExamine(() => {
        if (presented) {
            return "You shut down the computer as soon as it was finished. Please stop trying to create more work for yourself.";
        }
        return "The presesentation looks like it's going to be spectacular!";
    })
    .setUse(() => {
        if (presented) {
            return "You shut down the computer as soon as the presentation was finished. You're trying to *finish* work, not create more of it..."
        }
        return "The powerdot presentation is already perfect. You just need to present it!"
    })
    .setTakeable(false)
    .setTake(() => "Powerdot is an application on the computer. You have to present it, not take it.")
    .on("present", () => {
        if (presented) {
            return "No one is around for whom to perform the presentation.";
        }
        presented = true;
        return playJob("You present the Powerdot. It goes so well that you think you're in line for a promotion!\n\n");
    });
vr.addItem(ItemKey.Powerdot, powerdot);

let shreddedCount: number = 0;
const papers = new Item()
    .setExamine(() => {
        if (shreddedPaper) {
            return "The papers are nothing but a pile of confetti at this point.";
        }
        return "The papers are spreadsheet printouts containing all of the financial data from the virtual company!";
    })
    .setTakeable(false)
    .setTake(() => "Those papers are too sensitive to take.")
    .setUse(() => {
        if (shreddedPaper && shreddedCount < 5) {
            return "You create small piles of virtual confetti. Given there's nothing to celebrate, that's the end of the story for them.";
        } else if (shreddedCount === 5) {
            return "You cannot use particulate matter, especially the virtual kind.";
        }
        return "You use one of the papers to make a virtual paper airplane. You throw it, and it falls straight to the virtual ground... next to the shredder. (hint hint)";
    })
    .on("shred", () => {
        if (shreddedPaper && shreddedCount < 5) {
            shreddedCount++;
            return playJob("You tear all of the tiny pieces into even tinier pieces.\n\n");
        } else if (shreddedCount === 5) {
            return playJob("The pieces are now particulate matter. You can't grasp them any more, so the shredding is over.\n\n");
        }
        shreddedPaper = true;
        shreddedCount = 1;
        return playJob("You carefully feed all of the papers into the shredder. It gleefully converts them into tiny pieces.\n\n");
    });
vr.addItem(ItemKey.Papers, papers);

let attendedParty: boolean = false;
let whiteChipTaken: boolean = false;
const party = new Item()
    .on("attend", () => {
        if (attendedParty && whiteChipTaken) {
            return "You have already won the game of Job Simulator!";
        }
        if (attendedParty && !whiteChipTaken) {
            return `The party is over, but the _${ItemKey.WhiteChip}_ remains.`
        }
        attendedParty = true;
        vr.addItem(ItemKey.WhiteChip, whiteChip);
        return `All of your virtual coworkers attend your party to send you off in style. Your virtual boss digs around in their virtual pocket and presents you with a token of their esteem for all your hard work.\n\nYou are presented with what looks like a _${ItemKey.WhiteChip}_.`;
    });

const jobGame = new Item()
    .on("play", () => {
        playingJob = true;
        return playJob("");
    });
vr.addItem("job simulator", jobGame);

export const whiteChip = new Item()
    .setExamine(() => "The white poker chip looks far more real than it should, given it's supposedly virtual.")
    .setTakeable(true)
    .setTake(() => {
        whiteChipTaken = true;
        return "You inexplicably put the virtual white poker chip into your very real rucksack.";
    })