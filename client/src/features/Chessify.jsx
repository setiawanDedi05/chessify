import { useState, useMemo, useCallback, useEffect } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import socket from "../utils/socket";
import MyDialog from "../components/MyDialog";

function Chessify({ players, room, orientation, cleanup }) {
  const chess = useMemo(() => new Chess(), []);
  const [fen, setFen] = useState(chess.fen());
  const [over, setOver] = useState("");

  const makeAMove = useCallback(
    (move) => {
      try {
        const result = chess.move(move); // update Chess instance
        setFen(chess.fen()); // update fen state to trigger a re-render

        console.log("over, checkmate", chess.isGameOver(), chess.isCheckmate());

        if (chess.isGameOver()) {
          // check if move led to "game over"
          if (chess.isCheckmate()) {
            // if reason for game over is a checkmate
            // Set message to checkmate.
            setOver(
              `Checkmate! ${chess.turn() === "w" ? "black" : "white"} wins!`
            );
            // The winner is determined by checking which side made the last move
          } else if (chess.isDraw()) {
            // if it is a draw
            setOver("Draw"); // set message to "Draw"
          } else {
            setOver("Game over");
          }
        }

        return result;
      } catch (e) {
        // null if the move was illegal, the move object if the move was legal
        return null;
      }
    },
    [chess]
  );

  function onDrop(sourceSquare, targetSquare) {
    // orientation is either 'white' or 'black'. game.turn() returns 'w' or 'b'
    if (chess.turn() !== orientation[0]) return false; // prohibit player from moving piece of other player

    if (players.length < 2) return false; // disallow a move if the opponent has not joined

    const moveData = {
      from: sourceSquare,
      to: targetSquare,
      color: chess.turn(),
      promotion: "q", // promote to queen where possible
    };

    const move = makeAMove(moveData);

    // illegal move
    if (move === null) return false;

    socket.emit("move", {
      move,
      room,
    }); // this event will be transmitted to the opponent via the server

    return true;
  }

  useEffect(() => {
    socket.on("move", (move) => {
      makeAMove(move); //
    });
  }, [makeAMove]);

  useEffect(() => {
    socket.on("playerDisconnected", (player) => {
      setOver(`${player.username} has disconnected`); // set game over
    });
  }, []);

  useEffect(() => {
    socket.on("closeRoom", ({ roomId }) => {
      if (roomId === room) {
        cleanup();
      }
    });
  }, [room, cleanup]);

  return (
    <div className="w-full h-[100vh] flex flex-col justify-center items-start pt-20 px-20">
      <div className="my-10">
        <h3 className="text-xl text-white">Room ID: {room}</h3>
      </div>
      <div className="grid grid-cols-[80%_20%] gap-5 w-full">
        <div className="w-full h-full flex-1">
          <Chessboard
            position={fen}
            onPieceDrop={onDrop}
            boardOrientation={orientation}
            customBoardStyle={{
              borderRadius: "4px",
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
            }}
            customDarkSquareStyle={{
              backgroundColor: "#779952",
            }}
            customLightSquareStyle={{
              backgroundColor: "#edeed1",
            }}
          />
        </div>
        {players.length > 0 && (
          <div className="bg-white rounded-md shadow-lg p-5 h-[150px]">
            <ul>
              <li className="text-slate-900 font-mono">Players</li>
              {players.map((p) => (
                <li key={p.id}>
                  <span>{p.username}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <MyDialog // Game Over CustomDialog
        open={Boolean(over)}
        title={over}
        contentText={over}
        handleContinue={() => {
          socket.emit("closeRoom", { roomId: room });
          cleanup();
        }}
      />
    </div>
  );
}

export default Chessify;
