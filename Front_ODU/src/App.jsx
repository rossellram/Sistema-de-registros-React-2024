// App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/AuthContext';
import RutaProtegida from './components/RutaProtegida';
import Login from './pages/Login';
import Formulario from './pages/Formulario';
import Lobby from './pages/Lobby'; // Importa el componente Lobby
import Vista from './pages/Vista'; // Importa el componente Vista

// ... (código anterior)

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route
              path="/formulario"
              element={<RutaProtegida element={<Formulario />} />}
            />
            <Route path="/lobby" element={<RutaProtegida element={<Lobby />} />} />
            <Route path="/vista" element={<RutaProtegida element={<Vista />} />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
