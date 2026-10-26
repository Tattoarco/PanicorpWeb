import {
  Fragment,
  Suspense,
  Component,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Canvas, createPortal, useFrame, useThree } from "@react-three/fiber";
import { Html, OrbitControls, useGLTF } from "@react-three/drei";
import {
  Box3,
  CanvasTexture,
  Color,
  DoubleSide,
  MathUtils,
  MeshStandardMaterial,
  Quaternion,
  Raycaster,
  SRGBColorSpace,
  Spherical,
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
    dimensions: [["Ancho", "100 cm"], ["Alto", "80 cm"]],
  },
  SILLA: {
    title: "Silla",
    dimensions: [["Tipo", "Silla plástica"]],
    specifications: [["Uso", "Asiento para visitante"]],
  },
  "Azulejos_Caidos": {
    title: "SUELO",
    dimensions: [
      ["Ancho", "180 cm"],
      ["Profundidad", "180 cm"],
    ],
    specifications: [["Espesor", "6.8 cm"]],
  },
  "Azulejos_Pared_Trasera": {
    title: "PARED TRASERA",
    dimensions: [["Ancho", "180 cm"], ["Alto", "180 cm"]],
  },
  "Televisor": {
    title: "TELEVISOR",
    dimensions: [["Abertura", "73 × 43 cm"]],
  },
  "Habitacion como tal": {
    title: "ESTRUCTURA PRINCIPAL",
    dimensions: [["Área", "180 × 180 cm"]],
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
    dimensions: [["Ancho", "180 cm"], ["Alto", "180 cm"]],
    specifications: [["Tipo", "Cara trasera"]],
  },
  back: {
    title: "PARED TRASERA",
    dimensions: [["Ancho", "180 cm"], ["Alto", "180 cm"]],
    specifications: [["Tipo", "Cara trasera"]],
  },
  right: {
    title: "PARED PUERTA",
    dimensions: [["Ancho", "180 cm"], ["Alto", "180 cm"]],
    specifications: [["Puerta", "170 × 80 cm"]],
  },
  left: {
    title: "PARED TV",
    dimensions: [["Ancho", "180 cm"], ["Alto", "180 cm"]],
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
    dimensions: [["Ancho", "180 cm"], ["Alto", "180 cm"]],
    specifications: [["Tipo", "Cara sencilla"]],
  },
  bottom: {
    title: "SUELO",
    dimensions: [["Ancho", "180 cm"], ["Profundidad", "180 cm"]],
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

// Número flotante anclado a una pieza del modelo. Se renderiza como hijo 3D de
// la pieza (via portal), así que acompaña a la pared cuando se pliega y queda
// sincronizado con la cámara en el mismo frame, sin pasar por el estado de React.
// Si hay una pared de por medio entre la cámara y la pieza, el número se
// desvanece (las paredes son de 8 a 102 triángulos: el chequeo es muy barato).
function AnnotationMarker({ annotation, occluders, selected, onSelect }) {
  const buttonRef = useRef(null);
  const { camera } = useThree();
  const elapsed = useRef(0);
  const raycaster = useMemo(() => new Raycaster(), []);
  const point = useMemo(() => new Vector3(), []);
  const direction = useMemo(() => new Vector3(), []);

  useFrame((_, delta) => {
    elapsed.current += delta;
    if (elapsed.current < 0.1) return; // ~10 comprobaciones por segundo
    elapsed.current = 0;

    const button = buttonRef.current;
    if (!button) return;

    annotation.anchor.localToWorld(point.copy(annotation.position));
    direction.copy(point).sub(camera.position);
    const distance = direction.length();
    raycaster.set(camera.position, direction.divideScalar(distance));
    raycaster.far = distance;

    const hit = raycaster.intersectObjects(occluders, true)[0];
    const hidden = Boolean(hit && hit.distance < distance - 0.1);
    button.style.opacity = hidden ? "0" : "1";
    button.style.pointerEvents = hidden ? "none" : "auto";
  });

  return (
    <Html center position={annotation.position} zIndexRange={[10, 0]}>
      <button
        ref={buttonRef}
        type="button"
        className={`flex h-7 w-7 items-center justify-center rounded-full border text-[10px] font-semibold backdrop-blur-sm transition duration-200 md:h-5 md:w-5 md:text-[9px] ${
          selected
            ? "border-cyan-200 bg-cyan-300/30 text-white"
            : "border-white/35 bg-black/30 text-white/80 hover:border-cyan-200/80 hover:text-cyan-100"
        }`}
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
    </Html>
  );
}

function Model({
  model,
  position,
  rotation,
  scale,
  faceDetails,
  explosionProgress,
  selectedName,
  onSelect,
}) {
  const { scene } = useGLTF(model);
  const preparedScene = useMemo(
    () => prepareWallAnimation(prepareMaterials(scene.clone(true))),
    [scene],
  );
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
      const worldPosition = bounds
        ? bounds.getCenter(new Vector3())
        : preparedScene.localToWorld(new Vector3(...definition.fallback));
      if (bounds && definition.anchorTop) {
        worldPosition.y = bounds.max.y;
      }
      // Posición del número en el espacio LOCAL de la pieza: así viaja con ella.
      const anchor = object ?? preparedScene;
      items.push({
        number: items.length + 1,
        name: definition.name,
        title: definition.title,
        details: { ...details, title: definition.title },
        anchor,
        position: anchor.worldToLocal(worldPosition.clone()),
      });
    });

    return items;
  }, [faceDetails, preparedScene]);

  const occluders = useMemo(
    () =>
      ["Habitacion como tal", "pared lateral puerta", "Pared trasera"]
        .map((name) => findByName(preparedScene, name))
        .filter(Boolean),
    [preparedScene],
  );

  const smoothedProgress = useRef(0);
  const foldRotation = useMemo(() => new Quaternion(), []);
  const foldOffset = useMemo(() => new Vector3(), []);

  useFrame((_, delta) => {
    // Suaviza el valor del slider para que la pared se pliegue con inercia.
    smoothedProgress.current +=
      (explosionProgressRef.current - smoothedProgress.current) *
      (1 - Math.exp(-6 * Math.min(delta, 0.05)));

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
  });

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <primitive object={preparedScene} />
      {annotations.map((annotation) => (
        <Fragment key={annotation.name}>
          {createPortal(
            <AnnotationMarker
              annotation={annotation}
              occluders={occluders}
              selected={selectedName === annotation.name}
              onSelect={onSelect}
            />,
            annotation.anchor,
          )}
        </Fragment>
      ))}
    </group>
  );
}

function LoadingMessage() {
  return (
    <Html center>
      <span className="whitespace-nowrap text-[10px] uppercase tracking-[0.25em] text-cyan-100/70">
        Cargando…
      </span>
    </Html>
  );
}

/* ------------------------------------------------------------------ */
/* Cámara: entrada suave hacia vista isométrica + controles para móvil */
/* ------------------------------------------------------------------ */

const CAMERA_TARGET = [0, 1.9, 0];
// Vista isométrica clásica: 45° de azimut y ~35.26° de elevación.
const ISO_THETA = Math.PI / 4;
const ISO_PHI = Math.PI / 2 - Math.atan(1 / Math.SQRT2);
// Punto de partida: más de frente (se ve la puerta), más bajo y más lejos.
const START_THETA = ISO_THETA - 0.75;
const START_PHI = Math.PI / 2 - MathUtils.degToRad(13);
const INTRO_SECONDS = 3.6;
const PULLBACK = 0.3; // cuánto se aleja la cámara con las paredes abiertas (30 %)

function CameraRig({ openProgress }) {
  const { camera, size } = useThree();
  const controlsRef = useRef();
  const intro = useRef({ startedAt: null, active: true });
  const spherical = useMemo(() => new Spherical(), []);
  const target = useMemo(() => new Vector3(...CAMERA_TARGET), []);

  // Distancia que encuadra la caja según el formato de pantalla (móvil o PC).
  const fit = useMemo(() => {
    const aspect = size.width / Math.max(size.height, 1);
    const verticalHalf = MathUtils.degToRad(camera.fov) / 2;
    const horizontalHalf = Math.atan(Math.tan(verticalHalf) * aspect);
    return 3.9 / Math.sin(Math.min(verticalHalf, horizontalHalf));
  }, [camera.fov, size.width, size.height]);
  const fitRef = useRef(fit);
  fitRef.current = fit;

  // Al abrir las paredes la cámara se aleja un poco para que quepan plegadas.
  const openRef = useRef(openProgress);
  openRef.current = openProgress;
  const pullback = useRef({ value: 0, applied: 1 });

  const reducedMotion = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches,
    [],
  );

  const place = (theta, phi, radius) => {
    spherical.set(radius, phi, theta);
    camera.position.setFromSpherical(spherical).add(target);
    camera.lookAt(target);
  };

  useLayoutEffect(() => {
    if (reducedMotion) {
      intro.current.active = false;
      place(ISO_THETA, ISO_PHI, fitRef.current);
    } else {
      place(START_THETA, START_PHI, fitRef.current * 1.25);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Si la persona toca la escena, la animación de entrada se cancela.
    const controls = controlsRef.current;
    const stopIntro = () => {
      intro.current.active = false;
    };
    controls?.addEventListener("start", stopIntro);
    return () => controls?.removeEventListener("start", stopIntro);
  }, []);

  useFrame((_, delta) => {
    const pull = pullback.current;
    pull.value +=
      (openRef.current - pull.value) * (1 - Math.exp(-3 * Math.min(delta, 0.05)));
    if (intro.current.active) return; // la intro ya aplica el zoom por su cuenta

    const zoom = 1 + PULLBACK * pull.value;
    if (Math.abs(zoom - pull.applied) > 1e-5) {
      // Escala la distancia actual sin tocar el ángulo que eligió la persona.
      camera.position
        .sub(target)
        .multiplyScalar(zoom / pull.applied)
        .add(target);
      pull.applied = zoom;
    }
  });

  useFrame(({ clock }) => {
    const state = intro.current;
    if (!state.active) return;

    // Se mide con el reloj real: dura lo mismo en un celular lento o en un PC.
    if (state.startedAt === null) state.startedAt = clock.elapsedTime;
    const zoom = 1 + PULLBACK * pullback.current.value;
    const t = Math.min(
      (clock.elapsedTime - state.startedAt) / INTRO_SECONDS,
      1,
    );
    const eased = -(Math.cos(Math.PI * t) - 1) / 2; // easeInOutSine
    place(
      MathUtils.lerp(START_THETA, ISO_THETA, eased),
      MathUtils.lerp(START_PHI, ISO_PHI, eased),
      MathUtils.lerp(fitRef.current * 1.25, fitRef.current, eased) * zoom,
    );
    pullback.current.applied = zoom;
    if (t >= 1) state.active = false;
  });

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enableDamping
      dampingFactor={0.07}
      rotateSpeed={0.55}
      zoomSpeed={0.7}
      enablePan={false}
      target={CAMERA_TARGET}
      minDistance={fit * 0.5}
      maxDistance={fit * 1.8}
      minPolarAngle={Math.PI * 0.18}
      maxPolarAngle={Math.PI * 0.52}
    />
  );
}

/* ------------------------------------------------------------------ */
/* Entorno spooky: suelo difuso, polvo en el aire y luz que parpadea    */
/* ------------------------------------------------------------------ */

function createRadialTexture(stops) {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const context = canvas.getContext("2d");
  const gradient = context.createRadialGradient(128, 128, 0, 128, 128, 128);
  stops.forEach(([offset, color]) => gradient.addColorStop(offset, color));
  context.fillStyle = gradient;
  context.fillRect(0, 0, 256, 256);
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  return texture;
}

function Ground() {
  // Capas planas con degradado radial: se funden con el fondo, sin horizonte
  // ni paredes que delaten el borde del escenario.
  const textures = useMemo(
    () => ({
      floor: createRadialTexture([
        [0, "rgba(24,38,45,1)"],
        [0.55, "rgba(13,21,26,0.85)"],
        [1, "rgba(7,11,14,0)"],
      ]),
      glow: createRadialTexture([
        [0, "rgba(70,220,205,0.30)"],
        [0.4, "rgba(40,130,130,0.10)"],
        [1, "rgba(0,0,0,0)"],
      ]),
      shadow: createRadialTexture([
        [0, "rgba(0,0,0,0.85)"],
        [0.55, "rgba(0,0,0,0.4)"],
        [1, "rgba(0,0,0,0)"],
      ]),
    }),
    [],
  );

  const layers = [
    { texture: textures.floor, size: 44, y: -0.06, order: -3 },
    { texture: textures.glow, size: 12, y: -0.058, order: -2 },
    { texture: textures.shadow, size: 8.5, y: -0.056, order: -1 },
  ];

  return (
    <>
      {layers.map(({ texture, size, y, order }) => (
        <mesh
          key={order}
          position={[0, y, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          renderOrder={order}
        >
          <planeGeometry args={[size, size]} />
          <meshBasicMaterial
            map={texture}
            transparent
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      ))}
    </>
  );
}

function Dust({ count }) {
  const ref = useRef();
  const dot = useMemo(
    () =>
      createRadialTexture([
        [0, "rgba(255,255,255,1)"],
        [0.4, "rgba(255,255,255,0.35)"],
        [1, "rgba(255,255,255,0)"],
      ]),
    [],
  );
  const positions = useMemo(() => {
    const values = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const radius = 2 + Math.random() * 8;
      const angle = Math.random() * Math.PI * 2;
      values[i * 3] = Math.cos(angle) * radius;
      values[i * 3 + 1] = Math.random() * 7;
      values[i * 3 + 2] = Math.sin(angle) * radius;
    }
    return values;
  }, [count]);

  useFrame(({ clock }, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += Math.min(delta, 0.05) * 0.015;
    ref.current.position.y = Math.sin(clock.elapsedTime * 0.15) * 0.25;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        map={dot}
        color="#9fe3dc"
        size={0.16}
        sizeAttenuation
        transparent
        opacity={0.4}
        depthWrite={false}
      />
    </points>
  );
}

const FLICKER_BASE = 22;

function SpookyLights() {
  const flicker = useRef();

  useFrame(({ clock }) => {
    if (!flicker.current) return;
    const t = clock.elapsedTime;
    let level = 0.88 + Math.sin(t * 2.1) * 0.05 + Math.sin(t * 7.3) * 0.04;
    // De vez en cuando la luz se "cae" un instante.
    if (Math.sin(t * 0.9) * Math.sin(t * 1.7) > 0.93) level *= 0.3;
    flicker.current.intensity = FLICKER_BASE * level;
  });

  // Solo tres luces: ambiente tenue, luz fría de contorno y una luz
  // interior que parpadea.
  return (
    <>
      <ambientLight intensity={0.45} color="#6f8ea8" />
      <directionalLight position={[4, 7, 6]} intensity={1.05} color="#b8d4ff" />
      <pointLight
        ref={flicker}
        position={[0, 3.2, 0]}
        color="#5ff0dc"
        intensity={FLICKER_BASE}
        distance={9}
      />
    </>
  );
}

function SpookyScene({ dustCount }) {
  return (
    <>
      <SpookyLights />
      <Ground />
      <Dust count={dustCount} />
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
  const containerRef = useRef(null);
  const [explosionProgress, setExplosionProgress] = useState(0);
  const [selectedPart, setSelectedPart] = useState(null);
  const [inView, setInView] = useState(true);
  const isOpen = explosionProgress > 0.5;
  // Menos partículas en pantallas pequeñas para cuidar la batería y los FPS.
  const [dustCount] = useState(() =>
    typeof window !== "undefined" && window.innerWidth < 768 ? 80 : 150,
  );

  // Pausa el render cuando el visor no está en pantalla (ahorra batería).
  useEffect(() => {
    const element = containerRef.current;
    if (!element || typeof IntersectionObserver === "undefined") {
      return undefined;
    }
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const toggleSelection = (annotation) =>
    setSelectedPart((current) =>
      current?.name === annotation.name ? null : annotation,
    );

  return (
    <div className={`w-full ${className}`}>
      <div
        ref={containerRef}
        className={`relative w-full overflow-hidden ${
          immersive
            ? "h-[calc(100svh-5rem)] min-h-[560px]"
            : "h-[420px] rounded-2xl border border-white/10"
        }`}
        style={{
          background:
            "radial-gradient(ellipse 80% 70% at 50% 58%, #15252c 0%, #0b1317 60%, #070b0e 100%)",
        }}
      >
        {/* Desvanecidos para que el visor se funda con el resto de la página */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-[5] h-16 bg-gradient-to-b from-[#101820] to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-24 bg-gradient-to-t from-[#101820] to-transparent" />

        {selectedPart && (
          <div className="pointer-events-none absolute inset-x-4 bottom-44 z-40 md:inset-x-auto md:bottom-auto md:right-6 md:top-6">
            <DetailsCard
              details={selectedPart.details}
              onClose={() => setSelectedPart(null)}
            />
          </div>
        )}
        <div className="pointer-events-auto absolute bottom-20 right-4 z-20 w-44 rounded-sm border border-white/15 bg-[#101820]/80 px-3 py-3 text-white backdrop-blur-sm md:bottom-6 md:right-8 md:w-52">
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
            className="block h-1 w-full cursor-ew-resize touch-none accent-cyan-300"
          />
        </div>
        <ModelErrorBoundary>
          <Canvas
            // OrbitControls bloquea todo gesto táctil (touch-action: none) sobre
            // el contenedor del canvas. "!touch-pan-y" lo corrige con !important:
            // deslizar vertical hace scroll de la página y deslizar horizontal
            // orbita, así el visor no atrapa la pantalla en el celular.
            className="!touch-pan-y"
            camera={{ position: [6, 4.5, 8], fov: 50, near: 0.1, far: 100 }}
            dpr={[1, 1.75]}
            frameloop={inView ? "always" : "never"}
            gl={{
              antialias: true,
              alpha: true,
              powerPreference: "high-performance",
            }}
          >
            <SpookyScene dustCount={dustCount} />
            <Suspense fallback={<LoadingMessage />}>
              <Model
                model={model}
                position={position}
                rotation={rotation}
                scale={scale}
                faceDetails={faceDetails}
                explosionProgress={explosionProgress}
                selectedName={selectedPart?.name}
                onSelect={toggleSelection}
              />
              <CameraRig openProgress={explosionProgress} />
            </Suspense>
          </Canvas>
        </ModelErrorBoundary>
      </div>
    </div>
  );
}

useGLTF.preload(defaultModel);