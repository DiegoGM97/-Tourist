import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Destinos from "./pages/Destinos";
import DetalleDestino from "./pages/DetalleDestino";
import Hoteles from "./pages/Hoteles";
import DetalleHotel from "./pages/DetalleHotel";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import Perfil from "./pages/Perfil";
import AdminPanel from "./pages/AdminPanel";
import AdminRoute from "./components/AdminRoute";

function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <main className="flex-grow-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/index.html" element={<Home />} />
          <Route path="/destinos.html" element={<Destinos />} />
          <Route path="/destinos/:id" element={<DetalleDestino />} />
          <Route path="/hoteles.html" element={<Hoteles />} />
          <Route path="/hoteles/:id" element={<DetalleHotel />} />
          <Route path="/login.html" element={<Login />} />
          <Route path="/registro.html" element={<Registro />} />
          <Route path="/perfil.html" element={<Perfil />} />
          <Route path="/admin.html" element={<AdminRoute><AdminPanel /></AdminRoute>} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
