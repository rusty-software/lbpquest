import Location from "../engine/Location";

let diningRoomText = "The dining room is dominated by a large glass dining table. A door to the north leads outside, and the kitchen is to your west."
// let diningRoomMafiaText = "The dining room is dominated by a large glass dining table. Seven people are sitting around the table, looking at you expectently. A door to the north leads outside, and the kitchen is to your west.";

const diningroom = new Location()
    .setId("Dining Room")
    .setDesc(diningRoomText);

export default diningroom;