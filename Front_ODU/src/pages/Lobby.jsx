import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Lobby = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const usuario = location.state?.usuario || 'Invitado'; // Obtén el nombre del usuario de la ubicación

  const handleGoToFormulario = () => {
    navigate('/formulario');
  };

  const handleGoToVista = () => {
    navigate('/vista');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-3xl font-semibold text-sky-700 mb-4 text-center">¡Bienvenido, {usuario}!</h1>
        <p className="text-center">¿A dónde te gustaría ir?</p>
        
        {/* Texto antes del botón "Ir a Formulario" */}
        <p className="text-center mt-2 text-gray-600 font-semibold">Crear un nuevo artículo</p>
        <button
          onClick={handleGoToFormulario}
          className="w-full py-2 bg-sky-700 text-white font-semibold rounded-lg hover:bg-sky-800 focus:outline-none focus:ring focus:ring-sky-400 transition-colors mt-2"
        >
          Ir a Formulario
        </button>
        
        {/* Texto antes del botón "Ir a Vista" */}
        <p className="text-center mt-4 text-gray-600 font-semibold">Ver Datos</p>
        <button
          onClick={handleGoToVista}
          className="w-full py-2 bg-sky-700 text-white font-semibold rounded-lg hover:bg-sky-800 focus:outline-none focus:ring focus:ring-sky-400 transition-colors mt-2"
        >
          Ir a Vista
        </button>
      </div>
    </div>
  );
};

export default Lobby;
