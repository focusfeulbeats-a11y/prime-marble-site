/**
 * Neutral scene language shared by the future AI planner and Blender worker.
 * These JSDoc shapes keep the model discoverable in a plain JavaScript site.
 */

/** @typedef {{ x: number, y: number, z: number }} Vector3 */
/** @typedef {{ widthMm: number|null, lengthMm: number|null, heightMm: number|null, walls: Object[], doors: Object[], windows: Object[] }} RoomGeometry */
/** @typedef {{ id: string, type: string, position: Vector3, dimensions: Vector3, materialId?: string, properties?: Object }} SceneObject */
/** @typedef {{ version: string, sourceProjectId: string, room: RoomGeometry, objects: SceneObject[], materialAssignments: Object[], lighting: Object, camera: Object }} SceneSpecification */

export const SCENE_SPECIFICATION_VERSION = "0.1";
