// RutaProtegida.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const RutaProtegida = ({ element }) => {
  const { user } = useAuth();

  // Si el usuario está autenticado, muestra el componente, de lo contrario, redirige a la página de inicio de sesión
  return user ? (
    <Routes>
      <Route path="/*" element={element} />
    </Routes>
  ) : (
    <Navigate to="/" replace />
  );
};

export default RutaProtegida;
