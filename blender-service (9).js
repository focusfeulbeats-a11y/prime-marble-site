/**
 * Future Blender worker boundary.
 * Blender should run as a separate service and consume SceneSpecification,
 * never raw customer language or browser-only state.
 */

export const blenderService = {
  async createScene(sceneSpecification) { return mockOperation("createScene", sceneSpecification); },
  async updateScene(sceneSpecification) { return mockOperation("updateScene", sceneSpecification); },
  async applyMaterial(materialAssignment) { return mockOperation("applyMaterial", materialAssignment); },
  async addObject(sceneObject) { return mockOperation("addObject", sceneObject); },
  async setCamera(camera) { return mockOperation("setCamera", camera); },
  async setLighting(lighting) { return mockOperation("setLighting", lighting); },
  async renderScene(sceneSpecification) { return mockOperation("renderScene", sceneSpecification); },
  async exportGLB(sceneSpecification) { return mockOperation("exportGLB", sceneSpecification); }
};

async function mockOperation(operation, payload) {
  return { status: "mock", operation, payload, message: "Blender worker integration is planned, not connected." };
}
