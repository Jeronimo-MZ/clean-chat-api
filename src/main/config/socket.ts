import http from "http";
import { Server } from "socket.io";

import { makeJoinAllRoomsHandler } from "../factories";
import { app as expressApp } from "./app";

const httpApp = new http.Server(expressApp);
const io = new Server(httpApp, {
    cors: {
        allowedHeaders: "*",
        origin: "*",
        credentials: false,
        methods: "*",
    },
});

io.on("connection", socket => {
    socket.on("join_rooms", data => makeJoinAllRoomsHandler().handle(socket, data));

    socket.on("disconnect", () => {
        socket.rooms.forEach(async room => await socket.leave(room));
    });
});
export { expressApp, httpApp, io };
