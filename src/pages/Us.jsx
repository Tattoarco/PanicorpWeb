import Navbar from "../components/Navbar";

export default function Us() {
  return (
    <div className="min-h-screen bg-[#101820]">
      <Navbar />
      <main>
        <section className="relative">
          <div className="pointer-events-none absolute left-8 top-10 z-10 max-w-md md:left-16 md:top-16">pagina de nosotros</div>
        </section>
      </main>
    </div>
  );
}
