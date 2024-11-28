import { useEffect, useState, useCallback } from "react";
import socket from "./utils/socket";
import MyDialog from "./components/MyDialog";
import MyTextInput from "./components/MyTextInput";
import MainMenu from "./features/MainMenu";
import Chessify from "./features/Chessify";

export default function App() {
  const [username, setUsername] = useState("");
  const [usernameSubmitted, setUsernameSubmitted] = useState(false);

  const [room, setRoom] = useState("");
  const [orientation, setOrientation] = useState("");
  const [players, setPlayers] = useState([]);

  // resets the states responsible for initializing a game
  const cleanup = useCallback(() => {
    setRoom("");
    setOrientation("");
    setPlayers("");
  }, []);

  useEffect(() => {
    socket.on("opponentJoined", (roomData) => {
      console.log("roomData", roomData);
      setPlayers(roomData.players);
    });
  }, []);

  return (
    <div className="w-full h-full bg-slate-900">
      <h2 className="text-white absolute top-10 left-10 text-3xl">
        Hi, <span className="font-bold">{username} !</span>
      </h2>
      <h1 className="absolute top-24 left-10 text-white text-center text-5xl font-bold">
        Chessify
      </h1>
      <MyDialog
        open={!usernameSubmitted}
        handleClose={() => setUsernameSubmitted(true)}
        title="Enter username"
        contentText="Please type a username"
        handleContinue={() => {
          if (!username) return;
          socket.emit("username", username);
          setUsernameSubmitted(true);
        }}
      >
        <MyTextInput
          name="username"
          value={username}
          required
          handleChange={(e) => setUsername(e.target.value)}
          type="text"
        />
      </MyDialog>
      {room ? (
        <Chessify
          room={room}
          orientation={orientation}
          username={username}
          players={players}
          // the cleanup function will be used by Game to reset the state when a game is over
          cleanup={cleanup}
        />
      ) : (
        <MainMenu
          username={username}
          setRoom={setRoom}
          setOrientation={setOrientation}
          setPlayers={setPlayers}
        />
      )}
    </div>
  );
}
