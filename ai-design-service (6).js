/**
 * Generate a structured DesignProject -> SceneSpecification result for the Prime Marble designer.
 */

import { createSceneSpecification } from "./scene-specification.js";

export async function generateDesign(project) {
  await new Promise((resolve) => window.setTimeout(resolve, 700));

  const widthMm = toMillimetres(project.room.width, project.room.measurementUnit);
  const lengthMm = toMillimetres(project.room.length, project.room.measurementUnit);
  const heightMm = toMillimetres(project.room.height, project.room.measurementUnit);
  const defaultStone = project.materials[0] || {
    id: "calacatta-viola",
    name: "Calacatta Viola",
    baseColour: "#f7f2ee",
    finish: "Polished",
    thicknesses: [20, 30]
  };
  const finish = detectFinish(project.designPrompt, defaultStone);
  const thicknessMm = detectThickness(project.designPrompt, defaultStone);
  const style = project.style || "Luxury";

  const sceneSpecification = createSceneSpecification({
    projectId: project.id,
    projectType: project.projectType || "kitchen-worktops",
    room: { widthMm, lengthMm, heightMm },
    stoneId: defaultStone.id,
    materialName: defaultStone.name,
    finish,
    thicknessMm,
    designPrompt: project.designPrompt || "",
    style
  });

  return {
    status: "ready",
    message: "Design concept generated from your measurements and material selection.",
    sceneSpecification,
    preview: {
      projectType: project.projectType || "kitchen-worktops",
      material: defaultStone.name,
      finish,
      size: `${widthMm ?? 0} x ${lengthMm ?? 0} x ${heightMm ?? 0} mm`
    }
  };
}

function toMillimetres(value, unit) {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) return null;
  return Math.round(numericValue * ({ mm: 1, cm: 10, m: 1000 }[unit] || 1));
}

function detectFinish(prompt, material) {
  const text = (prompt || "").toLowerCase();
  if (text.includes("polished")) return "Polished";
  if (text.includes("honed")) return "Honed";
  if (text.includes("leathered")) return "Leathered";
  if (material?.finish) return material.finish;
  return "Polished";
}

function detectThickness(prompt, material) {
  const text = (prompt || "").toLowerCase();
  if (text.includes("30mm") || text.includes("30 mm")) return 30;
  if (text.includes("20mm") || text.includes("20 mm")) return 20;
  if (Array.isArray(material?.thicknesses) && material.thicknesses.length) return material.thicknesses[0];
  return 20;
}
