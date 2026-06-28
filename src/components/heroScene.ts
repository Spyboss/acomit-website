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
  Vector2,
  WebGLRenderer,
} from "three";

type PlaneItem = Mesh<PlaneGeometry, MeshBasicMaterial>;

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
  texture.minFilter = LinearFilter;
  texture.magFilter = LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

function createDashboardTexture() {
  return makeTexture(1280, 760, (ctx) => {
    const w = 1280;
    const h = 760;
    const bg = ctx.createLinearGradient(0, 0, w, h);
    bg.addColorStop(0, "rgba(255,255,255,0.22)");
    bg.addColorStop(0.45, "rgba(255,255,255,0.10)");
    bg.addColorStop(1, "rgba(59,7,100,0.42)");

    ctx.shadowColor = "rgba(168,85,247,0.45)";
    ctx.shadowBlur = 46;
    roundRect(ctx, 30, 30, w - 60, h - 60, 42);
    ctx.fillStyle = bg;
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgba(255,255,255,0.24)";
    ctx.stroke();

    ctx.fillStyle = "rgba(18,9,40,0.72)";
    roundRect(ctx, 56, 58, w - 112, 70, 26);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.font = "800 30px Plus Jakarta Sans, Inter, Arial, sans-serif";
    ctx.fillText("Acom Business Suite", 92, 104);
    ctx.fillStyle = "rgba(216,180,254,0.82)";
    ctx.font = "500 18px Inter, Arial, sans-serif";
    ctx.fillText("Inventory • POS • Welfare • Reporting", 396, 103);

    const status = ctx.createLinearGradient(960, 76, 1140, 110);
    status.addColorStop(0, "#f97316");
    status.addColorStop(1, "#fb923c");
    ctx.fillStyle = status;
    roundRect(ctx, 1008, 76, 162, 34, 17);
    ctx.fill();
    ctx.fillStyle = "white";
    ctx.font = "700 16px Inter, Arial, sans-serif";
    ctx.fillText("LIVE SYSTEM", 1035, 99);

    const kpis = [
      ["Today Sales", "Rs. 428K", "↑ 18%"],
      ["Inventory", "12,480", "SKU active"],
      ["Orders", "348", "synced"],
    ];
    for (let i = 0; i < kpis.length; i++) {
      const x = 76 + i * 264;
      ctx.fillStyle = "rgba(255,255,255,0.10)";
      roundRect(ctx, x, 160, 230, 116, 28);
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.14)";
      ctx.stroke();
      ctx.fillStyle = "rgba(216,180,254,0.9)";
      ctx.font = "600 18px Inter, Arial, sans-serif";
      ctx.fillText(kpis[i][0], x + 24, 197);
      ctx.fillStyle = "#ffffff";
      ctx.font = "800 34px Plus Jakarta Sans, Inter, Arial, sans-serif";
      ctx.fillText(kpis[i][1], x + 24, 240);
      ctx.fillStyle = i === 0 ? "#fb923c" : "rgba(255,255,255,0.62)";
      ctx.font = "600 15px Inter, Arial, sans-serif";
      ctx.fillText(kpis[i][2], x + 24, 262);
    }

    ctx.fillStyle = "rgba(255,255,255,0.09)";
    roundRect(ctx, 76, 314, 684, 312, 32);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.12)";
    ctx.stroke();
    ctx.fillStyle = "#ffffff";
    ctx.font = "800 24px Plus Jakarta Sans, Inter, Arial, sans-serif";
    ctx.fillText("Sales & Stock Movement", 112, 362);

    const chartBase = 560;
    const bars = [96, 148, 122, 204, 176, 248, 220, 280];
    for (let i = 0; i < bars.length; i++) {
      const x = 124 + i * 72;
      const bar = ctx.createLinearGradient(0, chartBase - bars[i], 0, chartBase);
      bar.addColorStop(0, i % 2 ? "#fb923c" : "#c084fc");
      bar.addColorStop(1, "rgba(168,85,247,0.22)");
      ctx.fillStyle = bar;
      roundRect(ctx, x, chartBase - bars[i], 34, bars[i], 16);
      ctx.fill();
    }
    ctx.strokeStyle = "rgba(255,255,255,0.12)";
    ctx.lineWidth = 2;
    for (let y = 410; y <= 560; y += 50) {
      ctx.beginPath();
      ctx.moveTo(112, y);
      ctx.lineTo(710, y);
      ctx.stroke();
    }

    ctx.fillStyle = "rgba(255,255,255,0.09)";
    roundRect(ctx, 802, 160, 392, 466, 32);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.12)";
    ctx.stroke();
    ctx.fillStyle = "#ffffff";
    ctx.font = "800 24px Plus Jakarta Sans, Inter, Arial, sans-serif";
    ctx.fillText("Recent Business Activity", 838, 208);

    const rows = [
      ["POS invoice synced", "Just now", "#fb923c"],
      ["Inventory reorder alert", "8 min", "#c084fc"],
      ["Mobile field update", "22 min", "#a855f7"],
      ["Web portal request", "1 hr", "#fb923c"],
      ["Welfare payment batch", "2 hr", "#c084fc"],
    ];
    for (let i = 0; i < rows.length; i++) {
      const y = 250 + i * 66;
      ctx.fillStyle = "rgba(255,255,255,0.08)";
      roundRect(ctx, 836, y, 322, 48, 18);
      ctx.fill();
      ctx.fillStyle = rows[i][2];
      ctx.beginPath();
      ctx.arc(862, y + 24, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.9)";
      ctx.font = "600 17px Inter, Arial, sans-serif";
      ctx.fillText(rows[i][0], 884, y + 22);
      ctx.fillStyle = "rgba(216,180,254,0.68)";
      ctx.font = "500 13px Inter, Arial, sans-serif";
      ctx.fillText(rows[i][1], 884, y + 40);
    }
  });
}

function createPhoneTexture() {
  return makeTexture(460, 860, (ctx) => {
    const w = 460;
    const h = 860;
    ctx.shadowColor = "rgba(249,115,22,0.42)";
    ctx.shadowBlur = 40;
    roundRect(ctx, 34, 22, w - 68, h - 44, 72);
    ctx.fillStyle = "rgba(15,8,34,0.96)";
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.lineWidth = 4;
    ctx.strokeStyle = "rgba(255,255,255,0.2)";
    ctx.stroke();
    roundRect(ctx, 72, 76, w - 144, 42, 21);
    ctx.fillStyle = "rgba(255,255,255,0.12)";
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.font = "800 34px Plus Jakarta Sans, Inter, Arial, sans-serif";
    ctx.fillText("Field App", 74, 176);
    ctx.fillStyle = "rgba(216,180,254,0.78)";
    ctx.font = "500 18px Inter, Arial, sans-serif";
    ctx.fillText("Live order updates", 76, 208);

    ctx.fillStyle = "rgba(249,115,22,0.22)";
    roundRect(ctx, 72, 250, 316, 116, 30);
    ctx.fill();
    ctx.fillStyle = "#fb923c";
    ctx.font = "800 46px Plus Jakarta Sans, Inter, Arial, sans-serif";
    ctx.fillText("42", 104, 316);
    ctx.fillStyle = "rgba(255,255,255,0.82)";
    ctx.font = "600 18px Inter, Arial, sans-serif";
    ctx.fillText("deliveries in progress", 176, 313);

    const items = ["Collect payment", "Update stock", "Send invoice", "Customer visit"];
    for (let i = 0; i < items.length; i++) {
      const y = 416 + i * 82;
      ctx.fillStyle = "rgba(255,255,255,0.08)";
      roundRect(ctx, 72, y, 316, 58, 20);
      ctx.fill();
      ctx.fillStyle = i % 2 ? "#c084fc" : "#fb923c";
      ctx.beginPath();
      ctx.arc(104, y + 29, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.9)";
      ctx.font = "600 19px Inter, Arial, sans-serif";
      ctx.fillText(items[i], 130, y + 36);
    }
  });
}

function createMiniCardTexture(title: string, subtitle: string, color: string) {
  return makeTexture(640, 300, (ctx) => {
    const bg = ctx.createLinearGradient(0, 0, 640, 300);
    bg.addColorStop(0, "rgba(255,255,255,0.18)");
    bg.addColorStop(1, "rgba(255,255,255,0.07)");
    ctx.shadowColor = color.replace("1)", "0.45)");
    ctx.shadowBlur = 34;
    roundRect(ctx, 24, 24, 592, 252, 34);
    ctx.fillStyle = bg;
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = "rgba(255,255,255,0.18)";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = color;
    roundRect(ctx, 58, 58, 72, 72, 24);
    ctx.fill();
    ctx.fillStyle = "white";
    ctx.font = "800 38px Plus Jakarta Sans, Inter, Arial, sans-serif";
    ctx.fillText(title, 58, 180);
    ctx.fillStyle = "rgba(216,180,254,0.78)";
    ctx.font = "500 22px Inter, Arial, sans-serif";
    ctx.fillText(subtitle, 60, 218);
    for (let i = 0; i < 5; i++) {
      ctx.fillStyle = i < 3 ? color : "rgba(255,255,255,0.16)";
      roundRect(ctx, 400 + i * 28, 74 + i * 24, 86, 10, 5);
      ctx.fill();
    }
  });
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

function createPlane(texture: CanvasTexture, width: number, height: number, x: number, y: number, z: number): PlaneItem {
  const plane = new Mesh(
    new PlaneGeometry(width, height),
    new MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false }),
  );
  plane.position.set(x, y, z);
  return plane;
}

export function initHeroScene(canvas: HTMLCanvasElement): () => void {
  const scene = new Scene();
  const camera = new PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.set(0, 0.1, 8.4);

  const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const group = new Group();
  scene.add(group);

  const glow = new Sprite(new SpriteMaterial({ map: createGlowTexture(), transparent: true, depthWrite: false }));
  glow.position.set(0.35, 0, -1.5);
  glow.scale.set(7.5, 7.5, 1);
  scene.add(glow);

  const dashboard = createPlane(createDashboardTexture(), 5.5, 3.25, -0.2, 0.1, 0);
  dashboard.rotation.y = -0.14;
  dashboard.rotation.x = 0.035;
  group.add(dashboard);

  const phone = createPlane(createPhoneTexture(), 1.25, 2.35, 2.45, -0.45, 0.55);
  phone.rotation.y = -0.28;
  phone.rotation.z = -0.035;
  group.add(phone);

  const inventory = createPlane(createMiniCardTexture("Inventory", "Low stock alerts", "rgba(192,132,252,1)"), 2.25, 1.05, -2.55, 1.75, 0.72);
  inventory.rotation.y = 0.18;
  inventory.rotation.z = -0.025;
  group.add(inventory);

  const pos = createPlane(createMiniCardTexture("POS Billing", "Invoices synced", "rgba(249,115,22,1)"), 2.25, 1.05, -2.35, -1.75, 0.78);
  pos.rotation.y = 0.12;
  pos.rotation.z = 0.035;
  group.add(pos);

  const web = createPlane(createMiniCardTexture("Web Portal", "Customer access", "rgba(168,85,247,1)"), 2.1, 0.98, 1.65, 1.85, 0.68);
  web.rotation.y = -0.24;
  web.rotation.z = 0.025;
  group.add(web);

  const planes = [dashboard, phone, inventory, pos, web];

  const particlePositions = new Float32Array(80 * 3);
  for (let i = 0; i < 80; i++) {
    particlePositions[i * 3] = (Math.random() - 0.5) * 7.8;
    particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 5;
    particlePositions[i * 3 + 2] = -1.8 - Math.random() * 2.5;
  }
  const particleGeo = new BufferGeometry();
  particleGeo.setAttribute("position", new Float32BufferAttribute(particlePositions, 3));
  const particles = new Points(
    particleGeo,
    new PointsMaterial({
      color: new Color("#d8b4fe"),
      size: 0.035,
      transparent: true,
      opacity: 0.38,
      blending: AdditiveBlending,
      depthWrite: false,
    }),
  );
  scene.add(particles);

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
