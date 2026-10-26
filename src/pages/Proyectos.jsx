import Navbar from '../components/Navbar';
import ModelViewer from '../components/ModelViewer';

const experienceSteps = [
  {
    number: '01',
    name: 'La llegada',
    prompt: 'Describe qué encuentra la persona antes de acercarse a la caja.',
    marker: 'Exterior',
  },
  {
    number: '02',
    name: 'El umbral',
    prompt: 'Cuenta cómo se ingresa y qué cambia al cruzar la entrada.',
    marker: 'Transición',
  },
  {
    number: '03',
    name: 'La inmersión',
    prompt: 'Explica qué sucede dentro y cómo participan los sentidos.',
    marker: 'Interior',
  },
  {
    number: '04',
    name: 'El regreso',
    prompt: 'Añade cómo termina la experiencia y qué se lleva el visitante.',
    marker: 'Salida',
  },
];

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

        <section
          aria-labelledby="experience-title"
          className="relative isolate overflow-hidden border-t border-cyan-200/15 bg-[#0b1116] px-6 py-20 sm:py-24"
        >
          <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-80 w-[min(900px,100vw)] -translate-x-1/2 rounded-full bg-cyan-300/[0.07] blur-[100px]" />
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 flex items-center gap-4 text-[10px] uppercase tracking-[0.3em] text-cyan-200/70">
              <span className="h-px w-10 bg-cyan-300/60" />
              <span>La experiencia · 01—04</span>
            </div>

            <div className="mb-16 grid gap-10 lg:grid-cols-[1fr_300px] lg:items-end">
              <div className="max-w-3xl">
                <h2
                  id="experience-title"
                  className="text-3xl font-semibold leading-tight text-white sm:text-5xl"
                >
                  Un recorrido que empieza
                  <span className="block text-cyan-200">al cruzar el umbral.</span>
                </h2>
                <p className="mt-6 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
                  Aquí puedes introducir la idea general de la experiencia y
                  contar qué invita a descubrir esta caja. Después, acompaña al
                  visitante por cada momento del recorrido.
                </p>
              </div>

              <aside className="border-l border-cyan-200/30 pl-5 text-xs leading-6 text-slate-400">
                <span className="mb-2 block text-[9px] uppercase tracking-[0.25em] text-cyan-200/70">
                  Guía de lectura
                </span>
                Del exterior al interior, y de vuelta al espacio cotidiano.
              </aside>
            </div>

            <div className="relative grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div className="pointer-events-none absolute left-[8%] right-[8%] top-5 hidden h-px bg-gradient-to-r from-cyan-300/10 via-cyan-300/35 to-cyan-300/10 xl:block" />
              {experienceSteps.map((step) => (
                <article
                  key={step.number}
                  className="group relative min-h-64 border border-white/10 bg-white/[0.025] p-6 transition-colors duration-300 hover:border-cyan-200/40 hover:bg-cyan-100/[0.04] sm:p-7"
                >
                  <div className="mb-10 flex items-center justify-between">
                    <span className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border border-cyan-200/40 bg-[#0b1116] font-mono text-xs text-cyan-100 transition-colors group-hover:border-cyan-200 group-hover:bg-cyan-200 group-hover:text-[#0b1116]">
                      {step.number}
                    </span>
                    <span className="text-[9px] uppercase tracking-[0.2em] text-white/35">
                      {step.marker}
                    </span>
                  </div>
                  <h3 className="mb-3 text-lg font-medium text-white">
                    {step.name}
                  </h3>
                  <p className="text-sm leading-6 text-slate-400">
                    {step.prompt}
                  </p>
                  <div className="mt-7 h-px w-8 bg-cyan-200/40 transition-all group-hover:w-14 group-hover:bg-cyan-200/80" />
                </article>
              ))}
            </div>

            <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-5 text-[9px] uppercase tracking-[0.2em] text-white/35 sm:flex-row sm:items-center sm:justify-between">
              <span>Explora el modelo 3D y descubre cada componente.</span>
              <span className="text-cyan-200/60">Panicorp / experiencia inmersiva</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
