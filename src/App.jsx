import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home.jsx";
import Panicorp from "./pages/Panicorp.jsx";
import Tecnologia from "./pages/Tecnologia.jsx";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/que-es-panicorp" element={<Panicorp />} />
          <Route path="/tecnologias" element={<Tecnologia />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
