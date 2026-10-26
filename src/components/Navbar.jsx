// src/components/Navbar.jsx
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const navLinks = [
  { name: "¿QUÉ ES PANICORP?", href: "/que-es-panicorp" },
  { name: "PROYECTOS", href: "/proyectos" },
  { name: "TECNOLOGÍAS", href: "/tecnologias" },
  { name: "MAKING OF", href: "/making-of" },
  { name: "NOSOTROS", href: "/nosotros" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Bloquea el scroll del fondo cuando el menú está abierto
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <header className="sticky top-3 z-50 w-full px-3 sm:px-6 font-['Orbitron']">
      <nav className="relative max-w-6xl mx-auto text-white">
        {/* Barra principal (cápsula) */}
        <div
          className={`relative z-20 h-14 sm:h-16 px-3 sm:px-6 flex items-center justify-between
          border border-[#62A8DB]/30 bg-black/70 backdrop-blur-xl
          shadow-[0_0_25px_rgba(98,168,219,0.15)] transition-[border-radius] duration-300
          ${isOpen ? "rounded-t-3xl rounded-b-none lg:rounded-full" : "rounded-full"}`}
        >
          {/* Logo */}
          <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center group" aria-label="Inicio">
            <div className="w-9 h-9 sm:w-10 sm:h-10 transition-transform duration-300 group-hover:scale-110">
              <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_8px_rgba(98,168,219,0.8)]">
                <circle cx="50" cy="50" r="48" fill="#000000" stroke="#62A8DB" strokeWidth="2" />
                <path d="M 12 50 Q 50 18 88 50 Q 50 82 12 50 Z" fill="#FFFFFF" />
                <circle cx="50" cy="50" r="22" fill="#62A8DB" />
                <circle cx="50" cy="50" r="11" fill="#000000" />
              </svg>
            </div>
          </Link>

          {/* Links desktop */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <Link key={link.name} to={link.href} onClick={() => setIsOpen(false)} className={`px-4 py-1.5 rounded-full text-[13px] font-bold tracking-[0.15em] transition-all duration-200 ${isActive ? "text-[#62A8DB] bg-[#62A8DB]/20 shadow-[0_0_12px_rgba(98,168,219,0.3)]" : "text-zinc-200 hover:text-[#9cd1f7] hover:bg-white/10"}`}>
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Botón hamburguesa */}
          <button onClick={() => setIsOpen((v) => !v)} className="lg:hidden p-2.5 text-[#62A8DB] hover:text-white rounded-full border border-[#62A8DB]/40 active:scale-95 transition focus:outline-none" aria-label={isOpen ? "Cerrar menú" : "Abrir menú"} aria-expanded={isOpen}>
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>

        {/* Panel móvil con animación suave (grid rows 0fr -> 1fr) */}
        <div className={`lg:hidden absolute left-0 right-0 top-full z-10 grid transition-all duration-300 ease-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0 pointer-events-none"}`}>
          <div className="overflow-hidden">
            <div className="border border-t-0 border-[#62A8DB]/30 bg-black/90 backdrop-blur-xl rounded-b-3xl px-4 pt-3 pb-5 flex flex-col gap-1.5 shadow-[0_20px_40px_rgba(0,0,0,0.6)]">
              {navLinks.map((link, i) => {
                const isActive = location.pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    to={link.href}
                    onClick={() => setIsOpen(false)}
                    style={{ transitionDelay: isOpen ? `${i * 40}ms` : "0ms" }}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold tracking-[0.2em] transition-all duration-300 ${isOpen ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"} ${isActive ? "text-[#62A8DB] bg-[#62A8DB]/10 border border-[#62A8DB]/30" : "text-zinc-300 border border-transparent active:bg-white/10 hover:text-white hover:bg-white/5"}`}
                  >
                    {link.name}
                    <span className={`text-[#62A8DB] ${isActive ? "opacity-100" : "opacity-0"}`}>●</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* Fondo oscuro para cerrar al tocar fuera */}
      {isOpen && <button aria-label="Cerrar menú" onClick={() => setIsOpen(false)} className="lg:hidden fixed inset-0 -z-10 bg-black/50 backdrop-blur-sm cursor-default" />}
    </header>
  );
}
