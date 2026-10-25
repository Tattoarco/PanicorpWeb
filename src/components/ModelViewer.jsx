import {
  Suspense,
  Component,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import {
  Box3,
  Color,
  DoubleSide,
  MeshStandardMaterial,
  Quaternion,
  Vector3,
} from "three";

const defaultModel = "/models/CajaWebV3glb.glb";
const defaultPartDetails = {
  BOTON: {
    title: "Botón",
    dimensions: [["Ancho", "5 cm"]],
    specifications: [["Función", "Activación de la instalación"]],
  },
  "Boton rojo": {
    title: "Botón",
    dimensions: [["Ancho", "5 cm"]],
    specifications: [["Función", "Activación de la instalación"]],
  },
  Cube: {
    title: "BOTE DE BASURA",
    dimensions: [],
  },
  "caneca de basura": {
    title: "BOTE DE BASURA",
    dimensions: [["Tipo", "Caneca"]],
    specifications: [["Uso", "Disposición de residuos"]],
  },
  MESA: {
    title: "Módulo inferior",
    dimensions: [["Ancho", "200 cm"], ["Alto", "80 cm"]],
  },
  SILLA: {
    title: "Silla",
    dimensions: [["Tipo", "Silla plástica"]],
    specifications: [["Uso", "Asiento para visitante"]],
  },
  "Azulejos_Caidos": {
    title: "SUELO",
    dimensions: [
      ["Ancho", "200 cm"],
      ["Profundidad", "200 cm"],
    ],
    specifications: [["Espesor", "6.8 cm"]],
  },
  "Azulejos_Pared_Trasera": {
    title: "PARED TRASERA",
    dimensions: [["Ancho", "200 cm"], ["Alto", "200 cm"]],
  },
  "Televisor": {
    title: "TELEVISOR",
    dimensions: [["Abertura", "73 × 43 cm"]],
  },
  "Habitacion como tal": {
    title: "ESTRUCTURA PRINCIPAL",
    dimensions: [["Área", "200 × 200 cm"]],
  },
};

// Solo estas piezas se mueven. Cada una se pliega girando alrededor de una
// bisagra (borde inferior de la pared) hasta quedar abatida sobre el suelo,
// hacia afuera, como una caja que se desdobla.
//  - hinge: punto de la bisagra en el espacio del modelo
//  - axis:  eje de giro
//  - angle: giro total (radianes). El signo decide hacia dónde cae.
//  - range: tramo del slider [0-1] en el que se mueve (escalonado: primero
//           cae la pared de la puerta y luego la trasera)
const doorFold = {
  hinge: [0, 0.04, 1.5], // borde inferior de la pared, lado +Z
  axis: [1, 0, 0],
  angle: Math.PI / 2,
  range: [0, 0.7],
};
const backFold = {
  hinge: [1.86, 0.03, 0], // borde inferior de la pared, lado +X
  axis: [0, 0, 1],
  angle: -Math.PI / 2,
  range: [0.3, 1],
};

const wallConfigurations = {
  "pared lateral puerta": { faceKey: "right", fold: doorFold },
  "pared trasera": { faceKey: "back", fold: backFold },
  // Los azulejos van pegados a la pared trasera, usan su misma bisagra.
  "azulejos pared trasera": { faceKey: "back", fold: backFold },
};

const clamp01 = (value) => Math.min(1, Math.max(0, value));
const smoothstep = (value) => value * value * (3 - 2 * value);

const annotationDefinitions = [
  { name: "Habitacion como tal", title: "ESTRUCTURA PRINCIPAL", fallback: [0, 2, 0] },
  { name: "Azulejos_Caidos", title: "SUELO", fallback: [0, 0, 0] },
  { name: "Azulejos_Pared_Trasera", title: "REVESTIMIENTO PARED TRASERA", fallback: [0, 2.5, -2] },
  {
    name: "pared lateral puerta",
    title: "PARED CON PUERTA",
    fallback: [-0.95, 2.63, 1.49],
    useFallback: true,
  },
  { name: "Pared trasera", title: "PARED TRASERA", fallback: [-2.5, 2.5, 0] },
  { name: "MESA", title: "MÓDULO INFERIOR", fallback: [0, 0.8, 1] },
  { name: "SILLA", title: "SILLA", fallback: [2, 0.8, 1] },
  { name: "caneca de basura", title: "BASURA / CANECA", fallback: [-2, 0.8, 1] },
  { name: "Televisor", title: "TELEVISOR", fallback: [0, 2, -1.5] },
  {
    name: "Boton rojo",
    matchNames: ["Boton rojo", "Base del boton", "pedestal del boton"],
    title: "BOTÓN ROJO",
    fallback: [-1.188, 0.94, -0.218],
    anchorTop: true,
    useFallback: true,
  },
];

// GLTFLoader (three.js) sanitiza los nombres de los nodos: los espacios pasan a
// ser guiones bajos ("pared lateral puerta" -> "pared_lateral_puerta").
// Por eso comparamos tratando espacios y "_" como lo mismo.
function normalizeName(name = "") {
  return name.trim().toLowerCase().replace(/[\s_]+/g, " ");
}

function findByName(root, name) {
  const target = normalizeName(name);
  let found = null;
  root.traverse((object) => {
    if (!found && normalizeName(object.name) === target) found = object;
  });
  return found;
}

function getWallConfiguration(name) {
  return wallConfigurations[normalizeName(name)];
}

function getPartDetails(name) {
  const normalizedName = normalizeName(name);
  return Object.entries(defaultPartDetails).find(
    ([partName]) => normalizeName(partName) === normalizedName,
  )?.[1];
}

function getDetailsForName(name, faceDetails) {
  const wall = getWallConfiguration(name);
  if (wall) return faceDetails[wall.faceKey];

  return getPartDetails(name);
}

const defaultFaceDetails = {
  front: {
    title: "PARED TRASERA",
    dimensions: [["Ancho", "200 cm"], ["Alto", "200 cm"]],
    specifications: [["Tipo", "Cara trasera"]],
  },
  back: {
    title: "PARED TRASERA",
    dimensions: [["Ancho", "200 cm"], ["Alto", "200 cm"]],
    specifications: [["Tipo", "Cara trasera"]],
  },
  right: {
    title: "PARED PUERTA",
    dimensions: [["Ancho", "200 cm"], ["Alto", "200 cm"]],
    specifications: [["Puerta", "120 × 80 cm"]],
  },
  left: {
    title: "PARED TV",
    dimensions: [["Ancho", "200 cm"], ["Alto", "200 cm"]],
    specifications: [
      ["Abertura TV", "73 × 43 cm"],
      ["Módulo lateral", "60 cm"],
      ["Nicho", "80 cm"],
      ["Módulo superior", "30 cm"],
      ["Módulo inferior", "150 cm"],
    ],
  },
  top: {
    title: "PARED SENCILLA",
    dimensions: [["Ancho", "200 cm"], ["Alto", "200 cm"]],
    specifications: [["Tipo", "Cara sencilla"]],
  },
  bottom: {
    title: "SUELO",
    dimensions: [["Ancho", "200 cm"], ["Profundidad", "200 cm"]],
    specifications: [["Espesor", "6.8 cm"]],
  },
};

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

function prepareWallAnimation(scene) {
  scene.updateMatrixWorld(true);
  scene.traverse((object) => {
    const configuration = getWallConfiguration(object.name);
    if (!configuration) return;

    const { hinge, axis, angle, range } = configuration.fold;
    object.userData.fold = {
      hinge: new Vector3(...hinge),
      axis: new Vector3(...axis).normalize(),
      angle,
      range,
      originPosition: object.position.clone(),
      originQuaternion: object.quaternion.clone(),
    };
  });
  return scene;
}

function DetailsCard({ details, onClose }) {
  return (
    <div className="pointer-events-auto w-72 rounded-sm border border-cyan-200/40 bg-[#101820]/95 px-4 pb-4 pt-3 text-left text-[11px] uppercase tracking-[0.12em] text-white shadow-[0_8px_30px_rgba(0,0,0,0.6)] backdrop-blur-sm">
      <div className="border-b border-white/40 pb-2">
        <div className="flex items-start justify-between gap-3">
          <h2 className="font-semibold leading-tight text-[#21f7fe]">
            {details.title}
          </h2>
          <button
            type="button"
            className="text-sm leading-none text-white/70 hover:text-white"
            onClick={onClose}
            aria-label="Cerrar especificaciones"
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
  );
}

function AnnotationOverlay({ annotations, onSelect }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-30">
      {annotations.map((annotation) => (
        <button
          key={annotation.name}
          type="button"
          className="pointer-events-auto absolute flex h-5 w-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/35 bg-black/25 text-[9px] font-semibold text-white/75 opacity-65 backdrop-blur-sm transition-all hover:border-cyan-200/80 hover:bg-[#101820]/75 hover:text-cyan-100 hover:opacity-100"
          style={{
            left: `${annotation.left}px`,
            top: `${annotation.top}px`,
          }}
          onClick={(event) => {
            event.stopPropagation();
            onSelect(annotation);
          }}
          onPointerDown={(event) => event.stopPropagation()}
          aria-label={`Ver especificaciones de ${annotation.title}`}
          title={annotation.title}
        >
          {annotation.number}
        </button>
      ))}
    </div>
  );
}

function Model({
  model,
  position,
  rotation,
  scale,
  faceDetails,
  explosionProgress,
  onProject,
}) {
  const { camera, size } = useThree();
  const { scene } = useGLTF(model);
  const preparedScene = useMemo(
    () => prepareWallAnimation(prepareMaterials(scene.clone(true))),
    [scene],
  );
  const groupRef = useRef();
  const explosionProgressRef = useRef(explosionProgress);
  useEffect(() => {
    explosionProgressRef.current = explosionProgress;
  }, [explosionProgress]);
  const wallObjects = useMemo(() => {
    const objects = [];
    preparedScene.traverse((object) => {
      if (object.userData.fold) {
        objects.push(object);
      }
    });
    return objects;
  }, [preparedScene]);
  const annotations = useMemo(() => {
    const items = [];
    preparedScene.updateMatrixWorld(true);

    annotationDefinitions.forEach((definition) => {
      let object;
      const namesToMatch = definition.matchNames ?? [definition.name];
      preparedScene.traverse((candidate) => {
        if (
          !object &&
          namesToMatch.some(
            (name) => normalizeName(candidate.name) === normalizeName(name),
          )
        ) {
          object = candidate;
        }
      });

      const details = getDetailsForName(definition.name, faceDetails);
      if (!details) return;

      const bounds = object && !definition.useFallback
        ? new Box3().setFromObject(object)
        : null;
      const position = bounds
        ? bounds.getCenter(new Vector3())
        : preparedScene.localToWorld(new Vector3(...definition.fallback));
      if (bounds && definition.anchorTop) {
        position.y = bounds.max.y;
      }
      const anchorPosition = object
        ? object.worldToLocal(position.clone())
        : preparedScene.worldToLocal(position.clone());
      items.push({
        number: items.length + 1,
        name: definition.name,
        title: definition.title,
        details: { ...details, title: definition.title },
        anchor: object,
        position: anchorPosition,
      });
    });

    return items;
  }, [faceDetails, preparedScene]);

  const smoothedProgress = useRef(0);
  const foldRotation = useMemo(() => new Quaternion(), []);
  const foldOffset = useMemo(() => new Vector3(), []);

  useFrame((_, delta) => {
    // Suaviza el valor del slider para que la pared se pliegue con inercia.
    smoothedProgress.current +=
      (explosionProgressRef.current - smoothedProgress.current) *
      (1 - Math.exp(-6 * delta));

    wallObjects.forEach((wall) => {
      const { hinge, axis, angle, range, originPosition, originQuaternion } =
        wall.userData.fold;
      const local = smoothstep(
        clamp01((smoothedProgress.current - range[0]) / (range[1] - range[0])),
      );

      // Gira la pared alrededor de la bisagra: posición y orientación.
      foldRotation.setFromAxisAngle(axis, angle * local);
      foldOffset.copy(originPosition).sub(hinge).applyQuaternion(foldRotation);
      wall.position.copy(hinge).add(foldOffset);
      wall.quaternion.copy(foldRotation).multiply(originQuaternion);
    });
    preparedScene.updateMatrixWorld(true);

    const projectedAnnotations = annotations.flatMap((annotation) => {
      const worldPosition = annotation.position.clone();
      if (annotation.anchor) {
        let ancestor = annotation.anchor;
        let isVisible = true;
        while (ancestor) {
          if (!ancestor.visible) isVisible = false;
          ancestor = ancestor.parent;
        }
        if (!isVisible) return [];
        annotation.anchor.localToWorld(worldPosition);
      } else {
        preparedScene.localToWorld(worldPosition);
      }
      worldPosition.project(camera);
      const visible =
        worldPosition.z > -1 &&
        worldPosition.z < 1 &&
        Math.abs(worldPosition.x) <= 1 &&
        Math.abs(worldPosition.y) <= 1;

      return visible
        ? [{
            ...annotation,
            left: ((worldPosition.x + 1) / 2) * size.width,
            top: ((1 - worldPosition.y) / 2) * size.height,
          }]
        : [];
    });
    onProject(projectedAnnotations);
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      <primitive
        object={preparedScene}
      />
    </group>
  );
}

function LoadingMessage() {
  return null;
}

function CameraIntro() {
  const { camera } = useThree();
  const elapsed = useRef(0);
  const destination = useMemo(() => new Vector3(6, 4.5, 8), []);
  const target = useMemo(() => new Vector3(0, 1.8, 0), []);
  const initialPosition = useMemo(() => new Vector3(8, 5.5, 11), []);

  useEffect(() => {
    camera.position.copy(initialPosition);
    camera.lookAt(target);
    elapsed.current = 0;
  }, [camera, initialPosition, target]);

  useFrame((_, delta) => {
    if (elapsed.current >= 1.8) return;

    elapsed.current = Math.min(elapsed.current + delta, 1.8);
    const progress = elapsed.current / 1.8;
    const easedProgress = 1 - Math.pow(1 - progress, 3);
    camera.position.lerpVectors(initialPosition, destination, easedProgress);
    camera.lookAt(target);
  });

  return null;
}

function ExperienceContext() {
  return (
    <>
      <color attach="background" args={["#101820"]} />
      <fog attach="fog" args={["#101820", 12, 24]} />
      <mesh position={[0, 3.5, -4.5]}>
        <planeGeometry args={[18, 7]} />
        <meshStandardMaterial color="#17252b" roughness={1} />
      </mesh>
      <mesh position={[-4.5, 2.2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[9, 4.5]} />
        <meshStandardMaterial color="#1b2b31" roughness={1} />
      </mesh>
      <pointLight position={[0, 5, 1]} color="#d9f7ff" intensity={35} distance={12} />
      <pointLight position={[-4, 2.5, 3]} color="#35d3d1" intensity={18} distance={9} />
      <pointLight position={[4, 2, -2]} color="#ffb36b" intensity={12} distance={8} />
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
  const [explosionProgress, setExplosionProgress] = useState(0);
  const [selectedPart, setSelectedPart] = useState(null);
  const [annotationPositions, setAnnotationPositions] = useState([]);
  const isOpen = explosionProgress > 0.5;

  return (
    <div className={`w-full ${className}`}>
      <div
        className={`relative w-full overflow-hidden bg-transparent ${
          immersive
            ? "h-[calc(100vh-5rem)] min-h-[640px]"
            : "h-[420px] rounded-2xl border border-white/10"
        }`}
      >
        {selectedPart && (
          <div className="pointer-events-none absolute right-6 top-6 z-40">
            <DetailsCard
              details={selectedPart.details}
              onClose={() => setSelectedPart(null)}
            />
          </div>
        )}
        <div className="pointer-events-auto absolute bottom-14 right-4 z-20 w-44 rounded-sm border border-white/15 bg-[#101820]/80 px-3 py-3 text-white backdrop-blur-sm md:bottom-6 md:right-8 md:w-52">
          <button
            type="button"
            onClick={() => setExplosionProgress(isOpen ? 0 : 1)}
            className="mb-2 w-full border border-cyan-200/50 bg-cyan-200/10 px-3 py-1.5 text-[10px] uppercase tracking-[0.14em] text-cyan-100 transition-colors hover:bg-cyan-200/25"
          >
            {isOpen ? "Cerrar paredes" : "Abrir paredes"}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={explosionProgress}
            onChange={(event) =>
              setExplosionProgress(Number(event.target.value))
            }
            aria-label="Abrir paredes de la caja"
            className="block h-1 w-full cursor-ew-resize accent-cyan-300"
          />
        </div>
        <ModelErrorBoundary>
          <Canvas
            camera={{ position: [6, 4.5, 8], fov: 50 }}
            dpr={[1, 2]}
            gl={{ antialias: true, alpha: true }}
          >
            <CameraIntro />
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
                faceDetails={faceDetails}
                explosionProgress={explosionProgress}
                onProject={setAnnotationPositions}
              />
            </Suspense>
            <OrbitControls
              enableDamping
              dampingFactor={0.08}
              rotateSpeed={0.5}
              zoomSpeed={0.65}
              enablePan={false}
              target={[0, 1.8, 0]}
              minDistance={3.5}
              maxDistance={14}
              minPolarAngle={Math.PI * 0.2}
              maxPolarAngle={Math.PI * 0.8}
            />
          </Canvas>
        </ModelErrorBoundary>
        <AnnotationOverlay
          annotations={annotationPositions}
          onSelect={setSelectedPart}
        />
      </div>
    </div>
  );
}