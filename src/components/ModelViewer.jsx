import { Suspense, Component, useMemo, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Html, OrbitControls, useGLTF } from "@react-three/drei";
import {
  Box3,
  Color,
  DoubleSide,
  MeshStandardMaterial,
  Vector3,
} from "three";

const defaultModel = "/models/CAJAPARAWEB.glb";
const defaultPartDetails = {
  BOTON: {
    title: "Botón",
    dimensions: [["Ancho", "5 cm"]],
  },
  Cube: {
    title: "BOTE DE BASURA",
    dimensions: [],
  },
  MESA: {
    title: "Módulo inferior",
    dimensions: [["Ancho", "200 cm"], ["Alto", "80 cm"]],
  },
  SILLA: {
    title: "Silla",
    dimensions: [],
  },
};

const defaultFaceDetails = {
  front: {
    title: "PARED",
    dimensions: [["Ancho", "200 cm"], ["Alto", "200 cm"]],
    specifications: [["Tipo", "Pared lateral"]],
  },
  back: {
    title: "PARED",
    dimensions: [["Ancho", "200 cm"], ["Alto", "200 cm"]],
    specifications: [["Tipo", "Pared lateral"]],
  },
  right: {
    title: "PARED SENCILLA",
    dimensions: [
      ["Ancho", "200 cm"],
      ["Alto", "200 cm"],
    ],
    specifications: [["Tipo", "Cara sencilla"]],
  },
  left: {
    title: "PARED TV",
    dimensions: [
      ["Ancho", "200 cm"],
      ["Alto", "200 cm"],
    ],
    specifications: [
      ["Abertura TV", "73 × 43 cm"],
      ["Módulo inferior", "150 cm"],
    ],
  },
  top: {
    title: "PARED",
    dimensions: [
      ["Ancho total", "200 cm"],
      ["Alto", "200 cm"],
    ],
    specifications: [
      ["Módulo puerta", "120 cm"],
      ["Módulo lateral", "80 cm"],
    ],
  },
  bottom: {
    title: "SUELO",
    dimensions: [
      ["Ancho", "200 cm"],
      ["Profundidad", "200 cm"],
    ],
    specifications: [["Espesor", "16.8 cm"]],
  },
};

function getFaceKey(point, object) {
  const bounds = new Box3().setFromObject(object);
  const size = bounds.getSize(new Vector3());
  const distances = [
    ["left", Math.abs(point.x - bounds.min.x) / size.x],
    ["right", Math.abs(point.x - bounds.max.x) / size.x],
    ["bottom", Math.abs(point.y - bounds.min.y) / size.y],
    ["top", Math.abs(point.y - bounds.max.y) / size.y],
    ["back", Math.abs(point.z - bounds.min.z) / size.z],
    ["front", Math.abs(point.z - bounds.max.z) / size.z],
  ].sort((first, second) => first[1] - second[1]);

  return distances[0][0];
}

function createBoxMaterial() {
  const material = new MeshStandardMaterial({
    color: "#e8e1d3",
    roughness: 0.8,
    metalness: 0,
    side: DoubleSide,
  });

  material.onBeforeCompile = (shader) => {
    shader.uniforms.interiorColor = { value: new Color("#1f2226") };
    shader.uniforms.boxCenter = {
      value: material.userData.boxCenter ?? new Vector3(),
    };
    material.userData.shader = shader;
    shader.vertexShader = shader.vertexShader
      .replace(
        "#include <common>",
        "#include <common>\nvarying vec3 boxLocalPosition;\nvarying vec3 boxLocalNormal;",
      )
      .replace(
        "#include <begin_vertex>",
        "#include <begin_vertex>\nboxLocalPosition = transformed;\nboxLocalNormal = objectNormal;",
      );
    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        "#include <common>\nuniform vec3 interiorColor;\nuniform vec3 boxCenter;\nvarying vec3 boxLocalPosition;\nvarying vec3 boxLocalNormal;",
      )
      .replace(
        "#include <color_fragment>",
        "#include <color_fragment>\nvec3 fromCenter = boxLocalPosition - boxCenter;\nfloat interior = step(dot(normalize(boxLocalNormal), normalize(fromCenter)), 0.0);\nfloat grain = sin(boxLocalPosition.y * 18.0 + sin(boxLocalPosition.x * 2.5) * 2.0) * 0.035;\ndiffuseColor.rgb += vec3(grain);\nif (interior > 0.5) diffuseColor.rgb = interiorColor;",
      );
  };

  return material;
}

function createMaterial(color, roughness = 0.78) {
  return new MeshStandardMaterial({
    color,
    roughness,
    metalness: 0,
  });
}

function createButtonMaterial(object) {
  const material = createMaterial("#c9232d", 0.72);
  object.geometry.computeBoundingBox();
  const { min, max } = object.geometry.boundingBox;
  const baseLimit = min.y + (max.y - min.y) * 0.3;

  material.onBeforeCompile = (shader) => {
    shader.uniforms.baseLimit = { value: baseLimit };
    shader.vertexShader = shader.vertexShader.replace(
      "#include <common>",
      "#include <common>\nvarying vec3 buttonLocalPosition;",
    ).replace(
      "#include <begin_vertex>",
      "#include <begin_vertex>\nbuttonLocalPosition = transformed;",
    );
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <common>",
      "#include <common>\nuniform float baseLimit;\nvarying vec3 buttonLocalPosition;",
    ).replace(
      "#include <color_fragment>",
      "#include <color_fragment>\nif (buttonLocalPosition.y < baseLimit) diffuseColor.rgb = vec3(0.015, 0.015, 0.015);",
    );
  };

  return material;
}

function hasEmbeddedTexture(material) {
  if (Array.isArray(material)) {
    return material.some((item) => item?.map);
  }

  return Boolean(material?.map);
}

function prepareMaterials(scene) {
  scene.traverse((object) => {
    if (!object.isMesh) return;

    if (object.name === "CAJA") {
      if (hasEmbeddedTexture(object.material)) return;

      const material = createBoxMaterial();
      object.geometry.computeBoundingBox();
      material.userData.boxCenter = object.geometry.boundingBox.getCenter(
        new Vector3(),
      );
      object.material = material;
    } else if (object.name === "SILLA") {
      if (hasEmbeddedTexture(object.material)) return;

      object.material = createMaterial("#f2f2ed", 0.62);
    } else if (object.name === "MESA") {
      if (hasEmbeddedTexture(object.material)) return;

      object.material = createMaterial("#9a6842", 0.9);
    } else if (object.name === "BOTON") {
      if (hasEmbeddedTexture(object.material)) return;

      object.material = createButtonMaterial(object);
    } else if (object.name === "Cube") {
      if (hasEmbeddedTexture(object.material)) return;

      object.material = createMaterial("#c9232d", 0.72);
    }
  });

  return scene;
}

function FloatingDetails({ details, position, onClose }) {
  return (
    <Html position={position} center distanceFactor={5} zIndexRange={[20, 0]}>
      <div className="relative w-64 pb-7 pl-8 text-left text-[11px] uppercase tracking-[0.12em] text-white [text-shadow:0_1px_8px_#000]">
        <span className="absolute bottom-1 left-0 h-px w-8 origin-left -rotate-[28deg] bg-white/80" />
        <div className="border-b border-white/70 pb-2">
          <div className="flex items-start justify-between gap-3">
            <h2 className="font-semibold leading-tight">{details.title}</h2>
            <button
              type="button"
              className="text-sm leading-none text-white/70 hover:text-white"
              onClick={onClose}
              aria-label={`Cerrar información de ${details.title}`}
            >
              ×
            </button>
          </div>
        </div>
        {details.dimensions.length > 0 && (
          <dl className="mt-2 space-y-1">
            {details.dimensions.map(([label, value]) => (
              <div className="flex justify-between gap-3" key={label}>
                <dt className="text-white/60">{label}</dt>
                <dd className="text-right">{value}</dd>
              </div>
            ))}
          </dl>
        )}
        {details.specifications?.length > 0 && (
          <>
            <h3 className="mt-2 border-t border-white/40 pt-2 font-semibold text-white/60">
              ESPECIFICACIONES
            </h3>
            <dl className="mt-1 space-y-1">
              {details.specifications.map(([label, value]) => (
                <div className="flex justify-between gap-3" key={label}>
                  <dt className="text-white/60">{label}</dt>
                  <dd className="text-right">{value}</dd>
                </div>
              ))}
            </dl>
          </>
        )}
      </div>
    </Html>
  );
}

function Model({ model, position, rotation, scale, partDetails, faceDetails }) {
  const { scene } = useGLTF(model);
  const preparedScene = useMemo(
    () => prepareMaterials(scene.clone(true)),
    [scene],
  );
  const groupRef = useRef();
  const [selectedPart, setSelectedPart] = useState(null);
  const partPositions = useMemo(() => {
    const positions = {};
    preparedScene.updateMatrixWorld(true);

    preparedScene.traverse((object) => {
      if (!object.isMesh || !partDetails[object.name]) return;

      const center = new Box3()
        .setFromObject(object)
        .getCenter(new Vector3());
      positions[object.name] = preparedScene.worldToLocal(center);
    });

    return positions;
  }, [partDetails, preparedScene]);

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      <primitive
        object={preparedScene}
        onPointerDown={(event) => {
          const partName = event.object.name;
          if (partName === "CAJA") {
            const faceKey = getFaceKey(event.point, event.object);
            const point = event.point.clone();
            groupRef.current.worldToLocal(point);

            setSelectedPart((currentPart) => {
              if (currentPart?.faceKey === faceKey) return currentPart;

              return {
                faceKey,
                details: faceDetails[faceKey],
                position: point,
              };
            });
          } else if (partDetails[partName]) {
            setSelectedPart((currentPart) => {
              if (currentPart?.partName === partName) return currentPart;

              return {
                partName,
                details: partDetails[partName],
                position: partPositions[partName],
              };
            });
          } else {
            return;
          }

          event.stopPropagation();
        }}
        onPointerOver={(event) => {
          if (partDetails[event.object.name]) {
            event.stopPropagation();
            document.body.style.cursor = "pointer";
          }
        }}
        onPointerOut={(event) => {
          if (partDetails[event.object.name]) {
            event.stopPropagation();
            document.body.style.cursor = "default";
          }
        }}
      />
      {selectedPart && (
        <FloatingDetails
          details={selectedPart.details}
          position={selectedPart.position}
          onClose={() => setSelectedPart(null)}
        />
      )}
    </group>
  );
}

function LoadingMessage() {
  return <Html center>Cargando modelo...</Html>;
}

function ExperienceContext() {
  return (
    <>
      <color attach="background" args={["#101820"]} />
      <fog attach="fog" args={["#101820", 12, 24]} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.08, 0]}>
        <planeGeometry args={[18, 18]} />
        <meshStandardMaterial color="#26343a" roughness={0.92} />
      </mesh>
      <gridHelper
        args={[18, 18, "#52727b", "#30454b"]}
        position={[0, -0.06, 0]}
      />
      <mesh position={[0, 3.5, -4.5]}>
        <planeGeometry args={[18, 7]} />
        <meshStandardMaterial color="#17252b" roughness={1} />
      </mesh>
      <mesh position={[-4.5, 2.2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[9, 4.5]} />
        <meshStandardMaterial color="#1b2b31" roughness={1} />
      </mesh>
      <mesh position={[0, 0.04, 0]}>
        <boxGeometry args={[5.2, 0.12, 5.2]} />
        <meshStandardMaterial
          color="#344e55"
          roughness={0.8}
          emissive="#102b31"
          emissiveIntensity={0.5}
        />
      </mesh>
      <pointLight position={[0, 5, 1]} color="#d9f7ff" intensity={35} distance={12} />
      <pointLight position={[-4, 2.5, 3]} color="#35d3d1" intensity={18} distance={9} />
      <pointLight position={[4, 2, -2]} color="#ffb36b" intensity={12} distance={8} />
      <Html position={[-3.5, 3.2, -4.35]} center>
        <div className="w-52 border-l-2 border-cyan-300/70 pl-3 text-[10px] uppercase tracking-[0.18em] text-white/80 [text-shadow:0_1px_6px_#000]">
          <strong className="block text-cyan-200">Panicorp / instalación</strong>
          <span>Espacio de recalibración sensorial</span>
        </div>
      </Html>
    </>
  );
}

class ModelErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error("No se pudo cargar el modelo 3D:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-full items-center justify-center p-6 text-center text-sm text-red-300">
          No se pudo cargar el modelo 3D.
        </div>
      );
    }

    return this.props.children;
  }
}

export default function ModelViewer({
  model = defaultModel,
  className = "",
  immersive = false,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  faceDetails = defaultFaceDetails,
}) {
  const partDetails = useMemo(
    () => ({ ...defaultPartDetails, CAJA: faceDetails }),
    [faceDetails],
  );

  return (
    <div className={`w-full ${className}`}>
      <div
        className={`relative w-full overflow-hidden bg-transparent ${
          immersive
            ? "h-[calc(100vh-5rem)] min-h-[640px]"
            : "h-[420px] rounded-2xl border border-white/10"
        }`}
      >
        <ModelErrorBoundary>
          <Canvas
            camera={{ position: [6, 4.5, 8], fov: 50 }}
            dpr={[1, 2]}
            gl={{ antialias: true, alpha: true }}
          >
            <ExperienceContext />
            <ambientLight intensity={1.5} />
            <directionalLight position={[3, 5, 2]} intensity={2} />
            <directionalLight position={[-3, 2, -2]} intensity={1} />
            <Suspense fallback={<LoadingMessage />}>
              <Model
                model={model}
                position={position}
                rotation={rotation}
                scale={scale}
                partDetails={partDetails}
                faceDetails={faceDetails}
              />
            </Suspense>
            <OrbitControls
              enableDamping
              dampingFactor={0.12}
              rotateSpeed={0.14}
              zoomSpeed={0.35}
              enablePan={false}
              target={[0, 1.8, 0]}
              minDistance={3.5}
              maxDistance={14}
              minPolarAngle={Math.PI * 0.2}
              maxPolarAngle={Math.PI * 0.8}
            />
          </Canvas>
        </ModelErrorBoundary>
      </div>
    </div>
  );
}
