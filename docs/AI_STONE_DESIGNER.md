# AI Stone Designer

## Current architecture

Natural Stone Network's current repository is a static multi-page HTML site. It does not currently contain a JavaScript framework, client-side router, authentication layer, dashboard, database, or application API. Phase 1 therefore lives at `ai-designer.html` and uses the existing page shell, `style.css` conventions, browser state, and small feature-local JavaScript modules.

The feature is deliberately honest: photographs and measurements are collected locally in the browser, the design workspace is a usable mock, and generation/renders/Blender operations are labelled as development placeholders.

## Data flow

```text
Customer
  -> AI Stone Designer wizard
  -> DesignProject JSON
  -> future AI Design Planner
  -> SceneSpecification JSON
  -> future Blender Worker
  -> GLB model + rendered images
  -> Design Workspace
  -> quote request package
```

## Files

- `ai-designer.html`: landing page, project wizard, and responsive design workspace.
- `ai-designer.css`: feature-specific styling layered on the existing `style.css`.
- `ai-designer.js`: wizard state, local photo previews, workspace controls, and honest mock states.
- `designer/data.js`: project types, style options, sample materials, and the `DesignProject` factory.
- `designer/scene-specification.js`: documented neutral scene contract for AI and Blender.
- `designer/ai-design-service.js`: future AI service boundary with a mock `generateDesign(project)` implementation.
- `designer/blender-service.js`: future worker boundary for scene creation, materials, camera, lighting, renders, and GLB export.

## DesignProject model

The browser model includes an id, optional user id, lifecycle status, room dimensions, photos, optional measurements, design prompt, style, selected materials, scene objects, renders, model file metadata, and quote request status. Measurements are stored with the selected unit in Phase 1 and converted to millimetres at the AI service boundary.

Future persisted projects should use the existing platform's customer account and project records once an application backend exists. This static repository has no dashboard or database to extend today.

## Materials and stone workflows

The sample material records already include category, colour, finish, thickness, supplier, slab dimensions, image and description. Future records should add slab identity, vein direction, bookmatching, layout, seams, edge profile, cut-outs, wastage and fabrication notes. Supplier-owned inventory should be added through a protected marketplace API rather than hard-coded into the page.

## Future service communication

The browser should submit a validated `DesignProject` to an authenticated API. The AI planner should return a versioned `SceneSpecification`, which a queue-backed Blender worker consumes. The worker should return job status, GLB metadata and render URLs. Browser edits should produce scene patches or a new specification, not raw Blender commands.

No API keys belong in browser code. Future endpoints should use environment variables server-side, authenticated user sessions, upload validation, signed object-storage URLs and job ownership checks.

## Roadmap

1. Phase 1: Website UX, project wizard, data structures, workspace and mock generation.
2. Phase 2: Interactive browser 3D viewer.
3. Phase 3: AI converts customer instructions into `SceneSpecification`.
4. Phase 4: Local Blender Python prototype.
5. Phase 5: Blender worker/service integration.
6. Phase 6: Photo-assisted room reconstruction.
7. Phase 7: Natural stone slab/material database.
8. Phase 8: Slab layout, vein matching and fabrication planning.
9. Phase 9: Professional quote marketplace integration.
10. Phase 10: Production rendering infrastructure.

## Testing Phase 1

Run a local static server from the repository root, then open `/ai-designer.html`:

```shell
npx serve .
```

Test the eight project types, photo selection/removal, unit switching, required room measurements, style/material selection, mock generation, workspace panel switching, save-to-browser, and the Request Quote action. Use a mobile viewport to test camera upload and the single-column wizard.
git add .
git commit -m "Make Prime Marble 3D designer operational"
git push origin main
