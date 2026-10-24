import type { Category } from "./menu";

export type GlazeToken = { fill: string; rim: string };

export const glazeTiles: Record<Category, GlazeToken> = {
  cafe: { fill: "#5B3C2B", rim: "#79604F" },
  "sin-cafe": { fill: "#C4956A", rim: "#AB805B" },
  "pasteleria-panaderia": { fill: "#D8D2BF", rim: "#BAAE9B" },
  "opciones-saladas": { fill: "#C4956A", rim: "#AB805B" },
  menus: { fill: "#5B3C2B", rim: "#79604F" },
  promos: { fill: "#708C64", rim: "#899D7A" },
};
