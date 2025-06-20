import { GRID, type ClientType } from "@songsync/shared";

/**
 * Positions clients in a circle around the listening source/center point
 */

export const positionClientsInCircle = (
    clients: Map<string, ClientType>,
) => {
    const clientCount = clients.size;

    if (clientCount === 1) {
        const client = clients.values().next().value!;
        client.position = {x: GRID.ORIGIN_X, y: GRID.ORIGIN_Y - 25};
    }

    let index = 0;
    clients.forEach((client) => {
        const angle = (index / clientCount) * 2 * Math.PI - Math.PI / 2;
        client.position = {
            x: GRID.ORIGIN_X + GRID.CLIENT_RADIUS * Math.cos(angle),
            y: GRID.ORIGIN_Y + GRID.CLIENT_RADIUS * Math.sin(angle),
        };
        index++;
    });
}


export const debugClientPositions = (clients: Map<string, ClientType>) => {
    const clientCount = clients.size;
    console.log(`Client count: ${clientCount}`);
    clients.forEach((client) => {
        console.log(`Client ${client.username} position: ${client.position.x}, ${client.position.y}`);
    });
}