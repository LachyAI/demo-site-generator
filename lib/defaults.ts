import type { Service } from "./types";

export const PRESET_SERVICES: Service[] = [
  { id: "fence-deck", name: "Fence & Deck Repairs", description: "Timber repairs, paling replacement, deck oiling and restoration" },
  { id: "gyprock", name: "Gyprock & Plaster", description: "Hole patching, crack repairs, seamless wall finish" },
  { id: "door-lock", name: "Door & Lock Fixes", description: "Sticky doors, new handles, lock replacements and upgrades" },
  { id: "flatpack", name: "Flatpack Assembly", description: "IKEA, Bunnings, and office furniture assembled fast" },
  { id: "painting", name: "Interior Painting", description: "Scuff repair, wall repainting, and trim refreshment" },
  { id: "silicone", name: "Bathroom & Kitchen Seals", description: "Waterproofing showers, sinks, and gaps to prevent leaks" },
  { id: "pressure-clean", name: "Pressure Cleaning", description: "Driveways, paths, and external wall cleaning" },
  { id: "hanging", name: "Hanging & Odd Jobs", description: "Pictures, shelves, curtain rods, TV mounting, and more" },
  { id: "cabinet", name: "Kitchen Cabinet Repairs", description: "Door adjustments, hinge replacement, soft-close upgrades" },
  { id: "maintenance", name: "General Maintenance", description: "Changing bulbs, fixing taps, adjusting doors, general upkeep" },
  { id: "tiling", name: "Tile Repairs", description: "Cracked tile replacement, re-grouting, waterproofing" },
  { id: "outdoor", name: "Outdoor Repairs", description: "Letterbox fixes, gate repairs, clothesline installation" },
];

export const PRESET_CREDENTIALS = [
  "Police Checked",
  "Fully Insured",
  "ABN Registered",
  "Licensed Builder",
  "Cert III Carpentry",
  "Safety Certified",
] as const;

export const BRISBANE_SUBURBS = [
  "Albion", "Annerley", "Ascot", "Ashgrove", "Auchenflower",
  "Bardon", "Bulimba", "Camp Hill", "Cannon Hill", "Carina",
  "Clayfield", "Coorparoo", "East Brisbane", "Fortitude Valley",
  "Greenslopes", "Hamilton", "Hawthorne", "Highgate Hill",
  "Holland Park", "Indooroopilly", "Kangaroo Point", "Kelvin Grove",
  "Milton", "Morningside", "New Farm", "Newmarket", "Newstead",
  "Norman Park", "Nundah", "Paddington", "Red Hill", "South Brisbane",
  "Spring Hill", "St Lucia", "Taringa", "Toowong", "West End",
  "Wilston", "Woolloongabba", "Wynnum",
] as const;
