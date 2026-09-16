/**
 * Shared Phase 1 data for the AI Stone Designer.
 * Keep this plain JSON-shaped data so a future API can replace it directly.
 */

export const PROJECT_TYPES = [
  { id: "kitchen", name: "Kitchen", icon: "▦", description: "Worktops, islands and splashbacks" },
  { id: "bathroom", name: "Bathroom", icon: "◫", description: "Vanities, walls and shower areas" },
  { id: "feature-wall", name: "Feature Wall", icon: "▥", description: "Bookmatched and statement stone" },
  { id: "fireplace", name: "Fireplace", icon: "◇", description: "Surrounds, hearths and mantels" },
  { id: "flooring", name: "Flooring", icon: "▤", description: "Stone floors, steps and thresholds" },
  { id: "staircase", name: "Staircase", icon: "⇲", description: "Treads, risers and landings" },
  { id: "outdoor-stone", name: "Outdoor Stone", icon: "⌂", description: "Terraces, paving and walls" },
  { id: "custom", name: "Custom Project", icon: "✦", description: "A stone idea of your own" }
];

export const STYLES = ["Modern", "Contemporary", "Traditional", "Minimal", "Luxury", "Mediterranean", "Industrial"];

export const MATERIALS = [
  { id: "calacatta-viola", name: "Calacatta Viola", category: "Marble", colour: "White with plum veining", finish: "Honed", thickness: "20 mm", supplier: "Sample collection", slabDimensions: "3200 x 1600 mm", image: "images/project-05.jpg", description: "A dramatic marble with warm violet movement." },
  { id: "carrara", name: "Carrara Gioia", category: "Marble", colour: "Soft white and grey", finish: "Polished", thickness: "20 mm", supplier: "Sample collection", slabDimensions: "3000 x 1400 mm", image: "images/project-01.jpg", description: "Quiet grey veining for a refined, timeless finish." },
  { id: "taj-mahal", name: "Taj Mahal", category: "Quartzite", colour: "Ivory with gold", finish: "Leathered", thickness: "20 mm", supplier: "Sample collection", slabDimensions: "3200 x 1600 mm", image: "images/project-07.jpg", description: "Durable quartzite with a luminous natural palette." },
  { id: "nero-marquina", name: "Nero Marquina", category: "Marble", colour: "Black with white veining", finish: "Honed", thickness: "20 mm", supplier: "Sample collection", slabDimensions: "2800 x 1400 mm", image: "images/project-03.jpg", description: "Confident graphic contrast for feature applications." },
  { id: "travertine", name: "Classic Travertine", category: "Travertine", colour: "Warm cream", finish: "Brushed", thickness: "30 mm", supplier: "Sample collection", slabDimensions: "2800 x 1400 mm", image: "images/project-09.jpg", description: "Tactile, naturally porous stone with soft movement." },
  { id: "basalt", name: "Midnight Basalt", category: "Granite", colour: "Deep charcoal", finish: "Flamed", thickness: "30 mm", supplier: "Sample collection", slabDimensions: "3000 x 1500 mm", image: "images/project-11.jpg", description: "A resilient dark stone for inside and outside use." },
  { id: "calacatta-porcelain", name: "Calacatta Vein", category: "Porcelain / Sintered Stone", colour: "White with soft veining", finish: "Silk", thickness: "12 mm", supplier: "Sample collection", slabDimensions: "3200 x 1600 mm", image: "images/project-04.jpg", description: "Large-format porcelain with a marble-inspired surface." },
  { id: "verde-alpi", name: "Verde Alpi", category: "Onyx", colour: "Deep green and white", finish: "Polished", thickness: "20 mm", supplier: "Sample collection", slabDimensions: "2600 x 1300 mm", image: "images/project-10.jpg", description: "An expressive green statement for considered interiors." }
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
    sceneObjects: [],
    renders: [],
    modelFile: null,
    quoteRequestStatus: "Not requested"
  };
}
