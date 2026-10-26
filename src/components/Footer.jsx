// src/components/Footer.jsx
import { Link } from "react-router-dom";

const footerLinks = [
  { name: "¿Qué es Panicorp?", href: "/que-es-panicorp" },
  { name: "Proyectos", href: "/proyectos" },
  { name: "Tecnologías", href: "/tecnologias" },
  { name: "Making Of", href: "/making-of" },
  { name: "Nosotros", href: "/nosotros" },
];

// Reemplaza los href por tus redes reales
const socials = [
  {
    name: "Instagram",
    href: "https://instagram.com/",
    icon: <path d="M7.8 2h8.4A5.8 5.8 0 0 1 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8A5.8 5.8 0 0 1 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2Zm-.2 2A3.6 3.6 0 0 0 4 7.6v8.8A3.6 3.6 0 0 0 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6A3.6 3.6 0 0 0 16.4 4H7.6Zm9.65 1.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" />,
  },
  {
    name: "TikTok",
    href: "https://tiktok.com/",
    icon: <path d="M16.6 5.8A4.3 4.3 0 0 1 15.5 3h-3.1v12.4a2.6 2.6 0 1 1-2.6-2.6c.3 0 .5 0 .8.1V9.7a5.7 5.7 0 1 0 4.9 5.7V9.3a7.4 7.4 0 0 0 4.3 1.4V7.6a4.3 4.3 0 0 1-3.2-1.8Z" />,
  },
  {
    name: "YouTube",
    href: "https://youtube.com/",
    icon: <path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2C2 8.800 2 12 2 12s0 3.200.4 4.800a2.500 2.500 0 0 0 1.800 1.800C5.800 19 12 19 12 19s6.200 0 7.800-.4a2.500 2.500 0 0 0 1.800-1.800C22 15.200 22 12 22 12s0-3.200-.4-4.800ZM10 15V9l5.200 3L10 15Z" />,
  },
];

export default function Footer() {
  return (
    <footer className="relative z-20 border-t border-[#62A8DB]/20 bg-black/90 backdrop-blur-md pt-10 pb-6 px-5 font-['Orbitron'] text-zinc-500 text-[10px] tracking-[0.2em] uppercase">
      {/* Línea de luz superior */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-2/3 bg-gradient-to-r from-transparent via-[#62A8DB] to-transparent" />

      <div className="max-w-7xl mx-auto flex flex-col gap-10">
        {/* Marca + redes */}
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-12 h-12">
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_8px_rgba(98,168,219,0.8)]">
              <circle cx="50" cy="50" r="48" fill="#000000" stroke="#62A8DB" strokeWidth="2" />
              <path d="M 12 50 Q 50 18 88 50 Q 50 82 12 50 Z" fill="#FFFFFF" />
              <circle cx="50" cy="50" r="22" fill="#62A8DB" />
              <circle cx="50" cy="50" r="11" fill="#000000" />
            </svg>
          </div>
          <p className="text-zinc-400 text-[10px] max-w-xs leading-relaxed">Experiencias sensoriales que despiertan tus sentidos.</p>
          <div className="flex items-center gap-3">
            {socials.map((s) => (
              <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.name} className="w-10 h-10 flex items-center justify-center rounded-full border border-zinc-800 text-zinc-400 hover:text-[#62A8DB] hover:border-[#62A8DB]/60 hover:shadow-[0_0_15px_rgba(98,168,219,0.3)] active:scale-95 transition-all">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  {s.icon}
                </svg>
              </a>
            ))}
          </div>
        </div>

        {/* Navegación */}
        <nav aria-label="Footer" className="flex flex-wrap justify-center gap-x-6 gap-y-3">
          {footerLinks.map((l) => (
            <Link key={l.name} to={l.href} className="text-zinc-400 hover:text-[#62A8DB] transition-colors">
              {l.name}
            </Link>
          ))}
        </nav>

        {/* Patrocinadores */}
        <div className="flex flex-col items-center gap-5">
          <span className="text-[9px] font-bold tracking-[0.3em] text-[#62A8DB] px-3 py-1 bg-[#62A8DB]/10 border border-[#62A8DB]/30 rounded-full">ALIANZAS & PATROCINADORES</span>

          <div className="grid grid-cols-2 gap-3 sm:gap-6 w-full max-w-xl">
            {/* Octopus */}
            <div className="group bg-zinc-950/80 border border-zinc-800 hover:border-[#62A8DB]/60 rounded-xl p-4 sm:p-6 flex flex-col items-center justify-between gap-4 transition-all duration-300 hover:shadow-[0_0_20px_rgba(98,168,219,0.2)]">
              <p className="text-[8px] sm:text-[10px] text-zinc-400 font-bold tracking-widest text-center leading-relaxed">
                DE LA MANO CON: <span className="block text-[#62A8DB]">OCTOPUS</span>
              </p>
              <img
                src="/footer/LogoOctopus.svg"
                alt="Octopus"
                width="120"
                height="64"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
                className="h-26 sm:h-27 w-full max-w-[140px] object-contain invert opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all"
              />
            </div>

            {/* Rocco Gráficas */}
            <div className="group bg-zinc-950/80 border border-zinc-800 hover:border-[#62A8DB]/60 rounded-xl p-4 sm:p-6 flex flex-col items-center justify-between gap-4 transition-all duration-300 hover:shadow-[0_0_20px_rgba(98,168,219,0.2)]">
              <p className="text-[8px] sm:text-[10px] text-zinc-400 font-bold tracking-widest text-center leading-relaxed">
                PATROCINADO POR: <span className="block text-[#62A8DB]">ROCCO GRÁFICAS</span>
              </p>
              <img
                src="/footer/RoccoGraficas.svg"
                alt="Rocco Gráficas"
                width="120"
                height="64"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
                className="h-26 sm:h-27 w-full max-w-[140px] object-contain invert opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-zinc-900 pt-6 flex flex-col sm:flex-row items-center justify-between text-center gap-2 text-zinc-600 text-[9px]">
          <span>PANICORP SENSORY SYSTEM</span>
          <span>© {new Date().getFullYear()} // TODOS LOS DERECHOS RESERVADOS</span>
        </div>
      </div>
    </footer>
  );
}
