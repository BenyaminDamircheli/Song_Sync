export * from "./base";
export * from "./HTTPRequest";
export * from "./WSBroadcast";
export * from "./WSRequest";
export * from "./WSUnicast";

export const epochNow = () => performance.timeOrigin + performance.now();
