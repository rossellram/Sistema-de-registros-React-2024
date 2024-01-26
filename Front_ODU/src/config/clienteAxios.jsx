// clienteAxios.jsx
import axios from 'axios';

if (!window._env_) {
  console.error("window._env_ no está definido. Asegúrate de que esté configurado correctamente.");
}


const baseURLVista = window._env_.REACT_APP_API_URL_VISTA|| '';
const baseURLLogin = window._env_.REACT_APP_API_URL_LOGIN || '';
const baseURLForm = window._env_.REACT_APP_API_URL_FORM || '';


const clienteAxiosLogin = axios.create({
  baseURL: baseURLLogin,
});


const clienteAxiosVista = axios.create({
  baseURL: baseURLVista,
});

const clienteAxiosForm = axios.create({
  baseURL: baseURLForm,
});

export { clienteAxiosLogin, clienteAxiosForm, clienteAxiosVista };