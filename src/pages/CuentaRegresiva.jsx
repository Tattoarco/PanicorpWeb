import { useEffect, useState } from "react";

const targetDate = new Date("2026-11-10T14:00:00Z").getTime();

function getTimeLeft() {
  const difference = Math.max(0, targetDate - Date.now());

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / (1000 * 60)) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
}

const timeUnits = [
  ["days", "días"],
  ["hours", "horas"],
  ["minutes", "minutos"],
  ["seconds", "segundos"],
];

export default function CuentaRegresiva() {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft);

  useEffect(() => {
    const interval = window.setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  const hasArrived = Object.values(timeLeft).every((unit) => unit === 0);

  return (
    <main className="relative isolate flex min-h-svh items-center justify-center overflow-hidden bg-[#05090d] px-5 py-12 text-white selection:bg-[#68a5d6] selection:text-[#05090d]">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_42%,rgba(53,115,158,0.2),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.12] [background-image:linear-gradient(rgba(104,165,214,0.16)_1px,transparent_1px),linear-gradient(90deg,rgba(104,165,214,0.16)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />

      <section className="w-full max-w-5xl text-center">
        <div className="mx-auto mb-7 flex h-24 w-24 items-center justify-center rounded-full border border-[#68a5d6]/40 bg-[#d9edfa] shadow-[0_0_55px_rgba(104,165,214,0.18)] sm:mb-9 sm:h-28 sm:w-28">
          <img
            src="/Isotipo.svg"
            alt="Isotipo de Panicorp"
            className="h-[84%] w-[84%] object-contain"
          />
        </div>

        <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.45em] text-[#8dbce0] sm:text-xs">
          Una experiencia está por comenzar
        </p>
        <h1 className="text-4xl font-black tracking-[0.08em] text-white drop-shadow-[0_0_30px_rgba(104,165,214,0.25)] sm:text-6xl md:text-7xl">
          PANICORP
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
          Te esperamos en la muestra de esta experiencia.
        </p>

        <div className="mx-auto my-9 flex items-center justify-center gap-3 text-[9px] uppercase tracking-[0.32em] text-[#8dbce0]/75 sm:my-11 sm:gap-4 sm:text-[10px]">
          <span className="h-px w-9 bg-[#68a5d6]/50 sm:w-16" />
          <span>La cuenta regresiva ha comenzado</span>
          <span className="h-px w-9 bg-[#68a5d6]/50 sm:w-16" />
        </div>

        <div
          aria-label="Tiempo restante hasta la muestra, el 10 de noviembre de 2026 a las 9 de la mañana"
          className="mx-auto grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4"
        >
          {timeUnits.map(([unit, label]) => (
            <div
              key={unit}
              className="rounded border border-[#68a5d6]/25 bg-[#0b1520]/75 px-3 py-5 backdrop-blur sm:px-5 sm:py-7"
            >
              <span
                aria-hidden="true"
                className="block font-mono text-4xl font-medium tabular-nums text-white sm:text-5xl md:text-6xl"
              >
                {String(timeLeft[unit]).padStart(2, "0")}
              </span>
              <span className="mt-2 block text-[9px] uppercase tracking-[0.26em] text-[#8dbce0] sm:text-[10px]">
                {label}
              </span>
            </div>
          ))}
        </div>

        <p className="mt-7 text-[10px] uppercase tracking-[0.22em] text-white/45 sm:mt-9 sm:text-xs">
          {hasArrived
            ? "¡Ya comenzó! Te esperamos."
            : "10 de noviembre · 9:00 a. m. · Hora de Colombia"}
        </p>
        <p className="mt-3 text-[10px] uppercase tracking-[0.22em] text-[#8dbce0]/75 sm:text-xs">
          Salón 204 · Bloque 11 · UPB
        </p>
        <div className="mx-auto mt-9 h-px w-20 bg-gradient-to-r from-transparent via-[#68a5d6]/70 to-transparent sm:mt-11" />
        <p className="mt-5 text-[9px] tracking-[0.32em] text-white/30">
          PANICORP SENSORY LAB
        </p>
      </section>
    </main>
  );
}
