import {
  AdditiveBlending,
  BufferGeometry,
  CanvasTexture,
  Color,
  Float32BufferAttribute,
  Group,
  LinearFilter,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Points,
  PointsMaterial,
  Scene,
  Sprite,
  SpriteMaterial,
  SRGBColorSpace,
  Vector2,
  WebGLRenderer,
} from "three";

const CLOUDINARY = "https://res.cloudinary.com/dthx4fxte/image/upload";

const DASHBOARD_URL = `${CLOUDINARY}/v1781014306/FireShot_Capture_001_-_SBK_Tyre_Distributors_-_sbk-tyres.pages.dev_q9o0t1.png`;
const PHONE_URL = `${CLOUDINARY}/v1782715388/screenshot-2026-06-29_12-12-41_enkaeu.png`;
const RESTAURANT_URL = `${CLOUDINARY}/v1781006162/FireShot_Capture_025_-_RealTaste_-_Restaurant_Orders_-_realtaste.pages.dev_vhjwln.png`;
const BIKE_URL = `${CLOUDINARY}/v1781005958/FireShot_Capture_024_-_SriRentABike_-_Bike_Rentals_in_Tangalle_Sri_Lanka_-_srirentabike.com_g7f0ue.png`;
const PIAGGIO_URL = `${CLOUDINARY}/v1781019892/screencapture-piaggio-streamlit-app-2026-06-09-21_13_53_avlfkb.png`;

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function makeTexture(width: number, height: number, draw: (ctx: CanvasRenderingContext2D) => void) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, width, height);
  draw(ctx);
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.minFilter = LinearFilter;
  texture.magFilter = LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

function createGlowTexture() {
  return makeTexture(512, 512, (ctx) => {
    const g = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
    g.addColorStop(0, "rgba(249,115,22,0.35)");
    g.addColorStop(0.45, "rgba(168,85,247,0.24)");
    g.addColorStop(1, "rgba(168,85,247,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 512, 512);
  });
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

async function createGlassTexture(url: string, w: number, h: number, radius: number): Promise<CanvasTexture> {
  const img = await loadImage(url);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  ctx.save();
  roundRect(ctx, 0, 0, w, h, radius);
  ctx.clip();
  ctx.drawImage(img, 0, 0, w, h);
  ctx.restore();

  roundRect(ctx, 0, 0, w, h, radius);
  ctx.strokeStyle = "rgba(255,255,255,0.05)";
  ctx.lineWidth = 1;
  ctx.stroke();

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.minFilter = LinearFilter;
  texture.magFilter = LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

function createPlane(texture: CanvasTexture, width: number, height: number, x: number, y: number, z: number) {
  const plane = new Mesh(
    new PlaneGeometry(width, height),
    new MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false }),
  );
  plane.position.set(x, y, z);
  return plane;
}

export async function initHeroScene(canvas: HTMLCanvasElement): Promise<() => void> {
  canvas.style.opacity = "0";
  canvas.style.transition = "opacity 0.8s ease";

  const scene = new Scene();
  const camera = new PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.set(0, 0.1, 8.6);

  const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const group = new Group();
  group.scale.set(0.78, 0.78, 0.78);
  scene.add(group);

  const glow = new Sprite(new SpriteMaterial({ map: createGlowTexture(), transparent: true, depthWrite: false }));
  glow.position.set(0.35, 0, -1.5);
  glow.scale.set(7.5, 7.5, 1);
  scene.add(glow);

  const [dashboardTex, phoneTex, restaurantTex, bikeTex, piaggioTex] = await Promise.all([
    createGlassTexture(DASHBOARD_URL, 1600, 946, 24),
    createGlassTexture(PHONE_URL, 380, 714, 18),
    createGlassTexture(RESTAURANT_URL, 640, 300, 16),
    createGlassTexture(BIKE_URL, 640, 300, 16),
    createGlassTexture(PIAGGIO_URL, 640, 300, 16),
  ]);

  const dashboard = createPlane(dashboardTex, 5.5, 3.25, -0.2, 0.1, 0);
  dashboard.rotation.y = -0.14;
  dashboard.rotation.x = 0.035;
  group.add(dashboard);

  const phone = createPlane(phoneTex, 1.25, 2.35, 2.45, -0.45, 0.55);
  phone.rotation.y = -0.28;
  phone.rotation.z = -0.035;
  group.add(phone);

  const inventory = createPlane(restaurantTex, 2.25, 1.05, -2.55, 1.75, 0.72);
  inventory.rotation.y = 0.18;
  inventory.rotation.z = -0.025;
  group.add(inventory);

  const pos = createPlane(bikeTex, 2.25, 1.05, -2.35, -1.75, 0.78);
  pos.rotation.y = 0.12;
  pos.rotation.z = 0.035;
  group.add(pos);

  const web = createPlane(piaggioTex, 2.1, 0.98, 1.65, 1.85, 0.68);
  web.rotation.y = -0.24;
  web.rotation.z = 0.025;
  group.add(web);

  const planes = [dashboard, phone, inventory, pos, web];

  const particlePositions = new Float32Array(120 * 3);
  for (let i = 0; i < 120; i++) {
    particlePositions[i * 3] = (Math.random() - 0.5) * 10;
    particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 6.5;
    particlePositions[i * 3 + 2] = -1.8 - Math.random() * 3;
  }
  const particleGeo = new BufferGeometry();
  particleGeo.setAttribute("position", new Float32BufferAttribute(particlePositions, 3));
  const particles = new Points(
    particleGeo,
    new PointsMaterial({
      color: new Color("#d8b4fe"),
      size: 0.04,
      transparent: true,
      opacity: 0.32,
      blending: AdditiveBlending,
      depthWrite: false,
    }),
  );
  scene.add(particles);

  canvas.style.opacity = "1";

  const mouse = new Vector2(0, 0);
  const target = new Vector2(0, 0);
  let raf = 0;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const width = Math.max(rect.width, 1);
    const height = Math.max(rect.height, 1);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
  }

  function onMouseMove(event: MouseEvent) {
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
  }

  function animate(time: number) {
    const t = time * 0.001;
    target.x += (mouse.x - target.x) * 0.045;
    target.y += (mouse.y - target.y) * 0.045;

    group.rotation.y = target.x * 0.1 + Math.sin(t * 0.25) * 0.025;
    group.rotation.x = -target.y * 0.05 + Math.sin(t * 0.3) * 0.018;
    particles.rotation.y = t * 0.035;
    particles.rotation.x = Math.sin(t * 0.2) * 0.05;
    glow.material.opacity = 0.82 + Math.sin(t * 0.7) * 0.08;

    for (let i = 0; i < planes.length; i++) {
      planes[i].position.y += Math.sin(t * 0.85 + i * 1.7) * 0.0009;
      planes[i].position.z += Math.cos(t * 0.7 + i * 1.2) * 0.00055;
    }

    renderer.render(scene, camera);
    raf = requestAnimationFrame(animate);
  }

  resize();
  window.addEventListener("resize", resize);
  canvas.addEventListener("mousemove", onMouseMove);
  raf = requestAnimationFrame(animate);

  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener("resize", resize);
    canvas.removeEventListener("mousemove", onMouseMove);
    renderer.dispose();
    particleGeo.dispose();
    const particleMaterial = particles.material;
    if (!Array.isArray(particleMaterial)) particleMaterial.dispose();
    const glowMaterial = glow.material;
    if (!Array.isArray(glowMaterial)) {
      glowMaterial.map?.dispose();
      glowMaterial.dispose();
    }
    for (const plane of planes) {
      plane.geometry.dispose();
      plane.material.map?.dispose();
      plane.material.dispose();
    }
  };
}
