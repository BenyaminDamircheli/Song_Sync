import type {
  ClientType,
  WSBroadcastType,
  epochNow,
  WSRequestSchema,
} from "@songsync/shared";
import { GRID, type PositionType } from "@songsync/shared/types/base";
import type { Server, ServerWebSocket } from "bun";
import { existsSync, read } from "node:fs";
import { readdir } from "node:fs/promises";
import * as path from "path";
import { AUDIO_DIR, SCHEDULE_TIME_MS } from "./config";
import { calculateGainFromDistanceToSource } from "./spatial";
import { sendBroadcast } from "./utils/responses";
import { debugClientPositions, positionClientsInCircle } from "./utils/spatial";
import type { WSData } from "./utils/websocket";

interface RoomData {
  clients: Map<string, ClientType>;
  roomId: string;
  intervalId?: NodeJS.Timeout;
  listeningSource: PositionType;
}

class RoomManager {
  rooms = new Map<string, RoomData>();

  addClient(ws: ServerWebSocket<WSData>) {
    const { roomId, username, clientId } = ws.data;
    const room = this.rooms.get(roomId);

    if (!room) {
      this.rooms.set(roomId, {
        clients: new Map(),
        roomId,
        listeningSource: { x: GRID.ORIGIN_X, y: GRID.ORIGIN_Y },
      });
    }
    const currentRoom = this.rooms.get(roomId);

    currentRoom?.clients.set(clientId, {
      username,
      clientId,
      ws,
      rtt: 0,
      position: { x: GRID.ORIGIN_X, y: GRID.ORIGIN_Y },
    });

    if (!currentRoom?.clients) {
      console.log("No clients in the room");
      return;
    }

    positionClientsInCircle(currentRoom.clients);
    debugClientPositions(currentRoom.clients);
  }

  removeClient(roomId: string, clientId: string) {
    const room = this.rooms.get(roomId);

    if (!room) {
      console.log("No room found");
      return;
    }

    const clientCount = room.clients.size;

    if (clientCount === 1) {
      this.stopInterval(roomId);
      this.cleanUpRoomFiles(roomId);
      this.rooms.delete(roomId);
    }

    positionClientsInCircle(room.clients);
    debugClientPositions(room.clients);
  }

  async cleanUpRoomFiles(roomId: string) {
    try {
      const roomDirPath = path.join(AUDIO_DIR, `room-${roomId}`);
      if (existsSync(roomDirPath)) {
        const files = await readdir(roomDirPath);

        console.log(`Cleaning up room ${roomId} files: ${files.length}`);

        if (files.length > 0) {
          for (const file of files) {
            const filePath = path.join(roomDirPath, file);
            await Bun.file(filePath).delete();
          }

          // runs the command to remove the directory in the server.
          await Bun.spawn(["rmdir", roomDirPath]).exited;
        } else {
          console.log(
            `Room ${roomId} files already cleaned up/no files to clean up`
          );
        }
      } else {
        console.log(
          `Room ${roomId} files already cleaned up/no files to clean up`
        );
      }
    } catch (error) {
      console.error(`Error cleaning up room ${roomId} files: ${error}`);
    }
  }

  getRoomState(roomId: string) {
    const room = this.rooms.get(roomId);

    if (!room) {
      console.log("No room found");
      return;
    }

    return room;
  }

  getClients(roomId: string) {
    const room = this.getRoomState(roomId);

    if (!room) {
      console.log("No room found");
      return;
    }

    return room.clients;
  }

  
}
