import {
  AdditiveBlending,
  BufferGeometry,
  CanvasTexture,
  Color,
  Float32BufferAttribute,
  Group,
  LineBasicMaterial,
  LineSegments,
  LinearFilter,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Scene,
  Sprite,
  SpriteMaterial,
  Vector2,
  WebGLRenderer,
} from "three";

type CardConfig = {
  title: string;
  subtitle: string;
  eyebrow: string;
  color: string;
  glow: string;
  x: number;
  y: number;
  z: number;
};

type CardSprite = Sprite & { userData: { baseY: number; phase: number } };

const cards: CardConfig[] = [
  {
    eyebrow: "01",
    title: "Software Systems",
    subtitle: "ERP, inventory, workflow",
    color: "#c084fc",
    glow: "rgba(192,132,252,0.5)",
    x: -2.75,
    y: 1.55,
    z: 0.2,
  },
  {
    eyebrow: "02",
    title: "Web Platforms",
    subtitle: "Fast, secure business sites",
    color: "#f97316",
    glow: "rgba(249,115,22,0.45)",
    x: 2.65,
    y: 1.25,
    z: -0.25,
  },
  {
    eyebrow: "03",
    title: "Mobile Apps",
    subtitle: "Android, iOS, field teams",
    color: "#a855f7",
    glow: "rgba(168,85,247,0.45)",
    x: -2.45,
    y: -1.35,
    z: -0.15,
  },
  {
    eyebrow: "04",
    title: "Business Products",
    subtitle: "POS, billing, welfare tools",
    color: "#fb923c",
    glow: "rgba(251,146,60,0.45)",
    x: 2.35,
    y: -1.55,
    z: 0.15,
  },
];

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function createCardTexture(config: CardConfig, isHub = false) {
  const canvas = document.createElement("canvas");
  canvas.width = 768;
  canvas.height = isHub ? 360 : 320;
  const ctx = canvas.getContext("2d")!;

  const w = canvas.width;
  const h = canvas.height;
  ctx.clearRect(0, 0, w, h);

  const bg = ctx.createLinearGradient(0, 0, w, h);
  bg.addColorStop(0, "rgba(255,255,255,0.18)");
  bg.addColorStop(0.45, "rgba(255,255,255,0.08)");
  bg.addColorStop(1, "rgba(59,7,100,0.35)");

  ctx.shadowColor = config.glow;
  ctx.shadowBlur = 42;
  roundRect(ctx, 28, 28, w - 56, h - 56, 42);
  ctx.fillStyle = bg;
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.lineWidth = 2;
  ctx.strokeStyle = "rgba(255,255,255,0.22)";
  ctx.stroke();

  ctx.fillStyle = config.color;
  roundRect(ctx, 58, 58, isHub ? 112 : 92, 48, 24);
  ctx.fill();

  ctx.fillStyle = "rgba(255,255,255,0.92)";
  ctx.font = "700 24px Inter, Arial, sans-serif";
  ctx.fillText(config.eyebrow, 82, 91);

  ctx.fillStyle = "rgba(255,255,255,0.96)";
  ctx.font = `${isHub ? "800 52px" : "800 44px"} Plus Jakarta Sans, Inter, Arial, sans-serif`;
  ctx.fillText(config.title, 58, isHub ? 178 : 160);

  ctx.fillStyle = "rgba(216,180,254,0.86)";
  ctx.font = `${isHub ? "500 26px" : "500 24px"} Inter, Arial, sans-serif`;
  ctx.fillText(config.subtitle, 60, isHub ? 222 : 206);

  // Small UI rows make the cards read as software screens, not random labels.
  for (let i = 0; i < 3; i++) {
    const y = h - 104 + i * 22;
    ctx.fillStyle = i === 0 ? config.color : "rgba(255,255,255,0.18)";
    roundRect(ctx, 60, y, 170 + i * 46, 8, 4);
    ctx.fill();
  }

  const texture = new CanvasTexture(canvas);
  texture.minFilter = LinearFilter;
  texture.magFilter = LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

function createCard(config: CardConfig, scale = 1): CardSprite {
  const texture = createCardTexture(config);
  const material = new SpriteMaterial({ map: texture, transparent: true, depthWrite: false });
  const sprite = new Sprite(material) as CardSprite;
  sprite.position.set(config.x, config.y, config.z);
  sprite.scale.set(2.85 * scale, 1.18 * scale, 1);
  sprite.userData = { baseY: config.y, phase: Math.random() * Math.PI * 2 };
  return sprite;
}

function createHub(): CardSprite {
  const texture = createCardTexture(
    {
      eyebrow: "ACOM",
      title: "Acom IT",
      subtitle: "Business software hub",
      color: "#f97316",
      glow: "rgba(249,115,22,0.55)",
      x: 0,
      y: 0,
      z: 0,
    },
    true,
  );
  const material = new SpriteMaterial({ map: texture, transparent: true, depthWrite: false });
  const sprite = new Sprite(material) as CardSprite;
  sprite.position.set(0, 0, 0.35);
  sprite.scale.set(3.25, 1.52, 1);
  sprite.userData = { baseY: 0, phase: 0 };
  return sprite;
}

export function initHeroScene(canvas: HTMLCanvasElement): () => void {
  const scene = new Scene();
  const camera = new PerspectiveCamera(44, 1, 0.1, 100);
  camera.position.set(0, 0.1, 8.2);

  const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const group = new Group();
  scene.add(group);

  const hub = createHub();
  const cardSprites = cards.map((card) => createCard(card));
  group.add(hub, ...cardSprites);

  const linePositions = new Float32Array(cards.length * 2 * 3);
  const lineGeo = new BufferGeometry();
  lineGeo.setAttribute("position", new Float32BufferAttribute(linePositions, 3));
  const lineMat = new LineBasicMaterial({
    color: new Color("#d8b4fe"),
    transparent: true,
    opacity: 0.28,
    blending: AdditiveBlending,
    depthWrite: false,
  });
  const lines = new LineSegments(lineGeo, lineMat);
  group.add(lines);

  const dotPositions = new Float32Array(64 * 3);
  for (let i = 0; i < 64; i++) {
    dotPositions[i * 3] = (Math.random() - 0.5) * 7;
    dotPositions[i * 3 + 1] = (Math.random() - 0.5) * 4.8;
    dotPositions[i * 3 + 2] = -1.4 - Math.random() * 2;
  }
  const dotsGeo = new BufferGeometry();
  dotsGeo.setAttribute("position", new Float32BufferAttribute(dotPositions, 3));
  const dots = new Points(
    dotsGeo,
    new PointsMaterial({
      color: new Color("#fb923c"),
      size: 0.035,
      transparent: true,
      opacity: 0.5,
      blending: AdditiveBlending,
      depthWrite: false,
    }),
  );
  scene.add(dots);

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
    target.x += (mouse.x - target.x) * 0.04;
    target.y += (mouse.y - target.y) * 0.04;

    group.rotation.y = target.x * 0.16 + Math.sin(t * 0.35) * 0.035;
    group.rotation.x = -target.y * 0.08 + Math.sin(t * 0.28) * 0.025;
    dots.rotation.y = t * 0.035;

    hub.position.y = Math.sin(t * 0.75) * 0.045;
    for (const [index, card] of cardSprites.entries()) {
      card.position.y = card.userData.baseY + Math.sin(t * 0.9 + card.userData.phase) * 0.08;
      card.position.z = cards[index].z + Math.cos(t * 0.65 + card.userData.phase) * 0.06;
    }

    const positions = lineGeo.attributes.position.array as Float32Array;
    for (let i = 0; i < cardSprites.length; i++) {
      const card = cardSprites[i];
      const idx = i * 6;
      positions[idx] = hub.position.x;
      positions[idx + 1] = hub.position.y;
      positions[idx + 2] = hub.position.z - 0.08;
      positions[idx + 3] = card.position.x;
      positions[idx + 4] = card.position.y;
      positions[idx + 5] = card.position.z - 0.08;
    }
    lineGeo.attributes.position.needsUpdate = true;

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
    lineGeo.dispose();
    lineMat.dispose();
    dotsGeo.dispose();
    const dotsMaterial = dots.material;
    if (!Array.isArray(dotsMaterial)) dotsMaterial.dispose();
    for (const sprite of [hub, ...cardSprites]) {
      const material = sprite.material;
      if (!Array.isArray(material)) {
        material.map?.dispose();
        material.dispose();
      }
    }
  };
}
