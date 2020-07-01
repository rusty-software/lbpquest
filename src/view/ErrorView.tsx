import * as React from 'react';
import { GameError } from '../engine/GameError';
import Text from './TextView';

interface ErrorViewProps {
    error: GameError;
}

const unknowns: string[] = [
    "Uh, I'm not quite sure what you're trying to do..."
    , "Is that even legal in this state?"
    , "Please try to take your quest a little more seriously."
    , "Why do I even bother to prompt you?"
    , "<narrator>It turned out that the input was unparseable. At all.</narrator>"
    , "Nope, no idea what that means."
    , "STOP LOOKING AT MY CARDS!"
    , "Oh, is it time to start Rounders? Enter relevant words."
    , "Exasperation. The look on my face is... exasperation. Do things better."
    , "Perhaps you should try rephrasing that input..."
    , "No, seriously -- type in things that are likely to work."
    , "I'm sure I could figure out what you intended... eventually. In the meantime:"
    , "Yes, this is a random response to irrelevant input. Please type something else."
    , "Sorry, I was distracted with... something. Other input, please."
    , "In this game, we have to use our words. Or type them. And they should (sort of) make sense."
    , "Aw, that's sweet! I love it! But I still need you to type things that will move us forward. Together."
    , "That's a Man Down kind-of statement if I've ever heard one!"
    , "I can't go for that. No, no... No can do."
    , "Sorry, was that you typing, or the drum machine/Garner laughing? Other words, please."
    , "Run away! RUN AWAY! Or type something meaningful."
];

function errorMessage(error: GameError): string {
    switch (error) {
        case GameError.INVALID_PATH:
            return "There is no path there.";
        case GameError.UNKNOWN_COMMAND:
            return unknowns[Math.floor(Math.random() * unknowns.length)]
            + "\n\nFor a list of common commands, type HELP.";
        case GameError.NO_ITEM:
            return "Invalid command. There is no item there.";
    }
}

function ErrorView(props: ErrorViewProps) {
    return (
        <div className="error">
            <Text text={errorMessage(props.error)} />
        </div>
    );
}

export default ErrorView;
