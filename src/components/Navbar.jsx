// src/components/Navbar.jsx
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: '¿QUÉ ES PANICORP?', href: '/que-es-panicorp' },
    { name: 'NOSOTROS', href: '/nosotros' },
    { name: 'TECNOLOGÍAS', href: '/tecnologias' },
    { name: 'MAKING OF', href: '/making-of' },
  ];

  return (
    <header className="sticky top-4 z-50 w-full px-4 sm:px-6 font-['Orbitron']">
      {/* Contenedor cápsula flotante con Glassmorphism */}
      <nav className="max-w-6xl mx-auto rounded-full text-white bg-white/30 backdrop-blur-none ">
        <div className="px-5 sm:px-8 h-16 flex items-center justify-center">
          
          {/* LOGO: Isotipo Ojo + Tipografía Orbitron 900 */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 transition-transform duration-300 group-hover:scale-110">
              <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_8px_rgba(98,168,219,0.8)]">
                {/* Fondo círculo exterior */}
                <circle cx="50" cy="50" r="48" fill="#000000" stroke="#62A8DB" strokeWidth="2" />
                {/* Esclerótica */}
                <path d="M 12 50 Q 50 18 88 50 Q 50 82 12 50 Z" fill="#FFFFFF" />
                {/* Iris (#62A8DB) */}
                <circle cx="50" cy="50" r="22" fill="#62A8DB" />
                {/* Pupila */}
                <circle cx="50" cy="50" r="11" fill="#000000" />
              </svg>
            </div>
          </Link>

          {/* Enlaces Desktop integrados en cápsula interior */}
          <div className="hidden lg:flex items-center gap-1 p-1.5">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`px-4 py-1.5 rounded-full text-[11px] font-bold tracking-[0.15em] transition-all duration-200 ${
                    isActive
                      ? 'text-[#62A8DB] bg-[#62A8DB]/20 border border-[#62A8DB]/40 shadow-[0_0_12px_rgba(98,168,219,0.3)]'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Menú Móvil Hamburger */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-[#62A8DB] hover:text-white rounded-full border border-[#62A8DB]/40 focus:outline-none"
              aria-label="Abrir menú"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Menú Desplegable Móvil */}
        {isOpen && (
          <div className="lg:hidden px-6 pt-2 pb-6 space-y-2 border-t border-[#62A8DB]/20 mt-2 bg-black/90 backdrop-blur-2xl rounded-b-3xl">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-2.5 rounded-xl text-xs font-bold tracking-[0.2em] transition-all ${
                  location.pathname === link.href
                    ? 'text-[#62A8DB] bg-[#62A8DB]/10 border border-[#62A8DB]/30'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.name}
              </Link>
            ))}
            
          </div>
        )}
      </nav>
    </header>
  );
}