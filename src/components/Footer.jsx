export default function Footer() {
  return (
    <footer className="border-t border-[#62A8DB]/20 py-8 bg-black/80 backdrop-blur-md text-center text-zinc-500 text-[10px] tracking-[0.2em] uppercase">
      <p>© {new Date().getFullYear()} PANICORP SENSORY SYSTEM // TODOS LOS DERECHOS RESERVADOS.</p>
      <div className="mt-2">
        <p>Patrocinados por: <span className="text-[#62A8DB]">NOMBRE DE LA EMPRESA</span></p>
        <img src="" alt="Impresión" />
      </div>
      <div className="mt-2">
        <p>Patrocinados por: <span className="text-[#62A8DB]">NOMBRE DE LA EMPRESA</span></p>
        <img src="" alt="Laboratorios" />
      </div>
    </footer>
  );
}
