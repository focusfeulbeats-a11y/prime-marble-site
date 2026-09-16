import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/controls/OrbitControls.js';

export class PrimeMarbleViewer {
  constructor(container, onSelect = () => {}) {
    this.container = container;
    this.onSelect = onSelect;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x312e2a);
    this.camera = new THREE.PerspectiveCamera(48, 1, 0.01, 100);
    this.renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    container.replaceChildren(this.renderer.domElement);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.07;
    this.controls.minDistance = 1.2;
    this.controls.maxDistance = 18;
    this.controls.maxPolarAngle = Math.PI * 0.49;
    this.root = new THREE.Group();
    this.scene.add(this.root);
    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();
    this.renderer.domElement.addEventListener('pointerdown', (e) => this.pick(e));
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(container);
    this.addLights();
    this.resize();
    this.animate();
  }

  addLights() {
    this.scene.add(new THREE.HemisphereLight(0xfff7ed, 0x363b42, 2.2));
    const key = new THREE.DirectionalLight(0xfff1df, 4.2);
    key.position.set(4, 7, 5); key.castShadow = true; key.shadow.mapSize.set(2048, 2048);
    this.scene.add(key);
    const fill = new THREE.DirectionalLight(0xdbe8ff, 1.2); fill.position.set(-4, 3, 2); this.scene.add(fill);
  }

  makeStoneMaterial(material = {}) {
    const canvas = document.createElement('canvas'); canvas.width = 512; canvas.height = 512;
    const ctx = canvas.getContext('2d');
    const base = material.baseColour || '#eee8df'; ctx.fillStyle = base; ctx.fillRect(0,0,512,512);
    const seed = [...(material.id || 'stone')].reduce((a,c)=>a+c.charCodeAt(0),0);
    const rand = (n) => { const x = Math.sin(n * 12.9898 + seed) * 43758.5453; return x - Math.floor(x); };
    const dark = ['nero-marquina','absolute-black'].includes(material.id);
    for (let i=0;i<18;i++) {
      ctx.beginPath(); ctx.lineWidth = 0.7 + rand(i)*3.2; ctx.strokeStyle = dark ? `rgba(245,245,240,${0.10+rand(i+2)*0.32})` : `rgba(105,82,72,${0.08+rand(i+2)*0.22})`;
      let y = rand(i+10)*512; ctx.moveTo(-20,y);
      for(let x=0;x<=540;x+=35){ y += (rand(i*50+x)-0.5)*35; ctx.lineTo(x,y); }
      ctx.stroke();
    }
    const texture = new THREE.CanvasTexture(canvas); texture.wrapS = texture.wrapT = THREE.RepeatWrapping; texture.repeat.set(1.6,1.6); texture.colorSpace = THREE.SRGBColorSpace;
    return new THREE.MeshStandardMaterial({ map:texture, color:0xffffff, roughness: material.roughness ?? .28, metalness:0.02 });
  }

  load(spec, material) {
    while(this.root.children.length) this.root.remove(this.root.children[0]);
    const stone = this.makeStoneMaterial(material);
    const wallMat = new THREE.MeshStandardMaterial({color:0xe7e1d8, roughness:.82});
    const cabinetMat = new THREE.MeshStandardMaterial({color:0x6a5548, roughness:.62});
    const floorMat = new THREE.MeshStandardMaterial({color:0x9b816b, roughness:.75});
    const metalMat = new THREE.MeshStandardMaterial({color:0x252525, roughness:.3, metalness:.5});

    spec.objects.forEach(obj => {
      const d=obj.dimensions, p=obj.position;
      const geo = new THREE.BoxGeometry(Math.max(.02,d.x),Math.max(.02,d.y),Math.max(.02,d.z));
      let mat = stone;
      if(obj.type==='wall') mat=wallMat; else if(obj.type==='cabinet'||obj.type==='island'||obj.type==='vanity') mat=cabinetMat; else if(obj.type==='floor') mat=floorMat;
      const mesh = new THREE.Mesh(geo,mat); mesh.position.set(p.x,p.y,p.z); mesh.castShadow=true; mesh.receiveShadow=true; mesh.userData.sceneObject=obj; this.root.add(mesh);
    });

    // Simple sink and hob make a kitchen concept visually legible.
    if (/kitchen/.test(spec.projectType || '')) {
      const sink = new THREE.Mesh(new THREE.BoxGeometry(.52,.035,.38), metalMat); sink.position.set(-.45,1.005,-(spec.roomScale?.lengthM||5)/2+.55); sink.userData.sceneObject={id:'sink',type:'sink',dimensions:{x:.52,y:.035,z:.38},properties:{role:'sink cut-out'}}; this.root.add(sink);
      const hob = new THREE.Mesh(new THREE.BoxGeometry(.58,.025,.42), new THREE.MeshStandardMaterial({color:0x111111,roughness:.16})); hob.position.set(.55,1.01,-(spec.roomScale?.lengthM||5)/2+.55); hob.userData.sceneObject={id:'hob',type:'hob',dimensions:{x:.58,y:.025,z:.42},properties:{role:'hob cut-out'}}; this.root.add(hob);
    }

    const c=spec.camera?.position || [4,2.2,5]; this.camera.position.set(...c);
    const t=spec.camera?.target || [0,1,0]; this.controls.target.set(...t); this.controls.update();
  }

  pick(e){
    const r=this.renderer.domElement.getBoundingClientRect(); this.pointer.x=((e.clientX-r.left)/r.width)*2-1; this.pointer.y=-((e.clientY-r.top)/r.height)*2+1;
    this.raycaster.setFromCamera(this.pointer,this.camera); const hit=this.raycaster.intersectObjects(this.root.children,false)[0];
    if(hit?.object?.userData?.sceneObject) this.onSelect(hit.object.userData.sceneObject);
  }
  resetCamera(spec){ const c=spec?.camera?.position||[4,2.2,5],t=spec?.camera?.target||[0,1,0]; this.camera.position.set(...c); this.controls.target.set(...t); this.controls.update(); }
  downloadPNG(filename='prime-marble-design.png'){ this.renderer.render(this.scene,this.camera); const a=document.createElement('a'); a.download=filename; a.href=this.renderer.domElement.toDataURL('image/png'); a.click(); return a.href; }
  resize(){ const w=this.container.clientWidth,h=this.container.clientHeight||440; this.renderer.setSize(w,h,false); this.camera.aspect=w/h; this.camera.updateProjectionMatrix(); }
  animate(){ this._raf=requestAnimationFrame(()=>this.animate()); this.controls.update(); this.renderer.render(this.scene,this.camera); }
}
