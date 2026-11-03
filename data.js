/**
 * Shared data for the Prime Marble Specialists AI Stone Designer.
 * This is a plain JSON-friendly source for the browser designer and a future API.
 */

export const PROJECT_TYPES = [
  { id: "kitchen-worktops", name: "Kitchen Worktops", icon: "▦", description: "Worktops, islands and splashbacks" },
  { id: "kitchen-island", name: "Kitchen Island", icon: "▣", description: "Statement islands and waterfall ends" },
  { id: "full-height-splashback", name: "Full-Height Splashback", icon: "▤", description: "Wall cladding and stone panels" },
  { id: "bathroom", name: "Bathroom", icon: "◫", description: "Vanities, walls and shower areas" },
  { id: "vanity-tops", name: "Vanity Tops", icon: "◬", description: "Hand basins and stone counters" },
  { id: "feature-wall", name: "Feature Wall", icon: "▥", description: "Bookmatched statement walls" },
  { id: "fireplace", name: "Fireplace", icon: "◇", description: "Hearths, surrounds and cladding" },
  { id: "stone-flooring", name: "Stone Flooring", icon: "▨", description: "Floors, thresholds and pathways" },
  { id: "staircase", name: "Staircase", icon: "⇲", description: "Treads, risers and landings" },
  { id: "custom", name: "Custom Project", icon: "✦", description: "A stone idea of your own" }
];

export const STYLES = ["Modern", "Contemporary", "Traditional", "Minimal", "Luxury", "Warm Contemporary", "Industrial"];

export const MATERIALS = [
  { id: "calacatta-viola", name: "Calacatta Viola", category: "Marble", colour: "Warm white with plum veining", finish: "Polished", thicknesses: [20, 30], image: "images/project-05.jpg", description: "Luxury marble with dramatic veining and a soft lilac accent.", baseColour: "#f3efe9", roughness: 0.28, texture: "vein", finishOptions: ["Polished", "Honed", "Leathered"], support: { veinDirection: true, bookmatch: true } },
  { id: "calacatta-gold", name: "Calacatta Gold", category: "Marble", colour: "Cream with gold veining", finish: "Polished", thicknesses: [20, 30], image: "images/project-04.jpg", description: "A classic luxe marble that suits grand kitchens and bathrooms.", baseColour: "#f7f1e4", roughness: 0.25, texture: "vein", finishOptions: ["Polished", "Honed"], support: { veinDirection: true, bookmatch: true } },
  { id: "statuario", name: "Statuario", category: "Marble", colour: "Bright white with grey veining", finish: "Polished", thicknesses: [20, 30], image: "images/project-01.jpg", description: "Crisp white stone that brings a refined architectural feel.", baseColour: "#f4f2ee", roughness: 0.22, texture: "vein", finishOptions: ["Polished", "Honed"], support: { veinDirection: true, bookmatch: true } },
  { id: "nero-marquina", name: "Nero Marquina", category: "Marble", colour: "Black with white veining", finish: "Honed", thicknesses: [20, 30], image: "images/project-03.jpg", description: "High-contrast stone with a strong, graphic character.", baseColour: "#1c1b1a", roughness: 0.35, texture: "vein", finishOptions: ["Honed", "Polished"], support: { veinDirection: true, bookmatch: false } },
  { id: "taj-mahal", name: "Taj Mahal", category: "Quartzite", colour: "Ivory with gold movement", finish: "Leathered", thicknesses: [20, 30], image: "images/project-07.jpg", description: "Warm quartzite with refined movement and excellent durability.", baseColour: "#e7d8b8", roughness: 0.45, texture: "micro", finishOptions: ["Leathered", "Honed", "Polished"], support: { veinDirection: true, bookmatch: true } },
  { id: "patagonia", name: "Patagonia", category: "Quartzite", colour: "Soft beige and warm grey", finish: "Honed", thicknesses: [20, 30], image: "images/project-06.jpg", description: "A warm, contemporary quartzite suited to spacious kitchens.", baseColour: "#d8c9b4", roughness: 0.38, texture: "micro", finishOptions: ["Honed", "Leathered"], support: { veinDirection: true, bookmatch: false } },
  { id: "absolute-black", name: "Absolute Black", category: "Granite", colour: "Jet black", finish: "Polished", thicknesses: [20, 30], image: "images/project-11.jpg", description: "Strong black granite for sleek interior work and bold detailing.", baseColour: "#121212", roughness: 0.24, texture: "granular", finishOptions: ["Polished", "Flamed", "Honed"], support: { veinDirection: false, bookmatch: false } },
  { id: "steel-grey", name: "Steel Grey", category: "Granite", colour: "Gunmetal grey", finish: "Honed", thicknesses: [20, 30], image: "images/project-09.jpg", description: "Cool grey stone that works beautifully in minimal spaces.", baseColour: "#5a5d63", roughness: 0.31, texture: "granular", finishOptions: ["Honed", "Polished"], support: { veinDirection: false, bookmatch: false } },
  { id: "classic-travertine", name: "Classic Beige", category: "Travertine", colour: "Warm beige and cream", finish: "Brushed", thicknesses: [20, 30], image: "images/project-10.jpg", description: "Soft tonal variation and an earthy warmth for relaxed luxury.", baseColour: "#d7c8a8", roughness: 0.52, texture: "travertine", finishOptions: ["Brushed", "Honed", "Filled"], support: { veinDirection: true, bookmatch: false } },
  { id: "jura-beige", name: "Jura Beige", category: "Limestone", colour: "Stone beige", finish: "Honed", thicknesses: [20, 30], image: "images/project-08.jpg", description: "A muted limestone for textured, natural interior schemes.", baseColour: "#d1c5b1", roughness: 0.48, texture: "limestone", finishOptions: ["Honed", "Brushed"], support: { veinDirection: true, bookmatch: false } },
  { id: "white-onyx", name: "White Onyx", category: "Onyx", colour: "Soft translucent white", finish: "Polished", thicknesses: [18, 20], image: "images/project-02.jpg", description: "A glowing stone that suits backlit statements and feature walls.", baseColour: "#f2f0ee", roughness: 0.18, texture: "onyx", finishOptions: ["Polished", "Backlit"], support: { veinDirection: true, bookmatch: true } },
  { id: "green-onyx", name: "Green Onyx", category: "Onyx", colour: "Emerald green with white veining", finish: "Polished", thicknesses: [18, 20], image: "images/project-12.jpg", description: "Vivid, statement-making stone with a decorative edge.", baseColour: "#1d4a3e", roughness: 0.18, texture: "onyx", finishOptions: ["Polished"], support: { veinDirection: true, bookmatch: true } },
  { id: "calacatta-porcelain", name: "Calacatta Vein Porcelain", category: "Porcelain / Sintered Stone", colour: "White with faint veining", finish: "Silk", thicknesses: [12, 20], image: "images/project-04.jpg", description: "A durable large-format porcelain with a marble-inspired look.", baseColour: "#f7f2ee", roughness: 0.28, texture: "porcelain", finishOptions: ["Silk", "Matt", "Polished"], support: { veinDirection: true, bookmatch: true } },
  { id: "mont-blanc", name: "Mont Blanc", category: "Quartzite", colour: "Soft cream with subtle mineral movement", finish: "Polished", thicknesses: [20, 30], image: "images/project-05.jpg", description: "A quietly luxurious quartzite for balanced, elegant schemes.", baseColour: "#efe7df", roughness: 0.3, texture: "micro", finishOptions: ["Polished", "Honed"], support: { veinDirection: true, bookmatch: true } },
  { id: "verde-alpi", name: "Verde Alpi", category: "Onyx", colour: "Deep green with white veining", finish: "Polished", thicknesses: [20, 30], image: "images/project-10.jpg", description: "Bold green stone for statement panels and luxury feature walls.", baseColour: "#1d453a", roughness: 0.16, texture: "onyx", finishOptions: ["Polished", "Honed"], support: { veinDirection: true, bookmatch: true } }
];

export const INSPIRATION_DESIGNS = [
  {
    id: "luxury-viola-kitchen",
    title: "Luxury Viola Kitchen",
    projectType: "kitchen-worktops",
    style: "Luxury",
    prompt: "Large central island with Calacatta Viola marble, 20mm worktops, waterfall both ends and full-height splashback.",
    room: { width: 4500, length: 5400, height: 2400 },
    stone: "calacatta-viola"
  },
  {
    id: "taj-mahal-kitchen",
    title: "Taj Mahal Kitchen",
    projectType: "kitchen-worktops",
    style: "Warm Contemporary",
    prompt: "Warm contemporary kitchen with Taj Mahal quartzite worktops, a large island, 20mm stone, and full-height splashback.",
    room: { width: 4700, length: 5600, height: 2500 },
    stone: "taj-mahal"
  },
  {
    id: "patagonia-island",
    title: "Patagonia Statement Island",
    projectType: "kitchen-island",
    style: "Modern",
    prompt: "Luxury kitchen featuring a large Patagonia quartzite island with waterfall ends and matching feature splashback.",
    room: { width: 5000, length: 6000, height: 2600 },
    stone: "patagonia"
  },
  {
    id: "calacatta-gold-bathroom",
    title: "Calacatta Gold Bathroom",
    projectType: "bathroom",
    style: "Luxury",
    prompt: "Luxury bathroom with Calacatta Gold vanity top, matching shower wall panels and polished finish.",
    room: { width: 3600, length: 4200, height: 2400 },
    stone: "calacatta-gold"
  },
  {
    id: "bookmatched-feature-wall",
    title: "Bookmatched Feature Wall",
    projectType: "feature-wall",
    style: "Contemporary",
    prompt: "Floor-to-ceiling bookmatched Calacatta Viola marble feature wall with integrated lighting.",
    room: { width: 5200, length: 6200, height: 2800 },
    stone: "calacatta-viola"
  },
  {
    id: "nero-marquina-fireplace",
    title: "Nero Marquina Fireplace",
    projectType: "fireplace",
    style: "Minimal",
    prompt: "Modern floor-to-ceiling fireplace clad in Nero Marquina marble with matching hearth and integrated niche.",
    room: { width: 3600, length: 5000, height: 2600 },
    stone: "nero-marquina"
  }
];

export function createEmptyProject() {
  const now = new Date().toISOString();
  return {
    id: `designer-${Date.now()}`,
    userId: null,
    name: "Untitled stone project",
    projectType: "",
    status: "Draft",
    createdAt: now,
    updatedAt: now,
    room: { width: null, length: null, height: null, measurementUnit: "mm" },
    photos: [],
    measurements: [],
    designPrompt: "",
    style: "",
    materials: [],
    sceneSpecification: null,
    sceneObjects: [],
    renders: [],
    modelFile: null,
    quoteRequestStatus: "Not requested"
  };
}
