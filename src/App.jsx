import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home.jsx";
import Panicorp from "./pages/Panicorp.jsx";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/que-es-panicorp" element={<Panicorp />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
