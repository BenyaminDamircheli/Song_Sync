import type { WSBroadcastType, WSUnicastType } from "@songsync/shared";
import type { Server, WebSocket } from "bun";
import type { WSData } from "./websocket";

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "*",
  "Access-Control-Allow-Headers": "*",
};

// HELPER FUNCTIONS FOR COMMON RESPONSES
/**
 * Send a JSON response
 * @param data - The data to send
 * @param status - The status code
 * @returns void
 */
export const jsonResponse = (data: any, status = 200) => {
  return new Response(JSON.stringify(data), {
    status,
    headers: corsHeaders,
  });
};

/**
 * Send an error response
 * @param message - The error message
 * @param status - The status code
 * @returns void
 */
export const errorResponse = (message: string, status = 500) => {
  return new Response(message, {
    status,
    headers: corsHeaders,
  });
};

/**
 * Send a broadcast message to all clients in a room
 * @param server - The server instance
 * @param roomId - The room ID
 * @param message - The message to send
 * @returns void
 */
export const sendBroadcast = ({
  server,
  roomId,
  message,
}: {
  server: Server;
  roomId: string;
  message: WSBroadcastType;
}) => {
  server.publish(roomId, JSON.stringify(message));
};

/**
 * Send a unicast message to a specific client
 * @param server - The server instance
 * @param clientId - The client ID
 * @param message - The message to send
 * @returns void
 */
export const sendUnicast = ({
  ws,
  message,
}: {
  ws: WebSocket;
  message: WSUnicastType;
}) => {
  ws.send(JSON.stringify(message));
};
