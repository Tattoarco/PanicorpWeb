export default function Tecnologia() {
  return (
    <div className="relative min-h-screen bg-black text-white font-['Orbitron'] selection:bg-[#62A8DB] selection:text-black overflow-x-hidden">
      {/* 1. VIDEO DE FONDO COMPLETO */}
      <video autoPlay loop muted playsInline className="fixed inset-0 w-full h-full object-cover z-0 pointer-events-none ">
        <source src="/fondo2.mp4" type="video/mp4" />
      </video>
    </div>
  )}