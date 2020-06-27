import Location from '../engine/Location';
import Item from '../engine/Item';

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

let filledCoffee: boolean = false;
let presented: boolean = false;
let shreddedPaper: boolean = false;
let jobGameHead: string = "You find yourself in a virtual office environment -- a cube, to be precise. \n\n";
let coffeeText: string = "There's an empty coffee cup on the desk. ";
let computerText: string = "The computer screen displays a powerdot presentation. ";
let paperText: string = "A pile of papers with sensitive spreadsheet data sits next to the desk near the shredder. ";
const playJob = (actionHeader: string) => {
    if (attendedParty && whiteChipTaken) {
        return "You have already won the game of Job Simulator!";
    }
    if (filledCoffee && presented && shreddedPaper) {
        if (!attendedParty) {
            vr.addItem("party", party);
        }
        return jobGameHead +
            "You've done all the tasks! Time to attend your retirement party!";
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
vr.addItem("cup", cup);

const powerdot = new Item()
    .setExamine(() => {
        if (presented) {
            return "You shut down the computer as soon as it was finished.";
        }
        return "The presesentation looks like it's going to be spectacular!";
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
vr.addItem("powerdot", powerdot);

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
    .on("shred", () => {
        if (shreddedPaper && shreddedCount < 5) {
            shreddedCount++;
            return playJob("You tear all of the tiny pieces into even tinier pieces.");
        } else if (shreddedCount === 5) {
            return playJob("The pieces are now particulate matter. You can't grasp them any more, so the shredding is over.");
        }
        shreddedPaper = true;
        shreddedCount = 1;
        return playJob("You carefully feed all of the papers into the shredder. It gleefully converts them into tiny pieces.");
    });
vr.addItem("papers", papers);

let attendedParty: boolean = false;
let whiteChipTaken: boolean = false;
const party = new Item()
    .on("attend", () => {
        if (attendedParty && whiteChipTaken) {
            return "You have already won the game of Job Simulator!";
        }
        if (attendedParty && !whiteChipTaken) {
            return "The party is over, but the white poker chip remains."
        }
        attendedParty = true;
        vr.addItem("white chip", whiteChip);
        return "All of your virtual coworkers attend your party to send you off in style. Your virtual boss digs around in their virtual pocket and presents you with a token of their esteem for all your hard work.\n\nYou are presented with what looks like a white poker chip.";
    });

const jobGame = new Item()
    .on("play", () => playJob(""));
vr.addItem("job simulator", jobGame);

export const whiteChip = new Item()
    .setExamine(() => "The white poker chip looks far more real than it should, given it's supposedly virtual.")
    .setTakeable(true)
    .setTake(() => {
        whiteChipTaken = true;
        return "You inexplicably put the virtual white poker chip into your very real rucksack.";
    })