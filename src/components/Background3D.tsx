import { useMemo, useRef } from "react";
import type { ComponentType } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Float, Lightformer } from "@react-three/drei";
import * as THREE from "three";

const H = 7.3; // altura visível (unidades) a z=0
const gold = { color: "#C8A04A", metalness: 1, roughness: 0.22 };
const white = { color: "#F7F8FC", roughness: 0.4, clearcoat: 0.6 };

function extrude(shape: THREE.Shape, depth: number, bevel = 0.05) {
  const g = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 4, curveSegments: 24 });
  g.center();
  return g;
}
function poly(pts: number[][]) {
  const s = new THREE.Shape();
  pts.forEach(([x, y], i) => (i ? s.lineTo(x, y) : s.moveTo(x, y)));
  return s;
}

// Bola de vôlei: listras em espiral (branco, azul, amarelo) com costuras
let volleyTex: THREE.CanvasTexture | null = null;
function getVolleyTex() {
  if (volleyTex) return volleyTex;
  const W = 1024, Hh = 512, c = document.createElement("canvas");
  c.width = W; c.height = Hh;
  const ctx = c.getContext("2d")!, img = ctx.createImageData(W, Hh);
  const cols = [[247, 248, 252], [63, 107, 203], [240, 200, 80]];
  for (let y = 0; y < Hh; y++) for (let x = 0; x < W; x++) {
    const v = ((x / W) * 2 * Math.PI + 2.4 * Math.cos((y / Hh) * Math.PI)) / (2 * Math.PI) * 6;
    const f = v - Math.floor(v), col = f < 0.035 || f > 0.965 ? [40, 50, 90] : cols[((Math.floor(v) % 3) + 3) % 3];
    const k = (y * W + x) * 4;
    img.data[k] = col[0]; img.data[k + 1] = col[1]; img.data[k + 2] = col[2]; img.data[k + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  volleyTex = new THREE.CanvasTexture(c);
  volleyTex.colorSpace = THREE.SRGBColorSpace;
  return volleyTex;
}
function Volley() {
  return <mesh><sphereGeometry args={[1, 64, 64]} /><meshPhysicalMaterial map={getVolleyTex()} roughness={0.45} clearcoat={0.5} /></mesh>;
}

function Sneaker() {
  const upper = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-1, 0); s.lineTo(-1.05, 0.6); s.quadraticCurveTo(-1, 1, -0.7, 1); s.lineTo(-0.4, 0.95);
    s.quadraticCurveTo(-0.2, 0.7, 0.05, 0.65); s.quadraticCurveTo(0.6, 0.55, 0.95, 0.3);
    s.quadraticCurveTo(1.25, 0.15, 1.25, 0); s.lineTo(-1, 0);
    const g = extrude(s, 0.7, 0.07); g.translate(0, 0.5, 0); return g;
  }, []);
  const sole = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-1.1, -0.3); s.lineTo(1.25, -0.3); s.quadraticCurveTo(1.5, -0.3, 1.4, -0.02); s.lineTo(-1.1, -0.02); s.lineTo(-1.1, -0.3);
    const g = extrude(s, 0.8, 0.06); g.translate(0.05, -0.16, 0); return g;
  }, []);
  return (
    <group position={[0, -0.2, 0]}>
      <mesh geometry={sole}><meshPhysicalMaterial {...white} /></mesh>
      <mesh geometry={upper}><meshPhysicalMaterial {...white} /></mesh>
      <mesh position={[-1.05, 0.55, 0]}><boxGeometry args={[0.14, 0.5, 0.5]} /><meshPhysicalMaterial color="#3F6BCB" roughness={0.4} clearcoat={0.6} /></mesh>
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} position={[-0.25 + i * 0.22, 0.72 - i * 0.07, 0]} rotation={[0, 0, -0.3]}><boxGeometry args={[0.07, 0.05, 0.62]} /><meshStandardMaterial {...gold} /></mesh>
      ))}
    </group>
  );
}

const cloth = (color: string) => ({ color, roughness: 0.55, clearcoat: 0.2, sheen: 1, sheenColor: "#fff" });
function Dress() {
  const pts = useMemo(() => [[0.1, 1.4], [0.2, 1], [0.16, 0.7], [0.28, 0.58], [0.5, 0.1], [0.85, -0.8], [0.86, -0.82]].map(([x, y]) => new THREE.Vector2(x, y)), []);
  return <mesh><latheGeometry args={[pts, 48]} /><meshPhysicalMaterial {...cloth("#E9A9B8")} side={THREE.DoubleSide} /></mesh>;
}
function Skirt() {
  return <mesh><cylinderGeometry args={[0.35, 0.85, 0.7, 48, 1, true]} /><meshPhysicalMaterial {...cloth("#B9A6E3")} side={THREE.DoubleSide} /></mesh>;
}
function Tshirt() {
  const g = useMemo(() => {
    const s = poly([[-0.35, 1], [-0.9, 0.75], [-1.15, 0.25], [-0.8, 0.05], [-0.65, 0.3], [-0.65, -0.9], [0.65, -0.9], [0.65, 0.3], [0.8, 0.05], [1.15, 0.25], [0.9, 0.75], [0.35, 1]]);
    s.quadraticCurveTo(0, 0.55, -0.35, 1);
    return extrude(s, 0.18, 0.06);
  }, []);
  return <mesh geometry={g}><meshPhysicalMaterial {...cloth("#F7F8FC")} /></mesh>;
}
function Pants() {
  const g = useMemo(() => extrude(poly([[-0.6, 1], [0.6, 1], [0.7, -1.2], [0.1, -1.2], [0, -0.1], [-0.1, -1.2], [-0.7, -1.2]]), 0.2, 0.05), []);
  return <mesh geometry={g}><meshPhysicalMaterial {...cloth("#6F8FCF")} /></mesh>;
}

function Perfume() {
  return (
    <group>
      <mesh><boxGeometry args={[0.95, 1.2, 0.5]} /><meshPhysicalMaterial color="#5B86E0" transparent opacity={0.8} roughness={0.05} clearcoat={1} /></mesh>
      <mesh position={[0, 0.72, 0]}><cylinderGeometry args={[0.14, 0.14, 0.25, 24]} /><meshStandardMaterial {...gold} /></mesh>
      <mesh position={[0, 0.98, 0]}><cylinderGeometry args={[0.28, 0.28, 0.3, 24]} /><meshStandardMaterial {...gold} /></mesh>
    </group>
  );
}
function Lipstick() {
  return (
    <group>
      <mesh><cylinderGeometry args={[0.32, 0.32, 0.7, 28]} /><meshStandardMaterial {...gold} /></mesh>
      <mesh position={[0, 0.5, 0]}><cylinderGeometry args={[0.25, 0.25, 0.4, 28]} /><meshPhysicalMaterial color="#C0304A" clearcoat={1} roughness={0.3} /></mesh>
      <mesh position={[0, 0.8, 0]}><coneGeometry args={[0.25, 0.28, 28]} /><meshPhysicalMaterial color="#C0304A" clearcoat={1} roughness={0.3} /></mesh>
    </group>
  );
}
function Balloon() {
  return (
    <group>
      <mesh><sphereGeometry args={[0.8, 48, 48]} /><meshPhysicalMaterial color="#5B86E0" metalness={0.15} roughness={0.12} clearcoat={1} envMapIntensity={1.6} /></mesh>
      <mesh position={[0, -0.85, 0]} rotation={[Math.PI, 0, 0]}><coneGeometry args={[0.1, 0.18, 12]} /><meshStandardMaterial color="#5B86E0" /></mesh>
    </group>
  );
}

const kinds: ComponentType[] = [Volley, Perfume, Dress, Sneaker, Tshirt, Lipstick, Pants, Balloon, Skirt];
interface Item { K: ComponentType; x: number; y: number; z: number; s: number; rs: number; rot: [number, number, number] }

function Spin({ it }: { it: Item }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, d) => {
    if (!ref.current) return;
    ref.current.rotation.y += d * it.rs;
    ref.current.rotation.x += d * it.rs * 0.2;
  });
  const K = it.K;
  return (
    <Float speed={1.5} floatIntensity={1.2} rotationIntensity={0.2}>
      <group position={[it.x, it.y, it.z]} scale={it.s}>
        <group ref={ref} rotation={it.rot}><K /></group>
      </group>
    </Float>
  );
}

function Items() {
  const items = useMemo<Item[]>(
    () =>
      Array.from({ length: 28 }, (_, i) => {
        const r = (n: number) => { const s = Math.sin(i * 97.1 + n * 13.7) * 10000; return s - Math.floor(s); };
        return { K: kinds[i % kinds.length], x: (i % 2 ? 1 : -1) * (1.1 + r(1) * 1.4), y: -i * 1.5 - r(2), z: -2.5 + r(3) * 5, s: 0.45 + r(4) * 0.35, rs: 0.2 + r(5) * 0.4, rot: [r(6) * 0.8, r(7) * 6, 0] };
      }),
    [],
  );
  return <>{items.map((it, i) => <Spin key={i} it={it} />)}</>;
}

function Rig() {
  const { camera, pointer } = useThree();
  useFrame(() => {
    const t = -(window.scrollY / window.innerHeight) * H;
    camera.position.y += (t - camera.position.y) * 0.08;
    camera.position.x += (pointer.x * 0.4 - camera.position.x) * 0.05;
  });
  return null;
}

export default function Background3D() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return null;
  return (
    <Canvas camera={{ position: [0, 0, 10], fov: 40 }} dpr={[1, 1.5]} style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
      <ambientLight intensity={0.7} />
      <directionalLight position={[3, 5, 4]} intensity={2} color="#fff3d6" />
      <Environment resolution={256}>
        <Lightformer form="rect" intensity={1.2} color="#cfe0ff" position={[0, 0, -8]} scale={[30, 30, 1]} />
        <Lightformer form="rect" intensity={4} position={[0, 5, -5]} scale={[10, 4, 1]} />
        <Lightformer form="rect" intensity={2} color="#8FB0DE" position={[-5, 0, 2]} rotation-y={Math.PI / 2} scale={[6, 6, 1]} />
        <Lightformer form="circle" intensity={3} color="#EAD59A" position={[5, 1, 3]} scale={3} />
      </Environment>
      <Items />
      <Rig />
    </Canvas>
  );
}
