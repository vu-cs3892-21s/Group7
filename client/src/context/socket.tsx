import { io, Socket } from "socket.io-client";
import React, { Context } from "react";

export const socket: Socket = io("/");
export const SocketContext: Context<Socket> = React.createContext(socket);
