import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Float, Lightformer, useGLTF } from "@react-three/drei";
import * as THREE from "three";

const H = 7.3; // altura visível (unidades) a z=0

// 1. Liste aqui os caminhos de todos os arquivos .glb que você colocou na pasta public/models
const glbFiles = [
  "/models/blue_dress.glb",
  "/models/sneaker_b33.glb",
  "/models/lipstick.glb",
  "/models/unnamed_volleyball.glb",
  "/models/coco_mademoiselle_chanel_paris_parfum.glb",
];

// Componente para carregar e instanciar os modelos
function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  // Precisamos clonar a cena para poder repetir o mesmo modelo várias vezes na tela
  const clonedScene = useMemo(() => scene.clone(), [scene]);
  return <primitive object={clonedScene} />;
}

interface Item {
  url: string;
  x: number;
  y: number;
  z: number;
  s: number;
  rs: number;
  rot: [number, number, number];
}

function Spin({ it }: { it: Item }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, d) => {
    if (!ref.current) return;
    ref.current.rotation.y += d * it.rs;
    ref.current.rotation.x += d * it.rs * 0.2;
  });

  return (
    <Float speed={1.5} floatIntensity={1.2} rotationIntensity={0.2}>
      <group position={[it.x, it.y, it.z]} scale={it.s}>
        <group ref={ref} rotation={it.rot}>
          {/* Renderiza o modelo GLB de acordo com a URL */}
          <Model url={it.url} />
        </group>
      </group>
    </Float>
  );
}

function Items() {
  const items = useMemo<Item[]>(
    () =>
      Array.from({ length: 28 }, (_, i) => {
        const r = (n: number) => {
          const s = Math.sin(i * 97.1 + n * 13.7) * 10000;
          return s - Math.floor(s);
        };
        return {
          url: glbFiles[i % glbFiles.length], // Puxa os modelos da sua lista rotativamente
          x: (i % 2 ? 1 : -1) * (1.1 + r(1) * 1.4),
          y: -i * 1.5 - r(2),
          z: -2.5 + r(3) * 5,
          s: 0.45 + r(4) * 0.35, // Se seus modelos ficarem muito grandes ou pequenos, altere a escala base (0.45) aqui
          rs: 0.2 + r(5) * 0.4,
          rot: [r(6) * 0.8, r(7) * 6, 0],
        };
      }),
    []
  );

  return (
    <>
      {items.map((it, i) => (
        <Spin key={i} it={it} />
      ))}
    </>
  );
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
    <Canvas
      camera={{ position: [0, 0, 10], fov: 40 }}
      dpr={[1, 1.5]}
      style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}
    >
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

// Opcional: Para evitar carregamento lento quando abrir o site, você pode pré-carregar os modelos
glbFiles.forEach((url) => useGLTF.preload(url));