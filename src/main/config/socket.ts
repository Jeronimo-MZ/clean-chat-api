import http from "http";
import { Server } from "socket.io";

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

export { expressApp, httpApp, io };
