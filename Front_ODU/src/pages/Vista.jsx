import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { clienteAxiosForm } from '../config/clienteAxios';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';


import * as XLSX from 'xlsx';

const LoadingMessage = () => {
  return <div>Por favor espera, los datos se estan cargando...</div>;
};

function Vista() {
  const navigate = useNavigate();
  const [datosAlmacenados, setDatosAlmacenados] = useState([]);
  const [orden, setOrden] = useState('fecha_subida'); 
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalImages, setModalImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {

        setLoading(true);
        const response = await clienteAxiosForm.get('/datos-almacenados');
        const formattedData = response.data.map((item) => ({
          ...item,
        }));

        formattedData.forEach((item) => {
          console.log('Cadenas Base64 de las imágenes:', item.imagenes);
        });

        const sortedData = formattedData.sort((a, b) => new Date(b.fecha_ingreso) - new Date(a.fecha_ingreso));
        setDatosAlmacenados(sortedData);
      } catch (error) {
        console.error('Error al obtener datos:', error);
      } finally {
        // Indicar que la carga ha terminado
        setLoading(false);
      }
    };

    fetchData();
  }, [orden]);

  const handleBack = () => navigate(-1);

  const handleExportToExcel = async () => {
    try {
      const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
      const fileExtension = '.xlsx';

      const formattedData = datosAlmacenados.map(({ id, fecha_publicacion, tipo_de_medio, nombre_medio, otro_tipo_medio, otro_nombre_medio, descripcion, como_se_entero, enlaces, imagenes, nombre_usuario }) => ({
        ID: id,
        'Fecha Formulario': new Date(fecha_publicacion).toLocaleDateString(),
        'Tipo de Medio': tipo_de_medio,
        'Nombre de Medio': nombre_medio,
        'Otro Tipo de Medio': otro_tipo_medio,
        'Otro Nombre de Medio': otro_nombre_medio,
        Descripción: descripcion,
        'Cómo se enteró': como_se_entero,
        Enlaces: enlaces,
        Imágenes: imagenes ? 'Con imagen' : 'Sin imagen',
        'Usuario': nombre_usuario,
      }));

      const ws = XLSX.utils.json_to_sheet(formattedData);
      const wb = { Sheets: { data: ws }, SheetNames: ['data'] };

      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const data = new Blob([excelBuffer], { type: fileType });
      const fileName = 'datos_almacenados' + fileExtension;

      const linkExcel = document.createElement('a');
      linkExcel.href = URL.createObjectURL(data);
      linkExcel.download = fileName;
      linkExcel.click();
    } catch (error) {
      console.error('Error al exportar a Excel:', error.message);
    }
  };

  const handleOpenPreview = (row) => {
    if (row && row.enlaces && isValidUrl(row.enlaces)) {
      window.open(row.enlaces, '_blank');
    } else {
      console.error('El campo row.enlaces no es una URL válida.');
    }
  };

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  };

  const handleOpenImageModal = (images) => {
    setModalImages(images);
    setModalIsOpen(true);
  };

  const handleCloseImageModal = () => {
    setModalImages([]);
    setModalIsOpen(false);
  };


  const columns = [
    { name: 'ID', selector: 'id', sortable: true, minWidth: '50px' },
    { name: 'Usuario', selector: 'nombre_usuario', sortable: true, cell: (row) => row.nombre_usuario, minWidth: '120px' },
    { name: 'Fecha Formulario', selector: 'fecha_publicacion', sortable: true, format: (row) => new Date(row.fecha_publicacion).toLocaleDateString() },
    { name: 'Tipo de Medio', selector: 'tipo_de_medio', sortable: true },
    { name: 'Nombre de Medio', selector: 'nombre_medio', sortable: true },
    { name: 'Otro Tipo de Medio', selector: 'otro_tipo_medio', sortable: true },
    { name: 'Otro Nombre de Medio', selector: 'otro_nombre_medio', sortable: true },
    { name: 'Descripción', selector: 'descripcion', sortable: true },
    { name: 'Cómo se enteró', selector: 'como_se_entero', sortable: true },
    { name: 'Enlaces', selector: 'enlaces', sortable: true, cell: (row) => (
      <div>
        {row.enlaces && isValidUrl(row.enlaces) && (
          <a
            href={row.enlaces}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline cursor-pointer"
            onClick={() => handleOpenPreview(row)}
          >
            {row.enlaces}
          </a>
        )}
      </div>
    )},

    {
      name: 'Imágenes',
      cell: (row) => (
        <div>
          {row.imagenes && row.imagenes.length > 0 && (
            <div>
              {/* Muestra la primera imagen y abre el modal al hacer clic */}
              <img
                src={`data:image/jpeg;base64,${row.imagenes[0]}`}
                alt={`imagen_${row.id}_1`}
                className="cursor-pointer max-h-12 mr-2"
                onClick={() => handleOpenImageModal(row.imagenes)}
              />
             {/* Verifica si hay más de una imagen y muestra las adicionales en el modal */}
              {row.imagenes.length > 1 && (
                <div>
        
                  <span
                    className="text-blue-500 cursor-pointer"
                    onClick={() => handleOpenImageModal(row.imagenes.slice(1))}
                  >
                    {/* Puedes agregar un icono de "más" aquí si lo deseas */}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      ),
    },
  ];
  
  return (
    <div className="container mx-auto mt-4">
     <h1 className="text-2xl font-bold mb-4" style={{ color: 'navy' }}>ODU</h1>


      <div className="flex justify-end mb-4">
        <button
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 focus:outline-none"
          onClick={handleBack}
        >
          Volver
        </button>
        <button
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
          onClick={handleExportToExcel}
        >
          Exportar a Excel
        </button>
      </div>
    
  
      <DataTable
        title="Datos Almacenados"
        columns={columns}
        data={datosAlmacenados}
        pagination
        responsive
        paginationPerPage={10}
        paginationRowsPerPageOptions={[10, 20, 30]}
        paginationComponentOptions={{
          rowsPerPageText: 'Filas por página:',
          rangeSeparatorText: 'de',
        }}
        className="w-full mb-4 border"
        striped
        highlightOnHover
        customStyles={{
          headRow: { style: { backgroundColor: 'bg-gray-800' } },
          headCells: { style: { fontSize: '14px', color: 'text-white', padding: '2px' } },
          cells: { style: { fontSize: '14px', padding: '2px' } },
        }}
      // Utiliza la prop noDataComponent para personalizar el mensaje cuando no hay datos
        noDataComponent={<LoadingMessage />}
      />

      {/* Modal para mostrar todas las imágenes */}
      <Modal
  isOpen={modalIsOpen}
  onRequestClose={handleCloseImageModal}
  contentLabel="Imágenes"
  // Estilos personalizados para el modal
  style={{
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      // Puedes agregar más estilos según tus preferencias
    },
    overlay: {
      background: 'rgba(0, 0, 0, 0.5)',
      // Puedes ajustar el color y la opacidad del fondo del modal
    },
  }}
>
  {/* Botón "Cerrar" estilizado con Tailwind CSS */}
  <button
    onClick={handleCloseImageModal}
    className="absolute top-2 right-2 px-4 py-2 bg-blue-500 text-white rounded cursor-pointer"
  >
    Cerrar
  </button>
  <h2 className="text-xl mb-4">Imágenes</h2>
  <div className="flex flex-wrap gap-4">
    {modalImages.map((image, index) => (
      <div key={index}>
        <img src={`data:image/jpeg;base64,${image}`} alt={`imagen_${index}`} />
      </div>
    ))}
  </div>
</Modal>
    </div>
  );
}

export default Vista;