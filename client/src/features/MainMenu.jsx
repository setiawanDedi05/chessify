import { useState } from "react";
import socket from "../utils/socket";
import MyDialog from "../components/MyDialog";
import MyTextInput from "../components/MyTextInput";
import MyButton from "../components/MyButton";

export default function MainMenu({
  setRoom,
  setOrientation,
  setPlayers,
}) {
  const [roomDialogOpen, setRoomDialogOpen] = useState(false);
  const [roomInput, setRoomInput] = useState("");

  return (
    <div className="flex justify-center items-center w-full h-[100vh] flex-col gap-10">
      <MyDialog
        open={roomDialogOpen}
        handleClose={() => setRoomDialogOpen(false)}
        title="Select Room to Join"
        contentText="Enter a valid room ID to join the room"
        handleContinue={() => {
          // join a room
          if (!roomInput) return; // if given room input is valid, do nothing.
          socket.emit("joinRoom", { roomId: roomInput }, (r) => {
            // r is the response from the server
            if (r.error) return //if some error do nothing
            console.log("response:", r);
            setRoom(r?.roomId); // set room to the room ID
            setPlayers(r?.players); // set players array to the array of players in the room
            setOrientation("black"); // set orientation as black
            setRoomDialogOpen(false); // close dialog
          });
        }}
      >
        <MyTextInput
          label="Room ID"
          name="room"
          value={roomInput}
          required
          handleChange={(e) => setRoomInput(e.target.value)}
          type="text"
        />
      </MyDialog>
      <MyButton
        handleClick={() => {
          socket.emit("createRoom", (r) => {
            console.log(r);
            setRoom(r);
            setOrientation("white");
          });
        }}
        label="Make a Room"
      />
      <MyButton
        handleClick={() => {
          setRoomDialogOpen(true);
        }}
        label="Join Room"
      />
    </div>
  );
}
