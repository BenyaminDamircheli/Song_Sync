import { GetAudioSchema } from "@songsync/shared";
import type { Server } from "bun";
import * as path from "path";
import { AUDIO_DIR } from "../config";
import { errorResponse, jsonResponse } from "../utils/responses";

/**
 * Get audio by id
 * @param req - The request object
 * @param server - The server object
 * @returns The response object
 */
export const handleGetAudio = async (req: Request, server: Server) => {
  try {
    // check if its a post request
    if (req.method !== "POST") {
      return errorResponse("Method not allowed", 405);
    }

    if (
      !req.headers.get("Content-Type") ||
      req.headers.get("Content-Type") !== "application/json"
    ) {
      return errorResponse("Invalid content type", 400);
    }

    const rawBody = await req.json();
    const parseResult = GetAudioSchema.safeParse(rawBody);

    if (!parseResult.success) {
      return errorResponse("Invalid request body", 400);
    }

    const { id } = parseResult.data;

    const audioPath = path.join(AUDIO_DIR, id);
    const audioFile = Bun.file(audioPath);

    if (!(await audioFile.exists())) {
      return errorResponse("Audio file not found", 404);
    }

    return new Response(audioFile, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": audioFile.size.toString(),
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("Error in handleGetAudio:", error);
    return errorResponse("Internal server error", 500);
  }
};
