import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home.jsx";
import Panicorp from "./pages/Panicorp.jsx";
import Tecnologia from "./pages/Tecnologia.jsx";
import Proyectos from "./pages/Proyectos.jsx";
import Us from "./pages/Us.jsx";
import MakingOf from "./pages/MakingOf.jsx";
import CuentaRegresiva from "./pages/CuentaRegresiva.jsx";

const unlockDate = new Date("2026-11-10T14:00:00Z").getTime();

function App() {
  const [isUnlocked, setIsUnlocked] = useState(() => Date.now() >= unlockDate);

  useEffect(() => {
    if (isUnlocked) return undefined;

    const interval = window.setInterval(() => {
      if (Date.now() >= unlockDate) {
        setIsUnlocked(true);
      }
    }, 1000);

    return () => window.clearInterval(interval);
  }, [isUnlocked]);

  return (
    <>
      <BrowserRouter>
        {isUnlocked ? (
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/que-es-panicorp" element={<Panicorp />} />
            <Route path="/tecnologias" element={<Tecnologia />} />
            <Route path="/proyectos" element={<Proyectos />} />
            <Route path="/nosotros" element={<Us />} />
            <Route path="/making-of" element={<MakingOf />} />
            <Route path="/cuenta-regresiva" element={<CuentaRegresiva />} />
          </Routes>
        ) : (
          <CuentaRegresiva />
        )}
      </BrowserRouter>
    </>
  );
}

export default App;
