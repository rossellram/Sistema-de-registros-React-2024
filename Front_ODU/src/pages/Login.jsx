// Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Alerta from '../components/Alerta';
import { clienteAxiosLogin } from '../config/clienteAxios';
import { useAuth } from '../components/AuthContext'; // Ajusta la importación según la ubicación real de tu archivo de contexto

const Login = () => {
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [alerta, setAlerta] = useState({});
  const navigate = useNavigate();
  const { login } = useAuth(); // Agrega la importación y usa el hook useAuth

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await clienteAxiosLogin.post('/login', { usuario, contrasena });

      // Verifica si la autenticación fue exitosa
      if (response.data.success) {
        login(usuario); // Establece el estado de autenticación

        // Utiliza navigate para redirigir a /lobby con el nombre de usuario como parámetro
        navigate('/lobby', { state: { usuario } });
      } else {
        setAlerta({ msg: 'Credenciales incorrectas' });
      }
    } catch (error) {
      console.error('Error de inicio de sesión:', error);
      setAlerta({ msg: 'Error de inicio de sesión' });
    }
  };

  const { msg } = alerta;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-3xl font-semibold text-sky-700 mb-4 text-center">Inicia sesión</h1>
        {msg && <Alerta alerta={alerta} />}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-gray-600 font-semibold block">Usuario </label>
            <input
              type="text"
              placeholder="Nombre de Usuario"
              className="w-full p-2 border rounded-lg bg-gray-100"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
            />
          </div>
          <div>
            <label className="text-gray-600 font-semibold block">Contraseña</label>
            <input
              type="password"
              placeholder="Contraseña"
              className="w-full p-2 border rounded-lg bg-gray-100"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-sky-700 text-white font-semibold rounded-lg hover:bg-sky-800 focus:outline-none focus:ring focus:ring-sky-400 transition-colors"
          >
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
