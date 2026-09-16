/**
 * Future AI boundary.
 * Replace the body of generateDesign with an authenticated API call when the
 * AI planner is ready. UI code should only depend on this contract.
 */

export async function generateDesign(project) {
  await new Promise((resolve) => window.setTimeout(resolve, 650));

  return {
    status: "mock",
    message: "Concept planning is mocked in Phase 1. No AI reconstruction has run.",
    sceneSpecification: {
      version: "0.1",
      sourceProjectId: project.id,
      room: {
        widthMm: toMillimetres(project.room.width, project.room.measurementUnit),
        lengthMm: toMillimetres(project.room.length, project.room.measurementUnit),
        heightMm: toMillimetres(project.room.height, project.room.measurementUnit),
        walls: [],
        doors: [],
        windows: []
      },
      objects: [],
      materialAssignments: project.materials.map((material) => ({ objectId: "unassigned", materialId: material.id, veinDirection: "unspecified" })),
      lighting: { preset: "natural-daylight", intensity: 1 },
      camera: { position: [4, 3, 4], target: [0, 1.2, 0], focalLength: 35 }
    }
  };
}

function toMillimetres(value, unit) {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) return null;
  return Math.round(numericValue * ({ mm: 1, cm: 10, m: 1000 }[unit] || 1));
}
