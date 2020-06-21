import * as React from 'react';
import Game from "../../Game";
import AsciiImage from "../AsciiImage";
import Logo from "./logo";

function GameIntroView() {
    return <div className="game-intro">
        <AsciiImage className={"intro"} imageSrc={Logo} alt={"LBPQuest Logo"}/>
        <h1 className="sr-only">LBPQuest</h1>
        <h2 className="game-intro-subtitle">A Quest for LBP XXI</h2>
        <h3 className="game-intro-enter"
            role="text"
            aria-label="Press enter to play the game ">
            > Press enter to play the game </h3>
        <h3 className="game-intro-credits">Made by: IronFury </h3>
    </div>;
}

interface GameIntroState {
    gameStarted: boolean
}

class GameIntro extends React.Component<any, GameIntroState> {
    constructor(props: any) {
        super(props);
        this.state = {
            gameStarted: false,
        };
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleTouch = this.handleTouch.bind(this);
    }

    public componentDidMount() {
        document.addEventListener("keydown", this.handleKeyDown, false);
        document.addEventListener("touchstart", this.handleTouch, false);
    }

    public handleKeyDown(event: KeyboardEvent) {
        if (event.key === 'Enter') {
            this.setState({gameStarted: true})
        }
    }

    public handleTouch(event: TouchEvent) {
        this.setState({gameStarted: true})
    }

    public render() {
        return (
            <div id="game">
                {
                    this.state.gameStarted ? <Game/> : <GameIntroView/>
                }
            </div>
        );
    }
}

export default GameIntro;