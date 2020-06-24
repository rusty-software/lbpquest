// TODO: add DROP
export class CommandType {
    public static values: CommandType[] = [];

    public static readonly N = new CommandType("N");
    public static readonly S = new CommandType("S");
    public static readonly E = new CommandType("E");
    public static readonly W = new CommandType("W");
    public static readonly NE = new CommandType("NE");
    public static readonly NW = new CommandType("NW");
    public static readonly SE = new CommandType("SE");
    public static readonly SW = new CommandType("SW");

    public static readonly GO = new CommandType("GO");
    public static readonly TAKE = new CommandType('TAKE');
    public static readonly INVENTORY = new CommandType('INVENTORY');
    public static readonly USE = new CommandType('USE');
    public static readonly LOOK = new CommandType('LOOK');
    public static readonly EXAMINE = new CommandType('EXAMINE');
    public static readonly HELP = new CommandType('HELP');

    private constructor(public readonly name: string) {
        CommandType.values.push(this);
    }
}