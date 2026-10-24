// src/pages/Tecnologias.jsx
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Tecnologia() {
  // Organización clara del Stack por Categorías Técnicas
  const categoriasTech = [
    {
      categoria: '01. CORE & FRAMEWORK',
      tecnologias: [
        {
          nombre: 'React',
          version: 'v19',
          rol: 'Arquitectura de Componentes & Estado Reactivo',
          porQue: 'Permite crear interfaces interactivas y modulares. Es la base para actualizar componentes dinámicamente sin recargar la página.',
          icono: '⚛️'
        }
      ]
    },
    {
      categoria: '02. HERRAMIENTA DE CONSTRUCCIÓN (BUILD TOOL)',
      tecnologias: [
        {
          nombre: 'Vite',
          version: 'v8',
          rol: 'Servidor de Desarrollo & Empaquetado Ultra Rápido',
          porQue: 'Ofrece recarga de módulos al instante (HMR) y una compilación optimizada para producción, reduciendo los tiempos de carga al mínimo.',
          icono: '⚡'
        }
      ]
    },
    {
      categoria: '03. SISTEMA DE ESTILOS & UI',
      tecnologias: [
        {
          nombre: 'Tailwind CSS',
          version: 'v4',
          rol: 'Diseño Modular Utility-First & Glassmorphism',
          porQue: 'Facilita la creación del tema oscuro personalizado, bordes neón (#62A8DB), respuestas responsivas y efectos de cristal esmerilado sin sobrecargar el código CSS.',
          icono: '🎨'
        }
      ]
    },
    {
      categoria: '04. NAVEGACIÓN & ENRUTAMIENTO',
      tecnologias: [
        {
          nombre: 'React Router DOM',
          version: 'v7',
          rol: 'Navegación SPA (Single Page Application)',
          porQue: 'Gestiona el cambio entre módulos (Home, ¿Qué es Panicorp?, Nosotros, Tecnologías) de manera fluida y limpia en la URL.',
          icono: '🔀'
        }
      ]
    },
    {
      categoria: '05. MULTIMEDIA & RENDIMIENTO',
      tecnologias: [
        {
          nombre: 'HTML5 Video Engine & CSS Filters',
          version: 'Native Web API',
          rol: 'Renderizado de Video de Fondo & Efectos CRT',
          porQue: 'Soporte nativo para videos en bucle en alta definición con capas de filtro analógico para la experiencia de recalibración sensorial.',
          icono: '🎥'
        }
      ]
    },
    {
      categoria: '01. DISEÑO Y PROGRAMACIÓN INTERACTIVA',
      tecnologias: [
        {
          nombre: 'TouchDesigner',
          version: 'Software de programación visual',
          rol: 'Diseño de experiencias audiovisuales e interactivas',
          porQue: 'Se utiliza para diseñar y controlar la experiencia sensorial, conectando estímulos visuales con la interacción física del usuario.',
          icono: '◈'
        }
      ]
    },
    {
      categoria: '02. HARDWARE INTERACTIVO',
      tecnologias: [
        {
          nombre: 'ESP32',
          version: 'Microcontrolador',
          rol: 'Control y comunicación del sistema',
          porQue: 'Coordina las entradas del botón y las respuestas de iluminación para conectar la interacción física con la experiencia digital.',
          icono: '⌁'
        },
        {
          nombre: 'Botón físico',
          version: 'Entrada interactiva',
          rol: 'Activación de la experiencia',
          porQue: 'Permite que el usuario inicie la experiencia, controlando su interacción con el dispositivo.',
          icono: '◎'
        },
        {
          nombre: 'Luces LED NeoFlex',
          version: 'Iluminación LED',
          rol: 'Respuesta visual del dispositivo',
          porQue: 'Aportan una respuesta luminosa que acompaña la interacción y refuerza la ambientación sensorial.',
          icono: '✦'
        }
      ]
    }
  ];

  const tecnologiasFisicas = categoriasTech.slice(5);
  const tecnologiasWeb = categoriasTech.slice(0, 5);

  const renderCategorias = (categorias) => (
    <div className="space-y-12">
      {categorias.map((item) => (
        <section key={item.categoria} className="space-y-4">
          <div className="flex items-center gap-3 border-b border-[#62A8DB]/30 pb-2">
            <span className="w-2 h-2 rounded-full bg-[#62A8DB]" />
            <h2 className="text-sm font-bold tracking-[0.2em] text-[#62A8DB] uppercase">
              {item.categoria}
            </h2>
          </div>
          <div className="grid gap-6">
            {item.tecnologias.map((tech) => (
              <div
                key={tech.nombre}
                className="group bg-zinc-950/80 backdrop-blur-xl border border-zinc-800 hover:border-[#62A8DB] p-6 sm:p-8 transition-all duration-300 hover:shadow-[0_0_25px_rgba(98,168,219,0.15)] flex flex-col md:flex-row justify-between gap-6"
              >
                <div className="md:w-1/3">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl p-2 bg-black border border-zinc-800 rounded">
                      {tech.icono}
                    </span>
                    <div>
                      <h3 className="text-xl font-[900] tracking-wider text-white group-hover:text-[#62A8DB] transition-colors">
                        {tech.nombre}
                      </h3>
                      <span className="text-[15px] font-mono font-bold text-[#62A8DB]/80 tracking-widest">
                        {tech.version}
                      </span>
                    </div>
                  </div>
                  <span className="inline-block mt-2 text-[10px] font-bold tracking-widest px-2.5 py-1 bg-[#62A8DB]/10 text-[#62A8DB] border border-[#62A8DB]/30 uppercase">
                    {tech.rol}
                  </span>
                </div>
                <div className="md:w-2/3 border-t md:border-t-0 md:border-l border-zinc-800 pt-4 md:pt-0 md:pl-6 flex flex-col justify-center">
                  <span className="text-[13px] font-bold tracking-widest text-zinc-500 uppercase mb-1">
                    ¿QUÉ APORTA A LA EXPERIENCIA?
                  </span>
                  <p className="text-md text-zinc-300 font-sans leading-relaxed">
                    {tech.porQue}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );

  return (
    <div className="relative min-h-screen bg-black text-white font-['Orbitron'] selection:bg-[#62A8DB] selection:text-black overflow-x-hidden">
      
      {/* Video de Fondo */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed inset-0 w-full h-full object-cover z-0 pointer-events-none opacity-30"
      >
        <source src="/fondo.mp4" type="video/mp4" />
      </video>

      {/* Degradado y Filtro CRT */}
      <div className="fixed inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black z-0 pointer-events-none" />
      <div className="fixed inset-0 pointer-events-none z-10 opacity-20 mix-blend-overlay bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px]" />

      <div className="relative z-20 flex flex-col justify-between min-h-screen">
        <div>
          <Navbar />

          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20">
            
            {/* Breadcrumb */}
            <div className="flex items-center justify-between mb-8 border-b border-[#62A8DB]/20 pb-4">
              <span className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase">
                ESPECIFICACIONES TÉCNICAS // TECH-03
              </span>
            </div>

            {/* Encabezado Principal */}
            <header className="mb-14 text-center max-w-3xl mx-auto">
              <span className="text-[10px] font-bold tracking-[0.3em] text-[#62A8DB] uppercase px-3.5 py-1.5 bg-[#62A8DB]/10 border border-[#62A8DB]/30 rounded-full backdrop-blur-md">
                TECNOLOGÍA DE LA EXPERIENCIA
              </span>
              <h1 className="text-4xl sm:text-6xl font-[900] tracking-wider text-white mt-6 mb-4">
                TECNOLOGÍAS <span className="text-[#62A8DB] drop-shadow-[0_0_25px_rgba(98,168,219,0.5)]">UTILIZADAS</span>
              </h1>
              <p className="text-md sm:text-md text-zinc-300 leading-relaxed font-sans tracking-wide">
                La experiencia física combina interacción, procesamiento e iluminación para crear un entorno sensorial inmersivo.
              </p>
            </header>

            {/* Componentes principales de la experiencia física */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
              <div className="bg-zinc-950/80 border border-zinc-800 p-4 text-center">
                <span className="block text-[9px] font-bold text-zinc-500 tracking-widest uppercase">CONTROL</span>
                <span className="block text-sm font-bold text-[#62A8DB] mt-1">ESP32</span>
              </div>
              <div className="bg-zinc-950/80 border border-zinc-800 p-4 text-center">
                <span className="block text-[9px] font-bold text-zinc-500 tracking-widest uppercase">INTERACCIÓN</span>
                <span className="block text-sm font-bold text-[#62A8DB] mt-1">BOTÓN FÍSICO</span>
              </div>
              <div className="bg-zinc-950/80 border border-zinc-800 p-4 text-center">
                <span className="block text-[9px] font-bold text-zinc-500 tracking-widest uppercase">ILUMINACIÓN</span>
                <span className="block text-sm font-bold text-[#62A8DB] mt-1">LED NEOFLEX</span>
              </div>
              <div className="bg-zinc-950/80 border border-zinc-800 p-4 text-center">
                <span className="block text-[9px] font-bold text-zinc-500 tracking-widest uppercase">DISEÑO INTERACTIVO</span>
                <span className="block text-sm font-bold text-[#62A8DB] mt-1">TOUCHDESIGNER</span>
              </div>
            </div>

            <section className="mb-16 space-y-6">
              <div>
                <span className="text-[10px] font-bold tracking-[0.3em] text-[#62A8DB] uppercase">SISTEMA FÍSICO</span>
                <h2 className="text-2xl sm:text-3xl font-black tracking-wider text-white mt-2">EL CUERPO DE LA EXPERIENCIA</h2>
                <p className="text-md text-zinc-300 font-sans mt-2 max-w-3xl">
                  TouchDesigner da forma a la interacción audiovisual; el ESP32, el botón y las luces NeoFlex conectan la experiencia con el espacio físico.
                </p>
              </div>
              {renderCategorias(tecnologiasFisicas)}
            </section>

            <details className="group mb-16 bg-zinc-950/70 border-2 border-[#62A8DB] shadow-[0_0_15px_rgba(98,168,219,0.4)] open:border-2 open:border-[#62A8DB]/50 transition-colors">
              <summary className="cursor-pointer list-none p-5 sm:p-6 flex items-center justify-between gap-4">
                <span>
                  <span className="block text-xl font-bold tracking-wider text-white">¿Cómo está compuesta la página web?</span>
                  <span className="block text-md text-zinc-400 font-sans mt-1">Ver tecnologías de desarrollo web</span>
                </span>
                <span className="text-[#62A8DB] text-xl transition-transform group-open:rotate-45" aria-hidden="true">+</span>
              </summary>
              <div className="px-5 pb-6 sm:px-6">
                {renderCategorias(tecnologiasWeb)}
              </div>
            </details>

            {/* Banner para la siguiente sección */}
            <div className="mt-16 p-8 bg-zinc-950/80 backdrop-blur-md border border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-6 ">
              <div>
                <h3 className="text-lg font-[900] tracking-wider text-white">¿MÁS INFORMACIÓN?</h3>
                <p className="text-md text-zinc-400 font-sans mt-1">Revisa el proceso de desarrollo en el Making Of o regresa al inicio.</p>
              </div>
              <div className="flex gap-4">
                <Link to="/making-of">
                  <button className="px-6 py-3 text-xs font-black tracking-[0.2em] uppercase text-black bg-[#62A8DB] hover:bg-white transition-all shadow-[0_0_15px_rgba(98,168,219,0.4)]">
                    MAKING OF →
                  </button>
                </Link>
              </div>
            </div>

          </main>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
