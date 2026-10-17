import { useMemo, useRef } from "react";
import type { ComponentType } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Float, Lightformer } from "@react-three/drei";
import * as THREE from "three";

const H = 7.3; // altura visível (unidades) a z=0
const gold = { color: "#C8A04A", metalness: 1, roughness: 0.22 };
const pearl = { color: "#F7F8FC", roughness: 0.35, clearcoat: 1 };

function Volley() {
  return (
    <group>
      <mesh><sphereGeometry args={[1, 48, 48]} /><meshPhysicalMaterial {...pearl} /></mesh>
      {([[0, 0, 0], [Math.PI / 2, 0, 0], [0, Math.PI / 2, 0]] as const).map((r, i) => (
        <mesh key={i} rotation={[r[0], r[1], r[2]]}><torusGeometry args={[1.01, 0.02, 8, 72]} /><meshStandardMaterial {...gold} /></mesh>
      ))}
    </group>
  );
}
function Perfume() {
  return (
    <group>
      <mesh><boxGeometry args={[0.95, 1.2, 0.5]} /><meshPhysicalMaterial color="#3F6BCB" transparent opacity={0.75} roughness={0.05} clearcoat={1} /></mesh>
      <mesh position={[0, 0.72, 0]}><cylinderGeometry args={[0.14, 0.14, 0.25, 24]} /><meshStandardMaterial {...gold} /></mesh>
      <mesh position={[0, 0.98, 0]}><cylinderGeometry args={[0.28, 0.28, 0.3, 24]} /><meshStandardMaterial {...gold} /></mesh>
    </group>
  );
}
function Dress() {
  const pts = useMemo(() => [[0.12, 1.3], [0.22, 0.9], [0.17, 0.65], [0.3, 0.55], [0.55, 0], [0.9, -0.8]].map(([x, y]) => new THREE.Vector2(x, y)), []);
  return <mesh><latheGeometry args={[pts, 40]} /><meshPhysicalMaterial color="#2A55C0" side={THREE.DoubleSide} sheen={1} sheenColor="#8FB0DE" roughness={0.6} /></mesh>;
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
function Sneaker() {
  return (
    <group>
      <mesh position={[0, -0.3, 0]}><boxGeometry args={[2.2, 0.25, 0.8]} /><meshPhysicalMaterial {...pearl} /></mesh>
      <mesh position={[0.5, 0, 0]} scale={[1.2, 0.7, 1]}><sphereGeometry args={[0.55, 32, 32]} /><meshPhysicalMaterial {...pearl} /></mesh>
      <mesh position={[-0.55, 0.15, 0]}><boxGeometry args={[0.9, 0.8, 0.75]} /><meshPhysicalMaterial color="#3F6BCB" roughness={0.4} clearcoat={0.8} /></mesh>
      <mesh position={[0, -0.14, 0.41]}><boxGeometry args={[1.6, 0.06, 0.02]} /><meshStandardMaterial {...gold} /></mesh>
    </group>
  );
}
function Balloon() {
  return (
    <group>
      <mesh><sphereGeometry args={[0.8, 40, 40]} /><meshPhysicalMaterial color="#3F6BCB" metalness={0.9} roughness={0.12} clearcoat={1} /></mesh>
      <mesh position={[0, -0.85, 0]} rotation={[Math.PI, 0, 0]}><coneGeometry args={[0.1, 0.18, 12]} /><meshStandardMaterial color="#3F6BCB" /></mesh>
    </group>
  );
}

const kinds: ComponentType[] = [Volley, Perfume, Dress, Lipstick, Sneaker, Balloon];
interface Item { K: ComponentType; x: number; y: number; z: number; s: number; rs: number; rot: [number, number, number] }

function Spin({ it }: { it: Item }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, d) => {
    if (!ref.current) return;
    ref.current.rotation.y += d * it.rs;
    ref.current.rotation.x += d * it.rs * 0.3;
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
        return { K: kinds[i % kinds.length], x: (i % 2 ? 1 : -1) * (1.1 + r(1) * 1.4), y: -i * 1.5 - r(2), z: -2.5 + r(3) * 5, s: 0.4 + r(4) * 0.35, rs: 0.2 + r(5) * 0.5, rot: [r(6) * 6, r(7) * 6, 0] };
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
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 5, 4]} intensity={2} color="#fff3d6" />
      <Environment resolution={256}>
        <Lightformer form="rect" intensity={4} position={[0, 5, -5]} scale={[10, 4, 1]} />
        <Lightformer form="rect" intensity={2} color="#8FB0DE" position={[-5, 0, 2]} rotation-y={Math.PI / 2} scale={[6, 6, 1]} />
        <Lightformer form="circle" intensity={3} color="#EAD59A" position={[5, 1, 3]} scale={3} />
      </Environment>
      <Items />
      <Rig />
    </Canvas>
  );
}
