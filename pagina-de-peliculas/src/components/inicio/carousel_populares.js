import React, { useEffect, useState, useContext } from 'react';
import './carousel_populares.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAnglesRight, faAnglesLeft } from '@fortawesome/free-solid-svg-icons';
import BotonSeguir from "../botonSeguir/botonSeguir";
import { HeaderContext } from "../header/headerContext";

const CarouselPoulares = ({ items }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [personasCercanas, setPersonasCercanas] = useState([]);
  const [listaUsuarios, setUsuarios] = useState([]);
  const { userData, isLoggedIn, updateMovieData, movieData } = useContext(HeaderContext);
  useEffect(() => {
    const obtenerDatosUsuario = async () => {
      const responseUsuario = await fetch(`http://localhost:8000/usuarios`, {
        method: "GET",
        headers: {
          accept: "application/json",
        },
      });
      var dataUsuario = await responseUsuario.json();

      return dataUsuario
    };
    var promesaUsuarios = obtenerDatosUsuario();
    promesaUsuarios.then((data) => {
      setUsuarios(data);

    }).catch((error) => {
      console.error(error);
    });
    const obtenerUsuariosPopulares = async () => {

      if (isLoggedIn) {
        const personasCercanas = await fetch(`http://localhost:8000/cercanas/${userData.id}`);
        const dataPersonasCercanas = await personasCercanas.json();
        var dataFiltrado = dataPersonasCercanas.filter(data => data.id_usuario !== userData.id);
        setPersonasCercanas(dataFiltrado);
      } else {
        setPersonasCercanas([]);
      }
    };
    obtenerUsuariosPopulares();
  }, [isLoggedIn]);
  const handlePrev = () => {
    setActiveIndex(prevIndex => (prevIndex === 0 ? items.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setActiveIndex(prevIndex => (prevIndex === items.length - 1 ? 0 : prevIndex + 1));
  };
  console.log(items);

  return (
    <div className="carousel">
      <div className="carousel-inner">
        {items.map((item, index) => (
          <div
            key={index}
            className={`carousel-item ${index === activeIndex ? 'active' : ''}`}
          >
            <div className="carousel-central-populares">
              <div className='carousel-central-hijo'>
                <button className="carousel-button" onClick={handlePrev}>
                  <FontAwesomeIcon icon={faAnglesLeft} />
                </button>
                <h5 className='usuario-top'>{item.usuario}</h5>
                
                <button className="carousel-button" onClick={handleNext}>
                  <FontAwesomeIcon icon={faAnglesRight} />
                </button>
              </div>
              <div className='usuarios-conocidos-inicio'>
                {personasCercanas.length > 0 && (
                  personasCercanas.map((usuario) => {
                    var usuarios = listaUsuarios.find(user => user.nombre_usuario === usuario.nombre_usuario);
                    return (
                      <div key={usuarios.id} className='usuarios-conocidos-inicio-hijo'>
                        <span className='nombre-usuario-sugerencias'>{usuario.nombre_usuario}</span><br />
                        <span className='nombre-completo-sugerencias'>{usuario.nombre_completo}</span><br />
                        <BotonSeguir class="boton-seguir-populares" usuario={usuarios} actualizarDatos={undefined} />
                      </div>)

                  }
                  )
                )}
              </div>
            </div>
            <div className='reviews-de-populares-padre'>
              <h5 className='mensaje-usuario-review'>Viendo las reseñas de {item.usuario}</h5>
              <div className='reviews-de-populares'>
                {item.listaReviews.map((review, index) => {
                  return (
                    <p key={index}>{review.contenido}</p>
                  )
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CarouselPoulares;
