import Arena from "@colyseus/arena";
import { monitor } from "@colyseus/monitor";
import express from "express";
const path = require('path')

/**
 * Import your Room files
 */
import { MyRoom } from "./rooms/MyRoom";
import { ultimateRoom } from "./rooms/ultimateRoom";

export default Arena({
    getId: () => "Your Colyseus App",

    initializeGameServer: (gameServer) => {
        /**
         * Define your room handlers:
         */
        gameServer.define('ticTacToe', MyRoom);
        gameServer.define('ultimateTicTacToe', ultimateRoom);

    },

    initializeExpress: (app) => {
        /**
         * Bind your custom express routes here:
         */
        app.use(express.static(path.join(__dirname,'assets')))
        app.get("/", (req, res) => {
            res.sendFile(path.join(__dirname,'static/index.html'));
        });

        /**
         * Bind @colyseus/monitor
         * It is recommended to protect this route with a password.
         * Read more: https://docs.colyseus.io/tools/monitor/
         */
        app.use("/colyseus", monitor());
    },


    beforeListen: () => {
        /**
         * Before before gameServer.listen() is called.
         */
    }
});