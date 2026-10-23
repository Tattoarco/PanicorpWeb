// src/pages/QueEsPanicorp.jsx
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Los videos de las tarjetas deben estar dentro de /public.
const tarjetas = [
  {
    id: '01',
    tag: 'CONCEPTO BASE',
    titulo: '¿QUÉ ES PANICORP?',
    corto: 'PANICORP  ',
    subtitulo: 'SISTEMA DE RECALIBRACIÓN SENSORIAL',
    video: '/panicorp/video1.mp4',
    descripcion:
      'PANICORP es una empresa de neurotecnología y bienestar sensorial enfocada en el estudio, análisis y transformación de la percepción humana. Su propuesta combina investigación experimental, interacción tecnológica y sistemas de respuesta en tiempo real para explorar cómo los estímulos visuales, auditivos y táctiles influyen en la manera en que las personas interpretan su entorno.',
    puntos: [
      'Centro de pruebas de alto desarrollo para la mejora y experimentacion humana.',
      'Exploracion entre la realidad y la percepción, con un enfoque en la neurociencia aplicada.',
      'Diseño de experiencias sensoriales inmersivas que desafían los sentidos y promueven la conciencia sensorial.',
    ],
    metricas: [
      { label: 'TIPO DE PLATAFORMA', val: 'WEB / EXPERIMENTAL' },
      { label: 'ESTADO', val: 'FASE ACTIVA v2.0' },
    ],
  },
  {
    id: '02',
    tag: 'INVESTIGACIÓN Y DESARROLLO',
    titulo: 'Experiencia de recalibración sensorial',
    corto: 'EXPERIENCIA',
    subtitulo: 'EXPERIMENTACION SENSORIAL Y SOFTWARE A LA MEDIDA',
    video: '/panicorp/video2.mp4',
    descripcion:
      'En esta experiencia de recalibración sensorial, PANICORP combina investigación experimental con desarrollo de software a medida para explorar cómo los estímulos visuales, auditivos y táctiles pueden influir en la percepción humana. El programa permite a los usuarios interactuar con entornos digitales y análogos inmersivos que desafían sus sentidos y promueven una mayor conciencia sensorial.',
    puntos: [
      'Estudio de la percepción del usuario mediante interfaces no convencionales.',
      'Desarrollo de experiencia en tiempo real con respuesta a estímulos sensoriales.',
      'Lo que se consideroa "normal" es cuestionado y reconfigurado para explorar nuevas formas de interacción y percepción.',
    ],
    metricas: [
      { label: 'ENFOQUE', val: 'SEONSORIAL & EXPERIMENTAL' },
      { label: 'EXPERIENCIA', val: 'DISPONIBLE EN MAKING OF' },
    ],
  },
  {
    id: '03',
    tag: 'OBJETIVO Y META',
    titulo: 'NUESTRA MISIÓN',
    corto: 'MISIÓN',
    subtitulo: 'EXCELENCIA TÉCNICA Y ESTÉTICA',
    video: '/panicorp/video3.mp4',
    descripcion:
      'Demostrar que el desarrollo de software puede fusionar un rendimiento técnico impecable con una identidad visual inmersiva.',
    puntos: [
      'Crear experiencias digitales memorables sin comprometer la velocidad de carga.',
      'Superar los estándares tradicionales de interfaces hacia entornos interactivos.',
      'Mantener una base de código limpia, escalable y fácilmente mantenible.',
    ],
    metricas: [
      { label: 'COMPROMISO', val: 'CÓDIGO LIMPIO & ESCALABLE' },
      { label: 'ALCANCE', val: 'MULTI-MÓDULO' },
    ],
  },
];

const AUTOPLAY_MS = 9000; // tiempo que se queda cada sección (después de mostrar el texto)
const EXPAND_MS = 1000; // duración de la expansión del video
const TEXT_DELAY_MS = 750; // cuándo empieza a aparecer el texto (durante el final de la expansión)
const FULL = 'inset(0px 0px 0px 0px)';

export default function Panicorp() {
  const [active, setActive] = useState(0);
  const [base, setBase] = useState(null); // video que ya llena el fondo (debajo del que se expande)
  const [clip, setClip] = useState(FULL); // clip-path del video que se expande
  const [animar, setAnimar] = useState(false); // activa la transición del clip-path
  const [textoListo, setTextoListo] = useState(false);
  const [pausado, setPausado] = useState(false);

  const cardRefs = useRef([]);
  const activeRef = useRef(0);
  const timers = useRef([]);
  const total = tarjetas.length;
  const actual = tarjetas[active];

  const limpiarTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  // Lleva el video de la card i desde su posición hasta pantalla completa
  const ir = (i) => {
    const el = cardRefs.current[i];
    if (!el) return;
    limpiarTimers();

    const r = el.getBoundingClientRect();
    const desde = `inset(${r.top}px ${window.innerWidth - r.right}px ${
      window.innerHeight - r.bottom
    }px ${r.left}px)`;

    // lo que estaba activo pasa a ser el fondo fijo; el nuevo video crece encima
    setBase(i === activeRef.current ? base : activeRef.current);
    activeRef.current = i;
    setActive(i);
    setTextoListo(false);

    // 1) coloca el video exactamente sobre la card, sin transición
    setAnimar(false);
    setClip(desde);

    // 2) en el siguiente frame, expándelo a pantalla completa
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        setAnimar(true);
        setClip(FULL);
      })
    );

    // 3) el texto aparece cuando la imagen casi termina de expandirse
    timers.current.push(setTimeout(() => setTextoListo(true), TEXT_DELAY_MS));
    // 4) al terminar, el video expandido se convierte en el fondo base
    timers.current.push(setTimeout(() => setBase(i), EXPAND_MS + 50));
  };

  const siguiente = () => ir((activeRef.current + 1) % total);
  const anterior = () => ir((activeRef.current - 1 + total) % total);

  // Primera expansión al entrar a la página
  useEffect(() => {
    const t = setTimeout(() => ir(0), 150);
    return () => {
      clearTimeout(t);
      limpiarTimers();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Avance automático: solo corre cuando el texto ya está visible
  useEffect(() => {
    if (pausado || !textoListo) return;
    const t = setTimeout(siguiente, AUTOPLAY_MS);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, pausado, textoListo]);

  return (
    <div className="relative min-h-screen bg-black text-white font-['Orbitron'] selection:bg-[#62A8DB] selection:text-black overflow-x-hidden">
      {/* FONDO BASE: el último video que ya llenó la pantalla */}
      {base !== null && (
        <video
          key={`base-${base}`}
          className="fixed inset-0 z-0 h-full w-full object-cover pointer-events-none"
          src={tarjetas[base].video}
          autoPlay
          loop
          muted
          playsInline
          aria-hidden="true"
        />
      )}

      {/* VIDEO QUE SE EXPANDE: sale de la card y crece hasta cubrir todo el fondo */}
      <video
        key={`active-${active}`}
        className="fixed inset-0 z-0 h-full w-full object-cover pointer-events-none"
        src={actual.video}
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
        style={{
          clipPath: clip,
          transition: animar ? `clip-path ${EXPAND_MS}ms cubic-bezier(.76,0,.24,1)` : 'none',
        }}
      />

      {/* OVERLAYS: legibilidad del texto + filtro CRT */}
      <div className="fixed inset-0 bg-gradient-to-r from-black/90 via-black/55 to-black/20 z-0 pointer-events-none" />
      <div className="fixed inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/60 z-0 pointer-events-none" />
      <div className="fixed inset-0 pointer-events-none z-10 opacity-20 mix-blend-overlay bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px]" />

      {/* CONTENIDO */}
      <div className="relative z-20 flex flex-col min-h-screen">
        <Navbar />

        <main
          className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-10 flex flex-col"
          onMouseEnter={() => setPausado(true)}
          onMouseLeave={() => setPausado(false)}
        >
          {/* Miga de pan */}
          <div className="flex items-center  mb-8 border-b border-[#62A8DB]/20 pb-4">
            <span className="hidden sm:block text-[10px] text-zinc-400 font-mono tracking-widest uppercase">
              SECCIÓN: CONCEPTO & ESTRUCTURA // PAN-01
            </span>
          </div>

          <section className="flex-1 grid lg:grid-cols-[1.1fr_1fr] gap-10 items-center">
            {/* ===== TEXTO: aparece cuando el video ya llenó el fondo ===== */}
            <div
              className="max-w-xl"
              style={{ opacity: textoListo ? 1 : 0, pointerEvents: textoListo ? 'auto' : 'none' }}
            >
              <div key={`${active}-${textoListo}`}>
                <div className="text-in flex items-center gap-3 mb-5">
                  <span className="block w-8 h-[2px] bg-[#62A8DB]" />
                  <span className="text-[10px] font-bold tracking-[0.3em] text-[#62A8DB] uppercase px-3 py-1.5 bg-[#62A8DB]/10 border border-[#62A8DB]/30 backdrop-blur-md">
                    {actual.tag}
                  </span>
                </div>

                <h1
                  className="text-in text-4xl sm:text-5xl xl:text-6xl font-[900] tracking-wider leading-[1.05] text-white drop-shadow-[0_0_25px_rgba(98,168,219,0.35)]"
                  style={{ animationDelay: '100ms' }}
                >
                  {actual.titulo}
                </h1>

                <p
                  className="text-in text-[11px] font-bold tracking-[0.25em] text-[#62A8DB] mt-3 mb-5 uppercase"
                  style={{ animationDelay: '200ms' }}
                >
                  {actual.subtitulo}
                </p>

                <p
                  className="text-in text-lg text-zinc-200 leading-relaxed font-sans mb-6"
                  style={{ animationDelay: '300ms' }}
                >
                  {actual.descripcion}
                </p>

                <div className="space-y-3 mb-7">
                  {actual.puntos.map((p, idx) => (
                    <div
                      key={idx}
                      className="text-in flex items-start gap-2.5 text-md text-zinc-300 font-sans leading-relaxed"
                      style={{ animationDelay: `${400 + idx * 100}ms` }}
                    >
                      <span className="text-[#62A8DB] font-bold">▸</span>
                      <p>{p}</p>
                    </div>
                  ))}
                </div>

                <div
                  className="text-in pt-4 border-t border-[#62A8DB]/25 space-y-2 mb-8 max-w-md"
                  style={{ animationDelay: '700ms' }}
                >
                  {actual.metricas.map((m, idx) => (
                    <div key={idx} className="flex justify-between items-center gap-4 text-[10px] font-mono">
                      <span className="text-zinc-400 uppercase">{m.label}:</span>
                      <span className="text-[#62A8DB] font-bold text-right">{m.val}</span>
                    </div>
                  ))}
                </div>

                <div className="text-in flex flex-wrap gap-4" style={{ animationDelay: '800ms' }}>
                  <Link to="/nosotros">
                    <button className="px-6 py-3 text-xs font-black tracking-[0.2em] uppercase text-black bg-[#62A8DB] hover:bg-white transition-all shadow-[0_0_15px_rgba(98,168,219,0.4)]">
                      NOSOTROS →
                    </button>
                  </Link>
                  <Link to="/tecnologias">
                    <button className="px-6 py-3 text-xs font-black tracking-[0.2em] uppercase text-zinc-200 bg-black/40 backdrop-blur-md hover:bg-zinc-900 border border-zinc-600">
                      STACK →
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            {/* ===== CARDS VERTICALES (selector) ===== */}
            <div className="flex flex-col gap-6 lg:items-end">
              <div className="flex gap-4 sm:gap-5 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 -mx-4 px-4 lg:mx-0 lg:px-0 snap-x">
                {tarjetas.map((c, i) => {
                  const esActiva = i === active;
                  return (
                    <button
                      key={c.id}
                      ref={(el) => (cardRefs.current[i] = el)}
                      onClick={() => !esActiva && ir(i)}
                      aria-label={`Ver ${c.titulo}`}
                      aria-pressed={esActiva}
                      className={`group relative shrink-0 snap-start w-40 sm:w-44 xl:w-48 h-64 sm:h-72 overflow-hidden text-left border transition-all duration-500 ease-out ${
                        esActiva
                          ? 'border-[#62A8DB] -translate-y-3 shadow-[0_0_35px_rgba(98,168,219,0.45)]'
                          : 'border-zinc-700 opacity-75 hover:opacity-100 hover:-translate-y-1 hover:border-[#62A8DB]/60'
                      }`}
                    >
                      <video
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                        src={c.video}
                        loop
                        muted
                        playsInline
                        preload="metadata"
                        aria-hidden="true"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/30" />

                      <span className="absolute top-3 left-3 text-xs font-black tracking-widest text-[#62A8DB]">
                        [{c.id}]
                      </span>

                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <span
                          className={`block h-[2px] mb-2 bg-[#62A8DB] transition-all duration-500 ${
                            esActiva ? 'w-10' : 'w-4'
                          }`}
                        />
                        <p className="text-[9px] tracking-[0.2em] text-zinc-300 font-mono uppercase mb-1">
                          {c.tag}
                        </p>
                        <p className="text-lg font-[900] tracking-wider leading-tight text-white">
                          {c.corto}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Controles */}
              <div className="flex items-center gap-4 w-full lg:max-w-[34rem]">
                <button
                  onClick={anterior}
                  aria-label="Anterior"
                  className="w-11 h-11 shrink-0 rounded-full border border-[#62A8DB]/50 text-[#62A8DB] hover:bg-[#62A8DB] hover:text-black transition-colors flex items-center justify-center"
                >
                  ‹
                </button>
                <button
                  onClick={siguiente}
                  aria-label="Siguiente"
                  className="w-11 h-11 shrink-0 rounded-full border border-[#62A8DB]/50 text-[#62A8DB] hover:bg-[#62A8DB] hover:text-black transition-colors flex items-center justify-center"
                >
                  ›
                </button>

                <div className="relative flex-1 h-[2px] bg-zinc-700 overflow-hidden">
                  <div
                    key={`${active}-${textoListo}-${pausado}`}
                    className="absolute inset-0 origin-left bg-[#62A8DB]"
                    style={{
                      animation: pausado || !textoListo ? 'none' : `progress ${AUTOPLAY_MS}ms linear forwards`,
                      transform: !textoListo ? 'scaleX(0)' : pausado ? 'scaleX(1)' : undefined,
                      opacity: pausado ? 0.4 : 1,
                    }}
                  />
                </div>

                <span
                  key={active}
                  className="text-3xl font-[900] tracking-wider text-white tabular-nums"
                  style={{ animation: 'numIn .5s ease-out' }}
                >
                  {String(active + 1).padStart(2, '0')}
                  <span className="text-sm text-zinc-500">/{String(total).padStart(2, '0')}</span>
                </span>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </div>
  );
}
