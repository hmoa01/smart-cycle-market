import { io } from "socket.io-client";
import { baseURL } from "../api/client";

const socket = io(baseURL, { path: "/socket-message", autoConnect: false });

export default socket;
