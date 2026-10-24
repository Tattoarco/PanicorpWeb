// src/components/Footer.jsx
export default function Footer() {
  return (
    <footer className="relative z-20 border-t border-[#62A8DB]/20 bg-black/90 backdrop-blur-md py-8 px-4 font-['Orbitron'] text-zinc-500 text-[10px] tracking-[0.2em] uppercase">
      <div className="max-w-7xl mx-auto flex flex-col items-start gap-6 ">
        
        {/* Encabezado de Patrocinadores */}
        <div className="text-center">
          <span className="text-[9px] font-bold tracking-[0.3em] text-[#62A8DB] uppercase px-3 py-1 bg-[#62A8DB]/10 border border-[#62A8DB]/30 rounded-full">
            ALIANZAS & PATROCINADORES
          </span>
        </div>

        {/* Patrocinadores Lado a Lado (grid-cols-2 en todas las pantallas) */}
        <div className="grid grid-cols-2 gap-4 sm:gap-6 w-auto max-w-xl">
          
          {/* Patrocinador 1: Octopus */}
          <div className="group bg-zinc-950/80 border border-zinc-800 hover:border-[#62A8DB]/60 p-4 sm:p-6 flex flex-col items-center justify-center gap-3 transition-all duration-300 hover:shadow-[0_0_20px_rgba(98,168,219,0.2)]">
            <p className="text-[8px] sm:text-[10px] text-zinc-400 font-bold tracking-widest text-center">
              DE LA MANO CON: <span className="text-[#62A8DB]">OCTOPUS</span>
            </p>
            <div className=" sm:h-16 flex items-center justify-center">
              <img
                src="/footer/LogoOctopus.svg"
                alt="Octopus"
                className="h-25 sm:h-33 w-auto object-contain filter drop-shadow-[0_0_8px_rgba(98,168,219,0.3)] group-hover:scale-105 transition-transform"
              />
            </div>
          </div>

          {/* Patrocinador 2: Rocco Gráficas */}
          <div className="group bg-zinc-950/80 border border-zinc-800 hover:border-[#62A8DB]/60 p-4 sm:p-6 flex flex-col items-center justify-center gap-3 transition-all duration-300 hover:shadow-[0_0_20px_rgba(98,168,219,0.2)]">
            <p className="text-[8px] sm:text-[10px] text-zinc-400 font-bold tracking-widest text-center">
              PATROCINADO PO: <span className="text-[#62A8DB]">ROCCO GRÁFICAS</span>
            </p>
            <div className=" flex items-center justify-center">
              <img
                src="/footer/RoccoGraficas.svg"
                alt="Rocco Gráficas"
                className="h-10 sm:h-15 w-auto object-contain filter drop-shadow-[0_0_8px_rgba(98,168,219,0.3)] group-hover:scale-105 transition-transform"
              />
            </div>
          </div>

        </div>

        {/* Línea final de Copyright */}
        <div className="w-full border-t border-zinc-900 pt-6 flex flex-col sm:flex-row items-center justify-between text-center gap-2 text-zinc-600">
          <span>PANICORP SENSORY SYSTEM</span>
          <span>© {new Date().getFullYear()} // TODOS LOS DERECHOS RESERVADOS.</span>
        </div>

      </div>
    </footer>
  );
}