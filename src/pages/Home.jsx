// src/pages/Home.jsx
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const specs = [
  {
    title: "ESTIMULACIÓN",
    text: "Frecuencia de pulso visual adaptada para inmersión profunda.",
  },
  {
    title: "ECOSISTEMA",
    text: "Desarrollado con arquitectura moderna en TouchDesigner.",
  },
];

export default function Home() {
  return (
    <div className="relative min-h-svh bg-black text-white font-['Orbitron'] selection:bg-[#62A8DB] selection:text-black overflow-x-hidden">
      {/* 1. VIDEO DE FONDO */}
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        className="fixed inset-0 w-full h-full object-cover z-0 pointer-events-none"
      >
        <source src="/home/fondo2.mp4" type="video/mp4" />
      </video>

      {/* Degradado para legibilidad */}
      <div className="fixed inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black z-0 pointer-events-none" />

      {/* Líneas CRT */}
      <div className="fixed inset-0 pointer-events-none z-10 opacity-20 mix-blend-overlay bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px]" />

      {/* 2. CONTENIDO */}
      <div className="relative z-20 flex min-h-svh flex-col">
        {/* Texto vertical lateral */}
        <div className="hidden xl:block fixed left-4 top-1/2 -translate-y-1/2 z-40 pointer-events-none">
          <span className="text-[10px] font-black tracking-[0.4em] text-zinc-500 uppercase [writing-mode:vertical-lr] rotate-180 drop-shadow-[0_0_10px_rgba(0,0,0,0.9)]">
            PANICORP SENSORY LAB // RECALIBRACIÓN v2.0
          </span>
        </div>

        <Navbar />

        {/* HERO */}
        <section className="relative flex-1 flex flex-col items-center justify-center gap-8 sm:gap-10 pt-8 pb-16 px-4 sm:px-6 lg:px-8 w-full max-w-7xl mx-auto">
          {/* Barra de estado */}
          <div className="w-full max-w-3xl flex items-center justify-between gap-3 text-[9px] sm:text-xs text-[#62A8DB] font-bold tracking-[0.15em] sm:tracking-[0.2em] uppercase bg-black/50 backdrop-blur-md border border-[#62A8DB]/20 px-3 py-2 rounded">
            <span className="truncate">EXP: RECALIBRACIÓN SENSORIAL</span>
            <span className="flex items-center gap-2 shrink-0">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-[#62A8DB] opacity-75 animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#62A8DB]" />
              </span>
              ACTIVO
            </span>
          </div>

          {/* TÍTULO con marco HUD */}
          <div className="relative w-full max-w-5xl px-4 sm:px-10 py-8 sm:py-12 text-center">
            {/* Esquinas */}
            <span className="absolute top-0 left-0 w-5 h-5 sm:w-8 sm:h-8 border-t-2 border-l-2 border-[#62A8DB]" />
            <span className="absolute top-0 right-0 w-5 h-5 sm:w-8 sm:h-8 border-t-2 border-r-2 border-[#62A8DB]" />
            <span className="absolute bottom-0 left-0 w-5 h-5 sm:w-8 sm:h-8 border-b-2 border-l-2 border-[#62A8DB]" />
            <span className="absolute bottom-0 right-0 w-5 h-5 sm:w-8 sm:h-8 border-b-2 border-r-2 border-[#62A8DB]" />

            {/* Aura */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-2/3 bg-[#62A8DB]/20 blur-3xl rounded-full -z-10 pointer-events-none" />

            <p className="text-[9px] sm:text-xs tracking-[0.5em] text-zinc-400 mb-3 sm:mb-4">
              // SENSORY SYSTEM
            </p>

            <h1 className="text-[13.5vw] sm:text-8xl md:text-[120px] lg:text-[160px] font-black tracking-[0.04em] sm:tracking-[0.08em] leading-none text-white drop-shadow-[0_0_35px_rgba(98,168,219,0.4)]">
              PANICORP
            </h1>

            <div className="mx-auto mt-5 sm:mt-6 h-px w-24 sm:w-40 bg-gradient-to-r from-transparent via-[#62A8DB] to-transparent" />
          </div>

          {/* Especificaciones */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-3xl">
            {specs.map((s, i) => (
              <div
                key={s.title}
                className={`bg-black/70 backdrop-blur-md p-4 text-[10px] text-zinc-400 space-y-1 border-[#62A8DB] border-l-2 ${
                  i === 1 ? "sm:border-l-0 sm:border-r-2 sm:text-right" : ""
                }`}
              >
                <p className="font-bold text-[#62A8DB] tracking-widest">{s.title}</p>
                <p className="leading-relaxed">{s.text}</p>
              </div>
            ))}
          </div>

          {/* Subtítulo y acciones */}
          <div className="text-center max-w-xl w-full">
            <p className="text-[11px] sm:text-sm text-zinc-300 leading-relaxed tracking-wider mb-7 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
              EXPERIENCIA DE INMERSIÓN DIGITAL Y SOFTWARE A LA MEDIDA. ACCEDE A CADA SECCIÓN DEL SISTEMA.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch justify-center gap-3">
              <Link
                to="/que-es-panicorp"
                className="px-8 py-4 text-xs font-black tracking-[0.25em] uppercase text-black bg-[#62A8DB] hover:bg-white active:scale-[0.98] transition-all shadow-[0_0_25px_rgba(98,168,219,0.5)] border border-[#62A8DB]"
              >
                Vamos a explorar →
              </Link>
              <Link
                to="/proyectos"
                className="px-8 py-4 text-xs font-bold tracking-[0.25em] uppercase text-[#62A8DB] bg-black/40 backdrop-blur-md border border-[#62A8DB]/50 hover:bg-[#62A8DB]/10 active:scale-[0.98] transition-all"
              >
                Ver proyectos
              </Link>
            </div>
          </div>

          {/* Indicador de scroll */}
          <div className="flex flex-col items-center gap-2 text-[#62A8DB]/70 text-[9px] tracking-[0.3em]">
            <span>SCROLL</span>
            <svg className="w-4 h-4 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
}