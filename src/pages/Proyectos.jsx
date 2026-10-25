import Navbar from '../components/Navbar';
import ModelViewer from '../components/ModelViewer';


export default function Proyectos() {
  return (
    <div className="min-h-screen bg-[#101820]">
      <Navbar />
      <main>
        <section className="relative">
          <div className="pointer-events-none absolute left-8 top-10 z-10 max-w-md md:left-16 md:top-16">
            <p className="mb-3 text-xs uppercase tracking-[0.3em] text-cyan-200/80">
              Panicorp / instalación
            </p>
            <h1 className="mb-4 text-4xl font-bold text-white md:text-6xl">
              Experiencia de
              <span className="block text-cyan-300">
                recalibración sensorial
              </span>
            </h1>
            <p className="max-w-sm text-sm leading-relaxed text-slate-300 md:text-base">
              Explora el espacio donde se monta la experiencia y descubre el
              propósito de cada elemento.
            </p>
          </div>
          <div className="pointer-events-none absolute bottom-8 left-8 z-10 text-xs uppercase tracking-[0.2em] text-white/60 md:left-16">
            Arrastra para orbitar · rueda para acercarte
          </div>
          <ModelViewer immersive />
        </section>
        <section className="mx-auto max-w-6xl px-6 py-20">
          <div className="grid gap-6 md:grid-cols-3">
          <article className="border-l border-cyan-300/50 pl-4">
            <h2 className="mb-2 text-lg font-semibold text-cyan-200">
              El montaje
            </h2>
            <p className="text-sm leading-relaxed text-slate-400">
              La caja se instala como un espacio de transición: un límite
              físico que separa el ruido exterior de una experiencia más
              consciente y contenida.
            </p>
          </article>
          <article className="border-l border-cyan-300/50 pl-4">
            <h2 className="mb-2 text-lg font-semibold text-cyan-200">
              La materialidad
            </h2>
            <p className="text-sm leading-relaxed text-slate-400">
              La madera, el contraste entre el exterior claro y el interior
              oscuro, y los elementos rojos construyen una lectura corporal y
              sensorial del refugio.
            </p>
          </article>
          <article className="border-l border-cyan-300/50 pl-4">
            <h2 className="mb-2 text-lg font-semibold text-cyan-200">
              La interacción
            </h2>
            <p className="text-sm leading-relaxed text-slate-400">
              Orbita la escena y selecciona sus paredes para conocer la
              distribución, las medidas y la función de cada componente.
            </p>
          </article>
          </div>
        </section>
      </main>
    </div>
  );
}