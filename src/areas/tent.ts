import Location from '../engine/Location';
import GameEngine from '../engine/GameEngine';

export const tent = new Location()
    .setId("Inside the Tent")
    .setDesc("\"There you are! Finally!\" everyone exclaims. \"Ready to play? Where's your buy in?\"" 
    + "\n\nYou can leave by way of the flap.");

export function useCoin(gameEngine: GameEngine) {
    if (gameEngine.currentLocation !== tent) {
        return "You can't find a use for the coin here.";
    }

    return "You use your coin to buy into the poker game."
        + "\n\nTime passes..."
        + "\n\nSome time just before the end of the weekend, having successfully looked at no one's cards, including your own, you become this year's tournament winner!"
        + "\n\nThe chief is yours! YOU HAVE WON ALL THE THINGS!"
        + "\n\nThus ends your LBPQuest. WELL DONE! See you next year!"
}