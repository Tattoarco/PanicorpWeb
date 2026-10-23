// src/pages/Home.jsx
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-black text-white font-['Orbitron'] selection:bg-[#62A8DB] selection:text-black overflow-x-hidden">
      {/* 1. VIDEO DE FONDO COMPLETO */}
      <video autoPlay loop muted playsInline className="fixed inset-0 w-full h-full object-cover z-0 pointer-events-none ">
        <source src="/home/fondo2.mp4" type="video/mp4" />
      </video>

      {/* OVERLAY DE DEGRADADO PARA LEGIBILIDAD */}
      <div className="fixed inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black z-0 pointer-events-none" />

      {/* FILTRO OPCIONAL DE LÍNEAS CRT / CÁMARA DE VIGILANCIA */}
      <div className="fixed inset-0 pointer-events-none z-10 opacity-20 mix-blend-overlay bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px]" />

      {/* 2. CONTENIDO PRINCIPAL */}
      <div className="relative z-20">
        {/* Texto vertical lateral */}
        <div className="hidden xl:block fixed left-4 top-1/2 -translate-y-1/2 z-40 pointer-events-none">
          <span className="text-[10px] font-black tracking-[0.4em] text-zinc-500 uppercase [writing-mode:vertical-lr] rotate-180 drop-shadow-[0_0_10px_rgba(0,0,0,0.9)]">PANICORP SENSORY LAB // RECALIBRACIÓN v2.0</span>
        </div>

        {/* Navbar */}
        <Navbar />

        {/* HERO SECTION REORGANIZADA */}
        <section className="relative pt-8 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center">
          {/* Barra superior de estado */}
          <div className="w-full flex justify-between items-center text-[10px] sm:text-xs text-[#62A8DB] font-bold tracking-[0.2em] border-b border-[#62A8DB]/20 pb-3 mb-10 uppercase bg-black/40 backdrop-blur-md px-3 py-2 rounded">
            <span>EXP: RECALIBRACIÓN SENSORIAL</span>
            <span>ESTADO: ACTIVO</span>
          </div>

          {/* CONTENEDOR DEL TÍTULO PRINCIPAL Y METADATOS */}
          <div className="relative w-full text-center my-6 flex flex-col items-center justify-center">
            {/* Aura/Glow Cian detrás del título */}
            <div className="absolute w-96 h-48 bg-[#62A8DB]/20 blur-3xl rounded-full -z-10 pointer-events-none" />

            {/* TÍTULO GIGANTE */}
            <h1 className="text-6xl sm:text-8xl md:text-[120px] lg:text-[160px] font-black tracking-[0.08em] leading-none text-white drop-shadow-[0_0_35px_rgba(98,168,219,0.4)]">PANICORP</h1>

            {/* ESPECIFICACIONES LATERALES ORGANIZADAS */}
            <div className="hidden md:flex justify-between items-center w-full max-w-5xl mt-8 px-4 text-left z-20">
              <div className="max-w-55 bg-black/80 backdrop-blur-md p-3.5 border-l-2 border-[#62A8DB] text-[10px] text-zinc-400 space-y-1">
                <p className="font-bold text-[#0095ff] tracking-widest uppercase">ESTIMULACIÓN</p>
                <p className="leading-relaxed">Frecuencia de pulso visual adaptada para inmersión profunda.</p>
              </div>

              <div className="max-w-55 bg-black/80 backdrop-blur-md p-3.5 border-r-2 border-[#62A8DB] text-[10px] text-zinc-400 text-right space-y-1">
                <p className="font-bold text-[#0095ff] tracking-widest uppercase">ECOSISTEMA</p>
                <p className="leading-relaxed">Desarrollado con arquitectura moderna en TouchDesing.</p>
              </div>
            </div>
          </div>

          {/* SUBTÍTULO Y BOTÓN DE ACCIÓN */}
          <div className="mt-8 text-center max-w-xl">
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed tracking-wider mb-8 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">EXPERIENCIA DE INMERSIÓN DIGITAL Y SOFTWARE A LA MEDIDA. ACCEDE A CADA SECCIÓN DEL SISTEMA.</p>

            <Link to="/que-es-panicorp">
              <button className="px-10 py-4 text-xs font-black tracking-[0.25em] uppercase text-black bg-[#0095ff]  hover:bg-white transition-all shadow-[0_0_25px_rgba(98,168,219,0.6)] border border-[#62A8DB]">Vamos a explorar →</button>
            </Link>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
}
