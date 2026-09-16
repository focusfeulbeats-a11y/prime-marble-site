import { MATERIALS, PROJECT_TYPES, STYLES, createEmptyProject } from "./designer/data.js";
import { generateDesign } from "./designer/ai-design-service.js";
import { blenderService } from "./designer/blender-service.js";

const project = createEmptyProject();
let currentStep = 1;
let selectedUnit = "mm";
let generatedResult = null;

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

initNavigation();
renderProjectTypes();
renderStyles();
renderMaterials();
bindWizard();
restoreDraft();

function initNavigation() {
  const toggle = $(".navToggle");
  const menu = $(".menuWrap");
  const close = $(".navClose");
  const setMenu = (open) => {
    if (!toggle || !menu) return;
    menu.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";
  };
  toggle?.addEventListener("click", () => setMenu(!menu.classList.contains("open")));
  close?.addEventListener("click", () => setMenu(false));
  menu?.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (event) => { if (event.key === "Escape") setMenu(false); });
}

function renderProjectTypes() {
  $("#projectTypes").innerHTML = PROJECT_TYPES.map((type) => `
    <button class="projectTypeCard" type="button" data-project-type="${type.id}">
      <span class="typeIcon" aria-hidden="true">${type.icon}</span><strong>${type.name}</strong><small>${type.description}</small>
    </button>`).join("");
  $$("[data-project-type]").forEach((button) => button.addEventListener("click", () => {
    project.projectType = button.dataset.projectType;
    $$("[data-project-type]").forEach((item) => item.classList.toggle("selected", item === button));
  }));
}

function renderStyles() {
  $("#styleOptions").innerHTML = STYLES.map((style) => `<button class="styleOption" type="button" data-style="${style}">${style}</button>`).join("");
  $$("[data-style]").forEach((button) => button.addEventListener("click", () => {
    project.style = button.dataset.style;
    $$("[data-style]").forEach((item) => item.classList.toggle("selected", item === button));
  }));
}

function renderMaterials() {
  const category = $("#materialCategory")?.value || "all";
  const visibleMaterials = MATERIALS.filter((material) => category === "all" || material.category === category);
  $("#materials").innerHTML = visibleMaterials.map((material) => `
    <button class="materialCard ${project.materials.some((item) => item.id === material.id) ? "selected" : ""}" type="button" data-material-id="${material.id}" title="${material.description}">
      <img src="${material.image}" alt="${material.name} sample" width="320" height="210"><span class="materialCheck" aria-hidden="true">✓</span>
      <span class="materialCardBody"><strong>${material.name}</strong><small>${material.category} · ${material.finish}</small></span>
    </button>`).join("");
  $$("[data-material-id]").forEach((button) => button.addEventListener("click", () => {
    const material = MATERIALS.find((item) => item.id === button.dataset.materialId);
    const selected = project.materials.some((item) => item.id === material.id);
    if (selected) project.materials = project.materials.filter((item) => item.id !== material.id);
    else if (project.materials.length < 3) project.materials.push(material);
    renderMaterials();
  }));
}

function bindWizard() {
  $("[data-start-designing]").addEventListener("click", () => $("#designer-app").scrollIntoView({ behavior: "smooth" }));
  $("#materialCategory").addEventListener("change", renderMaterials);
  $("#spacePhotos").addEventListener("change", handlePhotoUpload);
  $$("[data-unit]").forEach((button) => button.addEventListener("click", () => setUnit(button.dataset.unit)));
  $$("[data-next]").forEach((button) => button.addEventListener("click", () => changeStep(1)));
  $$("[data-back]").forEach((button) => button.addEventListener("click", () => changeStep(-1)));
  $$("[data-step-button]").forEach((button) => button.addEventListener("click", () => {
    const target = Number(button.dataset.stepButton);
    if (target <= currentStep || validateStep(currentStep)) showStep(target);
  }));
  $("#generateDesign").addEventListener("click", handleGenerate);
  $("#saveProject").addEventListener("click", () => { saveDraft(); showNotice("Project saved locally on this device."); });
  $("#generateRender").addEventListener("click", () => showNotice("Render generation is coming soon. The current workspace contains a mock viewport only."));
  $("#requestQuote").addEventListener("click", () => {
    project.quoteRequestStatus = "Ready to package";
    saveDraft();
    showNotice("Your design brief is ready to take into a quote conversation. Connect with a specialist through the existing quote form.");
    window.setTimeout(() => { window.location.href = "contact.html"; }, 900);
  });
  $$("[data-workspace-tab]").forEach((button) => button.addEventListener("click", () => {
    $$("[data-workspace-tab]").forEach((item) => item.classList.toggle("active", item === button));
    showNotice(`${button.textContent} panel selected. Detailed controls will arrive with the interactive viewer.`);
  }));
}

function handlePhotoUpload(event) {
  const files = Array.from(event.target.files).slice(0, 10);
  project.photos = files.map((file) => ({ name: file.name, size: file.size, type: file.type, previewUrl: URL.createObjectURL(file) }));
  renderPhotoPreviews();
}

function renderPhotoPreviews() {
  $("#photoPreview").innerHTML = project.photos.map((photo, index) => `<div class="photoItem"><img src="${photo.previewUrl}" alt="Uploaded space view ${index + 1}"><button type="button" data-remove-photo="${index}" aria-label="Remove ${photo.name}">×</button></div>`).join("");
  $("#photoHint").textContent = project.photos.length ? `${project.photos.length} photograph${project.photos.length === 1 ? "" : "s"} ready for this local draft.` : "No photographs selected yet. You can continue without them while exploring the prototype.";
  $$('[data-remove-photo]').forEach((button) => button.addEventListener("click", () => {
    const [removed] = project.photos.splice(Number(button.dataset.removePhoto), 1);
    if (removed?.previewUrl) URL.revokeObjectURL(removed.previewUrl);
    renderPhotoPreviews();
  }));
}

function setUnit(unit) {
  selectedUnit = unit;
  project.room.measurementUnit = unit;
  $$("[data-unit]").forEach((button) => button.classList.toggle("active", button.dataset.unit === unit));
  $$(".unitLabel").forEach((label) => { label.textContent = unit; });
}

function collectForm() {
  const form = new FormData($("#designerWizard"));
  project.room.width = form.get("roomWidth") || null;
  project.room.length = form.get("roomLength") || null;
  project.room.height = form.get("roomHeight") || null;
  project.measurements = ["door", "window", "worktop", "island", "otherWall"].filter((name) => form.get(name)).map((name) => ({ name, value: form.get(name) }));
  project.designPrompt = form.get("designPrompt") || "";
  project.updatedAt = new Date().toISOString();
}

function validateStep(step) {
  collectForm();
  if (step === 1 && !project.projectType) { showNotice("Choose a project type to continue."); return false; }
  if (step === 3 && !$("#designerWizard").reportValidity()) { showNotice("Add the room width, length and ceiling height to continue."); return false; }
  return true;
}

function changeStep(delta) {
  if (delta > 0 && !validateStep(currentStep)) return;
  showStep(Math.min(6, Math.max(1, currentStep + delta)));
}

function showStep(step) {
  currentStep = step;
  collectForm();
  $$(".wizardStep").forEach((section) => { const active = Number(section.dataset.step) === step; section.classList.toggle("active", active); section.hidden = !active; });
  $$(".stepList li").forEach((item, index) => { item.classList.toggle("active", index + 1 === step); item.classList.toggle("done", index + 1 < step); });
  $("#stepCounter").textContent = `0${step} / 06`;
  if (step === 6) renderReview();
}

function renderReview() {
  const type = PROJECT_TYPES.find((item) => item.id === project.projectType)?.name || "Not selected";
  const materials = project.materials.map((item) => item.name).join(", ") || "No material selected";
  const dimensions = [project.room.width, project.room.length, project.room.height].every(Boolean) ? `${project.room.width} × ${project.room.length} × ${project.room.height} ${selectedUnit}` : "Not added";
  $("#reviewSummary").innerHTML = [["Project", type], ["Scale", dimensions], ["Style", project.style || "Not selected"], ["Material samples", materials], ["Space photographs", `${project.photos.length} local upload${project.photos.length === 1 ? "" : "s"}`], ["Brief", project.designPrompt || "No written brief yet"]].map(([label, value]) => `<div class="reviewItem"><span>${label}</span><strong>${value}</strong></div>`).join("");
}

async function handleGenerate() {
  if (!validateStep(6)) return;
  const button = $("#generateDesign");
  button.disabled = true;
  button.innerHTML = "Preparing concept…";
  generatedResult = await generateDesign(project);
  project.status = "Design Generated";
  project.updatedAt = new Date().toISOString();
  await blenderService.createScene(generatedResult.sceneSpecification);
  saveDraft();
  updateWorkspace();
  button.disabled = false;
  button.innerHTML = 'Generate concept <span aria-hidden="true">↗</span>';
  $("#workspace").hidden = false;
  $("#workspace").scrollIntoView({ behavior: "smooth" });
}

function updateWorkspace() {
  const type = PROJECT_TYPES.find((item) => item.id === project.projectType)?.name || "Stone project";
  const material = project.materials[0];
  $("#workspaceTitle").textContent = `${type} concept`;
  $("#workspaceStatusText").textContent = generatedResult?.status === "mock" ? "Mock concept ready" : "Draft";
  $("#selectedMaterial").textContent = material?.name || "Not selected";
  $("#selectedDimensions").textContent = project.room.width ? `${project.room.width} × ${project.room.length} × ${project.room.height} ${selectedUnit}` : "Add room measurements";
}

function saveDraft() {
  localStorage.setItem("prime-marble-ai-designer-draft", JSON.stringify({ ...project, photos: project.photos.map(({ name, size, type }) => ({ name, size, type })) }));
  $("#saveState").textContent = "Saved locally · just now";
}

function restoreDraft() {
  const saved = localStorage.getItem("prime-marble-ai-designer-draft");
  if (!saved) return;
  try {
    const draft = JSON.parse(saved);
    Object.assign(project, draft, { photos: [] });
    selectedUnit = project.room.measurementUnit || "mm";
    setUnit(selectedUnit);
    if (project.projectType) $(`[data-project-type="${project.projectType}"]`)?.classList.add("selected");
    if (project.style) $(`[data-style="${project.style}"]`)?.classList.add("selected");
    renderMaterials();
    $("[name=roomWidth]").value = project.room.width || "";
    $("[name=roomLength]").value = project.room.length || "";
    $("[name=roomHeight]").value = project.room.height || "";
    $("#designPrompt").value = project.designPrompt || "";
    $("#saveState").textContent = "Saved local draft restored";
  } catch (error) { console.warn("Could not restore designer draft", error); }
}

function showNotice(message) {
  const notice = $("#workspaceNotice");
  notice.textContent = message;
  notice.hidden = false;
  window.clearTimeout(showNotice.timeout);
  showNotice.timeout = window.setTimeout(() => { notice.hidden = true; }, 6000);
}
