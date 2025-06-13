import { z } from "zod";
import { UploadAudioSchema } from "@songsync/shared"; 
import type { Server } from "bun";
import * as path from "path";


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
            return new Response("Method not allowed", { status: 405 });
        }
    }
}