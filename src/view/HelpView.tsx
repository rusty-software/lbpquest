import * as React from 'react';

const helpMapper: { [s: string]: string; } = {
    GO: ' <SOMEWHERE> : e.g. `go through door` to move somewhere other than cardinal or ordinal directions',
    HELP: ' : shows this help text',
    INVENTORY: ' : lists the items in your rucksack',
    EXAMINE: ' <OBJECT> : e.g. `examine sword` to take a closer look at the sword',
    LOOK: ' : describes the area which you are currently in',
    TAKE: ' <OBJECT> : e.g. `take sword` to add an item to your rucksack',
    USE: ' <OBJECT> : e.g. `use sword` to activate an item'
};

interface HelpViewProps {
    visibleCommand: string[];
}

function HelpView(props: HelpViewProps) {
    const helpBlock = props.visibleCommand.map(command => (
        <div key={command} className="command-block">
            <div className="command-block-key">{command}</div>
            <div className="command-block-tip">{helpMapper[command]}</div>
        </div>
    ));

    return (
        <div className="help">
            <div className="help-description">
                These are the default commands and will be most used:
            </div>
            <br />
            {helpBlock}
            <br />
            <div className="help-description">
                But there may be more hidden commands available. Use "logic" to figure it out!
                <br/>
                <br/>
                Also, words surrounded by "_" are typically interactable somehow. There, I've pretty much given away the entire game. You're welcome.
            </div>
        </div>
    );
}

export default HelpView;