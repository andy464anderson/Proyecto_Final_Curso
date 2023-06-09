import React, { useEffect, useState, useContext } from 'react';
import './carousel_populares.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAnglesRight, faAnglesLeft } from '@fortawesome/free-solid-svg-icons';
import BotonSeguir from "../botonSeguir/botonSeguir";
import { HeaderContext } from "../header/headerContext";
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const CarouselPoulares = ({ items }) => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const [personasCercanas, setPersonasCercanas] = useState([]);
  const [listaUsuarios, setUsuarios] = useState([]);
  const { userData, isLoggedIn, movieData, dataUsuarios, updateDataUsuario } = useContext(HeaderContext);

  useEffect(() => {
   
    const obtenerDatosUsuario = async () => {
      
      const responseUsuario = await fetch(`https://13.48.181.115/usuarios`, {
        method: "GET",
        headers: {
          accept: "application/json",
        },
      });
      
      var dataUsuarios = await responseUsuario.json();
      setUsuarios(dataUsuarios);
      updateDataUsuario(dataUsuarios);

    };

    if (dataUsuarios==null) {
      obtenerDatosUsuario();
    } else {
      setUsuarios(dataUsuarios);
    }
  }, []);

  useEffect(() => {

    const obtenerUsuariosPopulares = async () => {
      if (isLoggedIn && userData) {
        const personasCercanas = await fetch(`https://13.48.181.115/cercanas/${userData.id}`);
        const dataPersonasCercanas = await personasCercanas.json();
        var dataFiltrado = dataPersonasCercanas.filter(data => data.id_usuario !== userData.id);
        setPersonasCercanas(dataFiltrado);
      } else {
        setPersonasCercanas([]);
      }
    };
    if (!personasCercanas || personasCercanas.length === 0) {
      obtenerUsuariosPopulares();
    }
  },[]);

  const handlePrev = () => {
    setActiveIndex(prevIndex => (prevIndex === 0 ? items.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setActiveIndex(prevIndex => (prevIndex === items.length - 1 ? 0 : prevIndex + 1));
  };

  if (listaUsuarios.length === 0 && !movieData && personasCercanas.length === 0 && !items) {
    return null
  } else {
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
                  <h5 onClick={() => navigate(`/perfil/${item.usuario}`)} className='usuario-top'>{item.usuario}</h5>

                  <button className="carousel-button" onClick={handleNext}>
                    <FontAwesomeIcon icon={faAnglesRight} />
                  </button>
                </div>
                <div className='usuarios-conocidos-inicio'>
                  {personasCercanas.length > 0 && listaUsuarios.length > 0 && (
                    personasCercanas.map((usuario) => {
                      var usuarios = listaUsuarios.find(user => user.nombre_usuario === usuario.nombre_usuario);
                      return (
                        <div key={usuarios.id} className='usuarios-conocidos-inicio-hijo'>
                          <span onClick={() => navigate(`/perfil/${usuario.nombre_usuario}`)} className='nombre-usuario-sugerencias'>{usuario.nombre_usuario}</span><br />
                          <span className='nombre-completo-sugerencias'>{usuario.nombre_completo}</span><br />
                          <BotonSeguir className="boton-seguir-populares" usuario={usuarios} actualizarDatos={undefined} />
                        </div>
                      )
                    })
                  )}
                </div>
              </div>
              <div className='reviews-de-populares-padre'>
                <h5 className='mensaje-usuario-review'>Viendo las últimas reseñas de {item.usuario}</h5>
                <div className='reviews-de-populares'>
                  {item.listaReviews.map((review, index) => {
                    var peli = movieData.find(p => p.id === review.idPeli);
                    return (
                      <div key={index} className='info-review-populares-padre'>
                        <img className='info-review-populares-poster' src={peli.poster} alt={peli.title} />
                        <div className='info-review-populares'>
                          <h3 onClick={() => navigate(`/detalle/${peli.id}`)} className='info-review-populares-titulo'>{peli.title}</h3>
                          <div>
                            {review.valoracion === 1 ? (
                              <div className="nota-comentario-detalle"><FontAwesomeIcon icon={faStar} /></div>
                            ) : null}
                            {review.valoracion === 2 ? (
                              <div className="nota-comentario-detalle">
                                <FontAwesomeIcon icon={faStar} />
                                <FontAwesomeIcon icon={faStar} />
                              </div>
                            ) : null}
                            {review.valoracion === 3 ? (
                              <div className="nota-comentario-detalle">
                                <FontAwesomeIcon icon={faStar} />
                                <FontAwesomeIcon icon={faStar} />
                                <FontAwesomeIcon icon={faStar} />
                              </div>
                            ) : null}
                            {review.valoracion === 4 ? (
                              <div className="nota-comentario-detalle">
                                <FontAwesomeIcon icon={faStar} />
                                <FontAwesomeIcon icon={faStar} />
                                <FontAwesomeIcon icon={faStar} />
                                <FontAwesomeIcon icon={faStar} />
                              </div>
                            ) : null}
                            {review.valoracion === 5 ? (
                              <div className="nota-comentario-detalle">
                                <FontAwesomeIcon icon={faStar} />
                                <FontAwesomeIcon icon={faStar} />
                                <FontAwesomeIcon icon={faStar} />
                                <FontAwesomeIcon icon={faStar} />
                                <FontAwesomeIcon icon={faStar} />
                              </div>
                            ) : null}
                          </div>
                          <p className='info-review-populares-comentario'>{review.contenido}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
};

export default CarouselPoulares;
