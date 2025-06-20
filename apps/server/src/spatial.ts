import type { PositionType } from "@songsync/shared";

export const calculateEuclideanDistance = (p1: PositionType, p2: PositionType) => {
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;

    return Math.sqrt(dx * dx + dy * dy);
};

interface GainParams {
    client: PositionType;
    source: PositionType;
    falloff?: number;
    minGain?: number;
    maxGain?: number;
}

export const calculateGainFromDistanceToSource = (params: GainParams) => {
    return gainFromDistanceQuadratic(params);
}

export const gainFromDistanceExponential = ({
    client,
    source,
    falloff = 0.05,
    minGain = 0.15,
    maxGain = 1.0,
}: GainParams) => {
    const distance = calculateEuclideanDistance(client, source);
    const gain = Math.exp(-distance * falloff);
    return Math.max(minGain, Math.min(maxGain, gain));
}

export const gainFromDistanceLiner = ({
    client,
    source,
    falloff = 0.05,
    minGain = 0.15,
    maxGain = 1.0,
}: GainParams) => {
    const distance = calculateEuclideanDistance(client, source);
    const gain = maxGain - distance * falloff;
    return Math.max(minGain, Math.min(maxGain, gain));
}

export const gainFromDistanceQuadratic = ({
    client,
    source,
    falloff = 0.05,
    minGain = 0.15,
    maxGain = 1.0,
}: GainParams) => {
    const distance = calculateEuclideanDistance(client, source);
    const gain = maxGain - falloff * distance * distance;
    return Math.max(minGain, Math.min(maxGain, gain));
}
