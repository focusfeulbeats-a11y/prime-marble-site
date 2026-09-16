/**
 * Neutral scene language shared by the browser designer and Blender worker.
 */

/** @typedef {{ x: number, y: number, z: number }} Vector3 */
/** @typedef {{ widthMm: number|null, lengthMm: number|null, heightMm: number|null, walls: Object[], doors: Object[], windows: Object[] }} RoomGeometry */
/** @typedef {{ id: string, type: string, position: Vector3, dimensions: Vector3, materialId?: string, properties?: Object }} SceneObject */
/** @typedef {{ version: string, sourceProjectId: string, room: RoomGeometry, objects: SceneObject[], materialAssignments: Object[], lighting: Object, camera: Object }} SceneSpecification */

export const SCENE_SPECIFICATION_VERSION = "1.0.0";

export function createSceneSpecification({ projectId, projectType, room, stoneId, materialName, finish, thicknessMm, designPrompt, style }) {
  const widthM = (room.widthMm ?? 4000) / 1000;
  const lengthM = (room.lengthMm ?? 5000) / 1000;
  const heightM = (room.heightMm ?? 2400) / 1000;
  const stoneName = materialName || "Calacatta Viola";
  const selectedStone = stoneId || "calacatta-viola";
  const thickness = thicknessMm ?? 20;
  const objectList = [];
  const materialAssignments = [];

  const pushObject = (entry) => {
    objectList.push(entry);
    materialAssignments.push({
      objectId: entry.id,
      materialId: selectedStone,
      materialName: stoneName,
      finish,
      thicknessMm: thickness,
      stoneId: selectedStone,
      veinDirection: "various",
      bookmatch: /splashback|feature wall|bookmatch/i.test(designPrompt || "")
    });
  };

  pushObject({
    id: "room-floor",
    type: "floor",
    position: { x: 0, y: -0.06, z: 0 },
    dimensions: { x: widthM, y: 0.12, z: lengthM },
    materialId: selectedStone,
    properties: { finish, stoneName }
  });

  pushObject({
    id: "room-back-wall",
    type: "wall",
    position: { x: 0, y: heightM / 2, z: -lengthM / 2 },
    dimensions: { x: widthM, y: heightM, z: 0.12 },
    materialId: selectedStone,
    properties: { finish, stoneName, role: "back-wall" }
  });

  pushObject({
    id: "room-side-wall-left",
    type: "wall",
    position: { x: -widthM / 2, y: heightM / 2, z: 0 },
    dimensions: { x: 0.12, y: heightM, z: lengthM },
    materialId: selectedStone,
    properties: { finish, stoneName, role: "side-wall" }
  });

  pushObject({
    id: "room-side-wall-right",
    type: "wall",
    position: { x: widthM / 2, y: heightM / 2, z: 0 },
    dimensions: { x: 0.12, y: heightM, z: lengthM },
    materialId: selectedStone,
    properties: { finish, stoneName, role: "side-wall" }
  });

  const baseRunWidth = Math.min(widthM * 0.82, 2.6);
  const baseCabinetDepth = 0.61;
  const counterHeight = 0.92;
  const baseX = -baseRunWidth / 2 + 0.2;
  const baseZ = -lengthM / 2 + 0.55;

  for (let index = 0; index < 3; index += 1) {
    const cabinetX = baseX + index * 0.78;
    pushObject({
      id: `base-cabinet-${index + 1}`,
      type: "cabinet",
      position: { x: cabinetX, y: counterHeight / 2, z: baseZ },
      dimensions: { x: 0.72, y: counterHeight, z: baseCabinetDepth },
      materialId: selectedStone,
      properties: { finish, stoneName, role: "base-cabinet" }
    });
  }

  const worktopWidth = baseRunWidth - 0.18;
  pushObject({
    id: "worktop-run",
    type: "worktop",
    position: { x: 0, y: counterHeight + 0.05, z: baseZ },
    dimensions: { x: worktopWidth, y: 0.06, z: baseCabinetDepth + 0.08 },
    materialId: selectedStone,
    properties: { finish, stoneName, thicknessMm: thickness, role: "worktop" }
  });

  const splashbackHeight = Math.min(heightM * 0.7, 1.8);
  pushObject({
    id: "splashback-panel",
    type: "splashback",
    position: { x: 0, y: splashbackHeight / 2 + 0.92, z: -lengthM / 2 + 0.12 },
    dimensions: { x: worktopWidth, y: splashbackHeight, z: 0.12 },
    materialId: selectedStone,
    properties: { finish, stoneName, fullHeight: /full-height|full height/i.test(designPrompt || ""), role: "splashback" }
  });

  const islandWidth = /island\s*(\d+)\s*mm\s*x\s*(\d+)\s*mm|island\s*(\d+)\s*x\s*(\d+)/i.test(designPrompt || "")
    ? 2.4
    : Math.min(widthM * 0.46, 2.4);
  const islandDepth = 1.1;
  const islandCenter = { x: 0.8, y: 0, z: 0.1 };

  pushObject({
    id: "kitchen-island-base",
    type: "island",
    position: { x: islandCenter.x, y: 0.45, z: islandCenter.z },
    dimensions: { x: islandWidth, y: 0.9, z: islandDepth },
    materialId: selectedStone,
    properties: { finish, stoneName, role: "island" }
  });

  pushObject({
    id: "kitchen-island-top",
    type: "worktop",
    position: { x: islandCenter.x, y: 0.95, z: islandCenter.z },
    dimensions: { x: islandWidth + 0.12, y: 0.08, z: islandDepth + 0.12 },
    materialId: selectedStone,
    properties: { finish, stoneName, waterfall: /waterfall/i.test(designPrompt || ""), role: "island-top" }
  });

  if (/waterfall|waterfall both ends/i.test(designPrompt || "")) {
    pushObject({
      id: "island-waterfall-left",
      type: "waterfall",
      position: { x: islandCenter.x - islandWidth / 2 - 0.06, y: 0.45, z: islandCenter.z },
      dimensions: { x: 0.1, y: 0.9, z: islandDepth },
      materialId: selectedStone,
      properties: { finish, stoneName, role: "waterfall-left" }
    });
    pushObject({
      id: "island-waterfall-right",
      type: "waterfall",
      position: { x: islandCenter.x + islandWidth / 2 + 0.06, y: 0.45, z: islandCenter.z },
      dimensions: { x: 0.1, y: 0.9, z: islandDepth },
      materialId: selectedStone,
      properties: { finish, stoneName, role: "waterfall-right" }
    });
  }

  pushObject({
    id: "room-vanity",
    type: "vanity",
    position: { x: -1.7, y: 0.5, z: 0.7 },
    dimensions: { x: 1.2, y: 0.96, z: 0.56 },
    materialId: selectedStone,
    properties: { finish, stoneName, projectType }
  });

  const spec = {
    version: SCENE_SPECIFICATION_VERSION,
    sourceProjectId: projectId || "designer-project",
    room: {
      widthMm: room.widthMm ?? 4000,
      lengthMm: room.lengthMm ?? 5000,
      heightMm: room.heightMm ?? 2400,
      walls: [],
      doors: [],
      windows: []
    },
    objects: objectList,
    materialAssignments,
    lighting: {
      preset: "natural-daylight",
      ambientIntensity: 1.0,
      directionalIntensity: 1.5,
      direction: [1, 2, 1],
      color: "#f7f0e8"
    },
    camera: {
      position: [widthM * 0.9, heightM * 0.72, lengthM * 0.95],
      target: [0, 1.1, 0],
      mode: "isometric"
    },
    projectType,
    style,
    designPrompt,
    roomScale: { widthM, lengthM, heightM },
    stoneId: selectedStone,
    stoneName
  };

  return spec;
}
