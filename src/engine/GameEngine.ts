import { CommandType } from './Command';
import {
    GameErrorEvent,
    GameEvent,
    HelpEvent,
    InventoryEvent,
    ItemEvent,
    LocationChangeEvent,
    NewInputEvent,
} from './Event';
import { GameError } from './GameError';
import Item from './Item';
import Location from './Location';

class GameEngine {
    public currentLocation: Location;
    public actionCount: number;

    private inventory: Map<string, Item>;
    private events: GameEvent[];

    constructor(location: Location) {
        this.currentLocation = location;
        this.events = [];
        this.inventory = new Map();
        this.actionCount = 0;
    }

    public setStartLocation(location: Location): GameEngine {
        this.changeLocation(location);
        return this;
    }

    public getEvents(): GameEvent[] {
        return this.events;
    }

    private move(direction: string) {
        const maybeNewLocation = this.currentLocation.locations.get(direction);
        if (maybeNewLocation) {
            if (!maybeNewLocation.entered) {
                maybeNewLocation.entered = true;
                maybeNewLocation.onEnter();
            }
            this.changeLocation(maybeNewLocation);
        } else {
            this.events.push(
                new GameErrorEvent(GameError.INVALID_PATH)
            );
        }
    }

    public send(input: string) {
        this.actionCount++;
        const lowerInput = input.toLowerCase().trim();
        const inputSplit = lowerInput.split(" ");
        const cmdText = inputSplit.shift();
        const cmd = CommandType.values.find(type =>
            cmdText === type.name.toLowerCase()
        );
        const rest = lowerInput.substr(!!cmd ? cmd.name.length + 1 : 0);

        this.events.push(new NewInputEvent(input));
        switch (cmd) {
            case CommandType.N:
            case CommandType.S: 
            case CommandType.E: 
            case CommandType.W: 
            case CommandType.NE: 
            case CommandType.NW: 
            case CommandType.SE: 
            case CommandType.SW: { 
                this.move(lowerInput);
                break;
            }

            case CommandType.GO: {
                this.move(rest);
                break;
            }

            case CommandType.TAKE: {
                const itemName = rest;
                const maybeItem = this.currentLocation.items.get(itemName);
                if (maybeItem) {
                    if (maybeItem.takeable) {
                        this.inventory.set(itemName, maybeItem);
                        this.currentLocation.removeItem(itemName);
                    }
                    this.events.push(new ItemEvent(maybeItem.take()));
                } else {
                    this.events.push(new GameErrorEvent(GameError.NO_ITEM));
                }
                break;
            }

            case CommandType.USE: {
                const maybeItem = this.getItem(rest);
                if (maybeItem) {
                    this.events.push(new ItemEvent(maybeItem.use()));
                } else {
                    this.events.push(new GameErrorEvent(GameError.NO_ITEM));
                }

                break;
            }

            case CommandType.EXAMINE: {
                const maybeItem = this.getItem(rest);
                if (maybeItem) {
                    this.events.push(new ItemEvent(maybeItem.examine()));
                } else {
                    this.events.push(new GameErrorEvent(GameError.NO_ITEM));
                }

                break;
            }

            case CommandType.LOOK: {
                this.changeLocation(this.currentLocation);
                break;
            }

            case CommandType.INVENTORY: {
                this.events.push(
                    new InventoryEvent(Array.from(this.inventory.keys()))
                );
                break;
            }

            case CommandType.HELP: {
                const commands = CommandType.values.map(type => type.name);
                this.events.push(new HelpEvent(commands));
                break;
            }

            default: {
                // figure out if there is a custom cmd instead
                const itemName = Array.from(this.currentLocation.items.keys())
                    .concat(Array.from(this.inventory.keys()))
                    .find(item => input.endsWith(item));

                const maybeItem = this.getItem(itemName);
                if (!!itemName && !!maybeItem) {
                    const maybeCustomCmd = lowerInput.substr(
                        0,
                        input.length - (itemName.length + 1)
                    );
                    const maybeFunc = maybeItem.customCommands.get(
                        maybeCustomCmd
                    );
                    if (maybeFunc) {
                        this.events.push(new ItemEvent(maybeFunc()));
                    } else {
                        this.events.push(
                            new GameErrorEvent(GameError.UNKNOWN_COMMAND)
                        );
                    }
                } else {
                    this.events.push(
                        new GameErrorEvent(GameError.UNKNOWN_COMMAND)
                    );
                }
                break;
            }
        }
    }

    public removeInventoryItem(itemName: string) {
        this.inventory.delete(itemName.toLowerCase());
    }

    public inventoryContains(itemName: string): boolean {
        return this.inventory.has(itemName);
    }

    private getItem(itemName: string | undefined): Item | undefined {
        if (!!itemName) {
            const locationItem = this.currentLocation.items.get(itemName);
            if (!locationItem) {
                return this.inventory.get(itemName);
            }
            return locationItem;
        } else {
            return undefined;
        }
    }

    private changeLocation(location: Location): GameEngine {
        this.currentLocation = location;
        this.events.push(
            new LocationChangeEvent(
                location.id,
                location.description
            )
        );
        return this;
    }
}

export default GameEngine;