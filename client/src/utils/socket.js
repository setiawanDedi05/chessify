import { io } from "socket.io-client";

const socket = io('localhost:9090'); // initialize websocket connection

export default socket;