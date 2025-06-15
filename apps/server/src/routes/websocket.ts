import type { Server } from "bun";
import { nanoid } from "nanoid";
import { errorResponse } from "../utils/responses";
import type { WSData } from "../utils/websocket";

export const handleWebsocketUpgrade = (req: Request, server: Server) => {
    const url = new URL(req.url);
    const roomId = url.searchParams.get("roomId");
    const username = url.searchParams.get("username");

    if (!roomId || !username) {
        // for logging purposes
        const missingParams = [];
        if (!roomId) missingParams.push("roomId");
        if (!username) missingParams.push("username");
        console.error(`Websocket missing parameters: ${missingParams.join(", ")}`);
        return errorResponse("Invalid request", 400);
    }

    const clientId = nanoid();
    console.log(`User ${username} joined room ${roomId} with clientId ${clientId}`);

    const data: WSData = {
        roomId,
        clientId,
        username,
    };

    const upgraded = server.upgrade(req, {
        data,
    });

    if (!upgraded) {
        console.error(`Failed to upgrade websocket for user ${username} in room ${roomId}`);
        return errorResponse("Failed to upgrade websocket", 500);
    }

    return undefined;
};