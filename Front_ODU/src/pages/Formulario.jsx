import React, { useState, useEffect } from 'react';
import { clienteAxiosForm } from '../config/clienteAxios';
import { useAuth } from '../components/AuthContext';
import { useNavigate } from 'react-router-dom';

function Formulario() {

  const { user } = useAuth();

  const [formData, setFormData] = useState({
    fecha: '',
    nombreMedio: '',
    tipoDeMedio: '',
    enlaces: '',
    descripcion: '',
    comoSeDioCuenta: '',
  });


  const navigate = useNavigate();

  const [mostrarCampoOtro, setMostrarCampoOtro] = useState(false);
  const [otroTipoMedio, setOtroTipoMedio] = useState('');

  const [mostrarCampoOtroNombreMedio, setMostrarCampoOtroNombreMedio] = useState(false);
  const [otroNombreMedio, setOtroNombreMedio] = useState('');

  const [errorFecha, setErrorFecha] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');
  const [mostrarMensajeFlotante, setMostrarMensajeFlotante] = useState(false);
  const [mostrarMensajeFecha, setMostrarMensajeFecha] = useState(false);

  
  
  const handleInputChange = (e, fieldName) => {
    let { value } = e.target;
    value = value.toUpperCase();
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));

  };

  const handleImageUpload = async (event) => {
    const files = event.target.files;
    const maxSizePerFile = 20 * 1024 * 1024; // 20 MB en bytes
    const maxTotalSize = 3 * maxSizePerFile; // Límite total para 3 archivos
  
    let totalSize = 0;
    const imagesArray = [];
  
    for (const file of files) {
      totalSize += file.size;
  
      if (totalSize > maxTotalSize) {
        alert('El tamaño total de los archivos no puede exceder 60 MB');
        // Puedes decidir qué hacer en caso de exceder el límite, por ejemplo, limpiar la selección.
        event.target.value = null;
        return;
      }
  
      if (file.size <= maxSizePerFile) {
        try {
          const base64Image = await convertImageToBase64(file);
          console.log('Tamaño original de la imagen:', file.size);
          console.log('Tamaño de la imagen en base64:', base64Image.length);
          imagesArray.push(base64Image);
        } catch (error) {
          console.error('Error al convertir la imagen a base64:', error);
        }
      } else {
        alert('La imagen es demasiado grande. Selecciona una imagen más pequeña.');
      }
    }
  
    console.log('Número de imágenes cargadas:', imagesArray.length);
    console.log('Cadenas Base64 de las imágenes:', imagesArray);
  
    // Puedes hacer algo con el array de imágenes, como enviarlo al servidor o actualizar el estado en tu componente
    setFormData((prevData) => ({
      ...prevData,
      imagenes: imagesArray,
    }));
  };
  
  
  const convertImageToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result.split(',')[1]); // Obtén solo la parte de datos Base64 (después de la coma)
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };
  
  
  
  const handleTipoMedioChange = (e) => {
    const selectedOption = e.target.value;
    setFormData((prevData) => ({
      ...prevData,
      tipoDeMedio: selectedOption,
      otroTipoMedio: selectedOption === 'Otro' ? otroTipoMedio : '',
    }));
    setMostrarCampoOtro(selectedOption === 'Otro');
  };
  
  const handleNombreMedioChange = (e) => {
    const selectedOption = e.target.value;
    setFormData((prevData) => ({
      ...prevData,
      nombreMedio: selectedOption,
      otroNombreMedio: selectedOption === 'Otro' ? otroNombreMedio : '',
    }));
    setMostrarCampoOtroNombreMedio(selectedOption === 'Otro');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await clienteAxiosForm.post('/form', {
        ...formData,
        user: { username: user.username },
        otroTipoMedio: otroTipoMedio.toUpperCase(),
        otroNombreMedio: otroNombreMedio.toUpperCase(),
      });
  
      setMensajeExito('Se enviaron los datos correctamente');
      setFormData({
        fecha: '',
        nombreMedio: '',
        tipoDeMedio: '',
        enlaces: '',
        imagenes: [],
        descripcion: '',
        comoSeDioCuenta: '',
        otroTipoMedio: '',
        otroNombreMedio: '',
      });
  
      setMostrarMensajeFlotante(true);
      setMostrarMensajeFecha(false);
      setOtroTipoMedio('');
      setOtroNombreMedio('');
  
      alert('Se enviaron los datos');
      navigate('/Vista');
    } catch (error) {
      console.error('Error al enviar datos al backend:', error);
  
      if (error.response) {
        console.error('Respuesta del servidor:', error.response.data);
        console.error('Estado HTTP:', error.response.status);
      } else if (error.request) {
        console.error('No se recibió respuesta del servidor.');
      } else {
        console.error('Error de configuración de la solicitud:', error.message);
      }
    }
  };
  

  useEffect(() => {
    // Oculta el mensaje flotante de fecha después de 5 segundos
    const fechaTimeoutId = setTimeout(() => {
      setMostrarMensajeFecha(false);
    }, 5000);

    // Limpia el temporizador al desmontar el componente
    return () => clearTimeout(fechaTimeoutId);
  }, [mostrarMensajeFecha]);

  useEffect(() => {
    // Oculta el mensaje flotante de éxito después de 2 segundos
    const exitoTimeoutId = setTimeout(() => {
      setMostrarMensajeFlotante(false);
    }, 2000);

    // Limpia el temporizador al desmontar el componente
    return () => clearTimeout(exitoTimeoutId);
  }, [mostrarMensajeFlotante]);

  return (
    <div className="flex items-center justify-center h-full">
      <div className="bg-white p-8 rounded shadow-md mt-4 w-full max-w-md relative">
        {user && (
          <p className="text-M font-semibold text-sky-700 mb-4 text-center">
            {user.username}
          </p>
        )}

        <h1 className="text-l font-semibold text-sky-700 mb-4 text-center">
          OBSERVATORIO DEMOGRAFICO UNIVERSITARIO
        </h1>

        {mostrarMensajeFlotante && (
          <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-50 text-white">
            <div className="bg-white p-4 rounded-lg">
              <span className="text-black">{mensajeExito}</span>
            </div>
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-gray-600 font-semibold block">FECHA</label>
            <input
              type="date"
              name="fecha"
              value={formData.fecha}
              onChange={(e) => handleInputChange(e, 'fecha')}
              className="w-full p-2 border rounded-lg bg-gray-100"
              required
            />
            {mostrarMensajeFecha && (
              <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-50 text-white">
                <div className="bg-white p-4 rounded-lg">
                  <span className="text-black">{errorFecha}</span>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="text-gray-600 font-semibold block">TIPO DE MEDIO</label>
            <select
              name="tipoDeMedio"
              value={formData.tipoDeMedio}
              onChange={handleTipoMedioChange}
              className="w-full p-2 border rounded-lg bg-gray-100"
              required
            >
              <option value=""></option>
              <option value="Digital">DIGITAL</option>
              <option value="Escrito">ESCRITO</option>
              <option value="Radio">RADIO</option>
              <option value="Television">TELEVISION</option>
              <option value="Red">FACEBOOK</option>
              <option value="Red">TWITTER</option>
              <option value="Red">INSTAGRAM</option>
              <option value="Otro">--OTRO--</option>
            </select>
            {formData.tipoDeMedio && (
              <p className="text-gray-600">
                Tipo de Medio seleccionado: <strong>{formData.tipoDeMedio}</strong>
              </p>
            )}
          </div>

          {mostrarCampoOtro && formData.tipoDeMedio === 'Otro' && (
            <div>
              <label className="text-gray-600 font-semibold block">TIPO DE MEDIO (Otro)</label>
              <input
                type="text"
                name="otroTipoMedio"
                value={otroTipoMedio}
                onChange={(e) => setOtroTipoMedio(e.target.value.toUpperCase())}
                className="w-full p-2 border rounded-lg bg-gray-100"
                required
              />
            </div>
          )}

          <div>
            <label className="text-gray-600 font-semibold block">NOMBRE DEL MEDIO</label>
            <select
              name="nombreMedio"
              value={formData.nombreMedio}
              onChange={handleNombreMedioChange}
              className="w-full p-2 border rounded-lg bg-gray-100"
              required
            >
              <option value=""></option>
              <option value="Presencia Universitaria">Presencia Universitaria</option>
              <option value="El Heraldo">El Heraldo</option>
              <option value="La Tribuna">La Tribuna</option>
              <option value="La Prensa">La Prensa</option>
              <option value="El País">Diario El País</option>
              <option value="HonduDiario">HonduDiario</option>
              <option value="Televicentro">Televicentro</option>
              <option value="Proceso Digial">Proceso Digital</option>
              <option value="HCH">HCH</option>
              <option value="Canal 11">CANAL 11</option>
              <option value="Canal 08">CANAL 08</option>
              <option value="Radio America">Radio América</option>
              <option value="HRN ">HRN</option>
              <option value="Otro">--OTRO--</option>

            </select>
            {formData.nombreMedio && (
              <p className="text-gray-600"> 
                Medio seleccionado: <strong>{formData.nombreMedio === 'Otro' ? otroNombreMedio : formData.nombreMedio}</strong>
              </p>
            )}
          </div>

          {mostrarCampoOtroNombreMedio && formData.nombreMedio === 'Otro' && (
            <div>
              <label className="text-gray-600 font-semibold block">NOMBRE DEL MEDIO (Otro)</label>
              <input
                type="text"
                name="otronombreMedio"
                value={otroNombreMedio}
                onChange={(e) => setOtroNombreMedio(e.target.value)}
                className="w-full p-2 border rounded-lg bg-gray-100"
                required
              />
            </div>
          )}

<div>
  <label className="text-gray-600 font-semibold block">
    SUBIR IMAGEN (máx. 3 archivos, 20MB c/u)
  </label>
  <input
    type="file"
    name="imagenes"
    accept="image/*"
    multiple
    onChange={handleImageUpload}
    className="w-full p-2 border rounded-lg bg-gray-100"
    required
    size={20971520} // 20 MB en bytes (1 MB = 1048576 bytes)
  />
</div>


          <div>
            <label className="text-gray-600 font-semibold block">DESCRIPCION</label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={(e) => handleInputChange(e, 'descripcion')}
              className="w-full p-2 border rounded-lg bg-gray-100"
              maxLength="500"
              rows="5"
              required
            />
          </div>

          <div>
            <label className="text-gray-600 font-semibold block">¿CÓMO SE ENTERÓ?</label>
            <textarea
              name="comoSeDioCuenta"
              value={formData.comoSeDioCuenta}
              onChange={(e) => handleInputChange(e, 'comoSeDioCuenta')}
              className="w-full p-2 border rounded-lg bg-gray-100"
              maxLength="500"
              rows="5"
              required
            />
          </div>

          <div>
            <label className="text-gray-600 font-semibold block">ENLACES</label>
            <input
              type="text"
              name="enlaces"
              value={formData.enlaces}
              onChange={(e) => handleInputChange(e, 'enlaces')}
              className="w-full p-2 border rounded-lg bg-gray-100"
              
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-sky-700 text-white font-semibold rounded-lg hover:bg-sky-800 focus:outline-none focus:ring focus:ring-sky-400 transition-colors"
          >
            ENVIAR
          </button>

          {/* Mensaje flotante para éxito */}
          {mostrarMensajeFlotante && (
            <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-50 text-white">
              <div className="bg-white p-4 rounded-lg">
                <span className="text-black">{mensajeExito}</span>
              </div>
            </div>
          )}

          {/* Mensaje flotante para error de fecha */}
          {mostrarMensajeFecha && (
            <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-50 text-white">
              <div className="bg-white p-4 rounded-lg">
                <span className="text-black">{errorFecha}</span>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default Formulario;